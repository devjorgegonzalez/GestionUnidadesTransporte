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
  Conductor,
  ConductorDocument,
} from '../database/schemas/conductor.schema.js';
import { CreateReservaViajeDto } from './dto/create-reserva-viaje.dto.js';
import { UpdateReservaViajeDto } from './dto/update-reserva-viaje.dto.js';
import { QueryReservasViajesDto } from './dto/query-reservas-viajes.dto.js';

@Injectable()
export class ReservasViajesService {
  constructor(
    @InjectModel(ReservaViaje.name)
    private readonly reservaModel: Model<ReservaViajeDocument>,
    @InjectModel(UnidadTransporte.name)
    private readonly utModel: Model<UnidadTransporteDocument>,
    @InjectModel(Conductor.name)
    private readonly conductorModel: Model<ConductorDocument>,
  ) {}

  async create(dto: CreateReservaViajeDto) {
    const ut = await this.utModel.findById(dto.utId);
    if (!ut) {
      throw new NotFoundException(
        `Unidad de transporte con ID ${dto.utId} no encontrada`,
      );
    }

    if (
      ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO ||
      ut.estado === EstadoUnidadTransporte.INACTIVA
    ) {
      throw new BadRequestException(
        `No es posible reservar la UT ${ut.placa} porque actualmente se encuentra en estado '${ut.estado}'. Solo se admiten unidades DISPONIBLES o VIAJANDO.`,
      );
    }

    const conductor = await this.conductorModel.findById(dto.conductorId);
    if (!conductor || !conductor.activo) {
      throw new BadRequestException(
        `El conductor asignado no existe o se encuentra inactivo.`,
      );
    }

    const reserva = await this.reservaModel.create({
      utId: ut._id,
      placaUt: ut.placa,
      conductorId: conductor._id,
      cedulaConductor: conductor.cedula,
      nombreConductor: `${conductor.nombre} ${conductor.apellido}`,
      fechaHoraInicioProgramada: new Date(dto.fechaHoraInicioProgramada),
      origen: {
        ...dto.origen,
        puntoFrecuenteId: dto.origen.puntoFrecuenteId
          ? new Types.ObjectId(dto.origen.puntoFrecuenteId)
          : undefined,
      },
      destino: {
        ...dto.destino,
        puntoFrecuenteId: dto.destino.puntoFrecuenteId
          ? new Types.ObjectId(dto.destino.puntoFrecuenteId)
          : undefined,
      },
      kmSugeridosGoogle: dto.kmSugeridosGoogle,
      duracionSugeridaMinutos: dto.duracionSugeridaMinutos ?? 0,
      polylineSugerida: dto.polylineSugerida ?? '',
      estado: EstadoReservaViaje.PROGRAMADA,
    });

    return reserva;
  }

  async findAll(query: QueryReservasViajesDto) {
    const filter: Record<string, any> = {};

    if (query.estado) {
      filter.estado = query.estado;
    }

    if (query.placaUt) {
      filter.placaUt = new RegExp(query.placaUt.trim(), 'i');
    }

    if (query.cedulaConductor) {
      filter.cedulaConductor = query.cedulaConductor.trim();
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

  async findById(id: string) {
    const reserva = await this.reservaModel
      .findById(id)
      .populate('utId', 'marca modelo tipo kilometraje')
      .populate('conductorId', 'telefono');
    if (!reserva) {
      throw new NotFoundException(`Reserva de viaje con ID ${id} no encontrada`);
    }
    return reserva;
  }

  async update(id: string, dto: UpdateReservaViajeDto) {
    const reserva = await this.findById(id);

    if (reserva.estado !== EstadoReservaViaje.PROGRAMADA) {
      throw new BadRequestException(
        `Solo se pueden modificar reservas que se encuentren en estado PROGRAMADA. Estado actual: ${reserva.estado}`,
      );
    }

    if (dto.utId && dto.utId !== reserva.utId._id.toString()) {
      const ut = await this.utModel.findById(dto.utId);
      if (!ut) {
        throw new NotFoundException(`Unidad con ID ${dto.utId} no encontrada`);
      }
      if (
        ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO ||
        ut.estado === EstadoUnidadTransporte.INACTIVA
      ) {
        throw new BadRequestException(
          `La UT ${ut.placa} no está disponible (estado actual: ${ut.estado}).`,
        );
      }
      reserva.utId = ut._id;
      reserva.placaUt = ut.placa;
    }

    if (dto.conductorId && dto.conductorId !== reserva.conductorId._id.toString()) {
      const conductor = await this.conductorModel.findById(dto.conductorId);
      if (!conductor || !conductor.activo) {
        throw new BadRequestException('El conductor asignado no está activo.');
      }
      reserva.conductorId = conductor._id;
      reserva.cedulaConductor = conductor.cedula;
      reserva.nombreConductor = `${conductor.nombre} ${conductor.apellido}`;
    }

    if (dto.fechaHoraInicioProgramada) {
      reserva.fechaHoraInicioProgramada = new Date(
        dto.fechaHoraInicioProgramada,
      );
    }

    if (dto.origen) {
      reserva.origen = {
        ...dto.origen,
        puntoFrecuenteId: dto.origen.puntoFrecuenteId
          ? new Types.ObjectId(dto.origen.puntoFrecuenteId)
          : undefined,
      };
    }
    if (dto.destino) {
      reserva.destino = {
        ...dto.destino,
        puntoFrecuenteId: dto.destino.puntoFrecuenteId
          ? new Types.ObjectId(dto.destino.puntoFrecuenteId)
          : undefined,
      };
    }
    if (dto.kmSugeridosGoogle !== undefined) {
      reserva.kmSugeridosGoogle = dto.kmSugeridosGoogle;
    }
    if (dto.duracionSugeridaMinutos !== undefined) {
      reserva.duracionSugeridaMinutos = dto.duracionSugeridaMinutos;
    }
    if (dto.polylineSugerida !== undefined) {
      reserva.polylineSugerida = dto.polylineSugerida;
    }

    await reserva.save();
    return reserva;
  }

  async cancelar(id: string) {
    const reserva = await this.findById(id);

    if (reserva.estado !== EstadoReservaViaje.PROGRAMADA) {
      throw new BadRequestException(
        `Solo se pueden cancelar reservas en estado PROGRAMADA. Estado actual: ${reserva.estado}`,
      );
    }

    reserva.estado = EstadoReservaViaje.CANCELADA;
    await reserva.save();
    return reserva;
  }
}
