import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ReservaViaje,
  ReservaViajeDocument,
  EstadoReservaViaje,
} from '../database/schemas/reserva-viaje.schema.js';
import {
  UnidadTransporte,
  UnidadTransporteDocument,
  EstadoUnidadTransporte,
} from '../database/schemas/unidad-transporte.schema.js';
import {
  PuntoTrackingViaje,
  PuntoTrackingViajeDocument,
} from '../database/schemas/punto-tracking.schema.js';
import { TrackingBatchDto } from './dto/tracking-batch.dto.js';
import { FinalizarViajeDto } from './dto/finalizar-viaje.dto.js';
import { JustificacionViajeDto } from './dto/justificacion-viaje.dto.js';
import { QueryHistorialViajesDto } from './dto/query-historial-viajes.dto.js';
import { calcularDistanciaRecorridoGpsKm } from './utils/haversine.helper.js';

@Injectable()
export class TrackingService {
  constructor(
    @InjectModel(ReservaViaje.name)
    private readonly reservaModel: Model<ReservaViajeDocument>,
    @InjectModel(UnidadTransporte.name)
    private readonly utModel: Model<UnidadTransporteDocument>,
    @InjectModel(PuntoTrackingViaje.name)
    private readonly trackingModel: Model<PuntoTrackingViajeDocument>,
  ) {}

  async iniciarViaje(viajeId: string) {
    const reserva = await this.reservaModel.findById(viajeId);
    if (!reserva) {
      throw new NotFoundException(`Viaje con ID ${viajeId} no encontrado`);
    }

    // Idempotencia: Si ya está en curso, retornar estado actual
    if (reserva.estado === EstadoReservaViaje.EN_CURSO) {
      const utActual = await this.utModel.findById(reserva.utId);
      return { reserva, ut: utActual };
    }

    if (reserva.estado !== EstadoReservaViaje.PROGRAMADA) {
      throw new BadRequestException(
        `Solo se pueden iniciar viajes que estén en estado PROGRAMADA. Estado actual: ${reserva.estado}`,
      );
    }

    const ut = await this.utModel.findById(reserva.utId);
    if (!ut) {
      throw new NotFoundException(`Unidad de transporte asociada no encontrada`);
    }

    // Actualizar UT a VIAJANDO
    ut.estado = EstadoUnidadTransporte.VIAJANDO;
    await ut.save();

    // Actualizar Reserva a EN_CURSO
    reserva.estado = EstadoReservaViaje.EN_CURSO;
    reserva.kilometrajeUtInicial = ut.kilometraje;
    reserva.fechaHoraInicioReal = new Date();
    await reserva.save();

    return { reserva, ut };
  }

  async registrarBatch(viajeId: string, dto: TrackingBatchDto) {
    const reserva = await this.reservaModel.findById(viajeId);
    if (!reserva) {
      throw new NotFoundException(`Viaje con ID ${viajeId} no encontrado`);
    }

    if (!dto.puntos || dto.puntos.length === 0) {
      return { procesados: 0 };
    }

    const bulkOps = dto.puntos.map((p) => ({
      updateOne: {
        filter: { idPuntoCliente: p.idPuntoCliente },
        update: {
          $setOnInsert: {
            viajeId: reserva._id,
            utId: reserva.utId,
            conductorId: reserva.conductorId,
            lat: p.lat,
            lng: p.lng,
            velocidadKmh: p.velocidadKmh,
            precisionMetros: p.precisionMetros,
            capturadoEn: new Date(p.capturadoEn),
            idPuntoCliente: p.idPuntoCliente,
          },
        },
        upsert: true,
      },
    }));

    await this.trackingModel.bulkWrite(bulkOps);

    return { procesados: dto.puntos.length };
  }

  async finalizarViaje(viajeId: string, dto?: FinalizarViajeDto) {
    const reserva = await this.reservaModel.findById(viajeId);
    if (!reserva) {
      throw new NotFoundException(`Viaje con ID ${viajeId} no encontrado`);
    }

    // Si ya fue finalizado, devolver resultado idempotentemente
    if (reserva.estado === EstadoReservaViaje.FINALIZADO) {
      const utActual = await this.utModel.findById(reserva.utId);
      return {
        reserva,
        ut: utActual,
        kmRealesGps: reserva.kmRealesGps,
        excedeUmbralKm: reserva.excedeUmbralKm,
        porcentajeDesviacionKm: reserva.porcentajeDesviacionKm,
      };
    }

    // Procesar último lote si viene en la petición (soporta 'puntos' o 'puntosFinales')
    const puntosAProcesar = dto?.puntos || dto?.puntosFinales;
    if (puntosAProcesar && puntosAProcesar.length > 0) {
      await this.registrarBatch(viajeId, { puntos: puntosAProcesar });
    }

    // Obtener todos los puntos GPS registrados para este viaje
    const puntos = await this.trackingModel
      .find({ viajeId: reserva._id })
      .sort({ capturadoEn: 1 });

    // Calcular distancia real GPS con fórmula de Haversine
    let kmRealesGps = calcularDistanciaRecorridoGpsKm(puntos);
    if (kmRealesGps <= 0 && reserva.kmSugeridosGoogle > 0) {
      // Si no hubo puntos GPS capturados (ej. prueba sin emulador de gps), tomar sugerido
      kmRealesGps = reserva.kmSugeridosGoogle;
    }

    const ut = await this.utModel.findById(reserva.utId);
    if (!ut) {
      throw new NotFoundException(`Unidad de transporte asociada no encontrada`);
    }

    // Incrementar kilometraje acumulado de la UT y pasar a DISPONIBLE
    ut.kilometraje = Number((ut.kilometraje + kmRealesGps).toFixed(2));
    ut.estado = EstadoUnidadTransporte.DISPONIBLE;
    await ut.save();

    // Calcular desviación porcentual respecto a Google Maps
    const kmSugeridos = reserva.kmSugeridosGoogle || 1;
    const porcentajeDesviacionKm = Number(
      (((kmRealesGps - kmSugeridos) / kmSugeridos) * 100).toFixed(2),
    );
    const excedeUmbralKm = porcentajeDesviacionKm > 10;

    // Actualizar registro del viaje a FINALIZADO
    reserva.estado = EstadoReservaViaje.FINALIZADO;
    reserva.kilometrajeUtFinal = ut.kilometraje;
    reserva.kmRealesGps = kmRealesGps;
    reserva.porcentajeDesviacionKm = porcentajeDesviacionKm;
    reserva.excedeUmbralKm = excedeUmbralKm;
    reserva.fechaHoraFinReal = new Date();
    await reserva.save();

    return {
      reserva,
      ut,
      kmRealesGps,
      excedeUmbralKm,
      porcentajeDesviacionKm,
    };
  }

  async getFlotaActiva() {
    const viajesActivos = await this.reservaModel
      .find({ estado: EstadoReservaViaje.EN_CURSO })
      .populate('utId', 'marca modelo tipo placa kilometraje')
      .populate('conductorId', 'nombre apellido telefono cedula');

    const resultado = await Promise.all(
      viajesActivos.map(async (viaje) => {
        const ultimosPuntos = await this.trackingModel
          .find({ viajeId: viaje._id })
          .sort({ capturadoEn: 1 });

        const ultimoPunto = ultimosPuntos[ultimosPuntos.length - 1];
        const distanciaHastaAhora = calcularDistanciaRecorridoGpsKm(ultimosPuntos);

        return {
          viajeId: viaje._id,
          placaUt: viaje.placaUt,
          conductor: viaje.nombreConductor,
          telefonoConductor: (viaje.conductorId as any)?.telefono,
          origen: viaje.origen,
          destino: viaje.destino,
          kmSugeridosGoogle: viaje.kmSugeridosGoogle,
          polylineSugerida: viaje.polylineSugerida,
          distanciaRecorridaKm: distanciaHastaAhora,
          ultimaUbicacion: ultimoPunto
            ? {
                lat: ultimoPunto.lat,
                lng: ultimoPunto.lng,
                velocidadKmh: ultimoPunto.velocidadKmh,
                capturadoEn: ultimoPunto.capturadoEn,
              }
            : null,
          recorridoRuta: ultimosPuntos.map((p) => ({
            lat: p.lat,
            lng: p.lng,
            velocidadKmh: p.velocidadKmh,
            capturadoEn: p.capturadoEn,
          })),
        };
      }),
    );

    return resultado;
  }

  async getHistorialViajes(query: QueryHistorialViajesDto) {
    const filter: Record<string, any> = {
      estado: {
        $in: [EstadoReservaViaje.EN_CURSO, EstadoReservaViaje.FINALIZADO],
      },
    };

    if (query.placa) {
      filter.placaUt = new RegExp(query.placa.trim(), 'i');
    }

    if (query.conductor) {
      const regex = new RegExp(query.conductor.trim(), 'i');
      filter.$or = [{ nombreConductor: regex }, { cedulaConductor: regex }];
    }

    if (query.fechaDesde || query.fechaHasta) {
      filter.fechaHoraInicioProgramada = {};
      if (query.fechaDesde) {
        filter.fechaHoraInicioProgramada.$gte = new Date(query.fechaDesde);
      }
      if (query.fechaHasta) {
        filter.fechaHoraInicioProgramada.$lte = new Date(query.fechaHasta);
      }
    }

    if (query.soloConExcesoKm) {
      filter.excedeUmbralKm = true;
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.reservaModel
        .find(filter)
        .sort({ fechaHoraInicioProgramada: -1 })
        .skip(skip)
        .limit(limit)
        .populate('utId', 'marca modelo tipo kilometraje')
        .populate('conductorId', 'telefono'),
      this.reservaModel.countDocuments(filter),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTrackingDetalle(viajeId: string) {
    const reserva = await this.reservaModel
      .findById(viajeId)
      .populate('utId', 'marca modelo tipo kilometraje')
      .populate('conductorId', 'telefono');

    if (!reserva) {
      throw new NotFoundException(`Viaje con ID ${viajeId} no encontrado`);
    }

    const puntos = await this.trackingModel
      .find({ viajeId: reserva._id })
      .sort({ capturadoEn: 1 });

    return {
      viaje: reserva,
      puntos: puntos.map((p) => ({
        id: p._id,
        lat: p.lat,
        lng: p.lng,
        velocidadKmh: p.velocidadKmh,
        precisionMetros: p.precisionMetros,
        capturadoEn: p.capturadoEn,
      })),
    };
  }

  async guardarJustificacion(viajeId: string, dto: JustificacionViajeDto) {
    const reserva = await this.reservaModel.findById(viajeId);
    if (!reserva) {
      throw new NotFoundException(`Viaje con ID ${viajeId} no encontrado`);
    }

    reserva.justificacionExcesoKm = dto.justificacionExcesoKm;
    await reserva.save();
    return reserva;
  }

  async getReservasHoy(user: any) {
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    const filter: any = {
      fechaHoraInicioProgramada: { $gte: inicioDia, $lte: finDia },
      estado: { $in: [EstadoReservaViaje.PROGRAMADA, EstadoReservaViaje.EN_CURSO] },
    };

    if (user?.rol === 'CONDUCTOR') {
      filter.cedulaConductor = user.cedula;
      if (user.placa) {
        filter.placaUt = user.placa;
      }
    }

    return this.reservaModel.find(filter).sort({ fechaHoraInicioProgramada: 1 });
  }
}
