var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReservaViaje, EstadoReservaViaje, } from '../database/schemas/reserva-viaje.schema.js';
import { UnidadTransporte, EstadoUnidadTransporte, } from '../database/schemas/unidad-transporte.schema.js';
import { PuntoTrackingViaje, } from '../database/schemas/punto-tracking.schema.js';
import { calcularDistanciaRecorridoGpsKm } from './utils/haversine.helper.js';
let TrackingService = class TrackingService {
    reservaModel;
    utModel;
    trackingModel;
    constructor(reservaModel, utModel, trackingModel) {
        this.reservaModel = reservaModel;
        this.utModel = utModel;
        this.trackingModel = trackingModel;
    }
    async iniciarViaje(viajeId) {
        const reserva = await this.reservaModel.findById(viajeId);
        if (!reserva) {
            throw new NotFoundException(`Viaje con ID ${viajeId} no encontrado`);
        }
        if (reserva.estado === EstadoReservaViaje.EN_CURSO) {
            const utActual = await this.utModel.findById(reserva.utId);
            return { reserva, ut: utActual };
        }
        if (reserva.estado !== EstadoReservaViaje.PROGRAMADA) {
            throw new BadRequestException(`Solo se pueden iniciar viajes que estén en estado PROGRAMADA. Estado actual: ${reserva.estado}`);
        }
        const ut = await this.utModel.findById(reserva.utId);
        if (!ut) {
            throw new NotFoundException(`Unidad de transporte asociada no encontrada`);
        }
        ut.estado = EstadoUnidadTransporte.VIAJANDO;
        await ut.save();
        reserva.estado = EstadoReservaViaje.EN_CURSO;
        reserva.kilometrajeUtInicial = ut.kilometraje;
        reserva.fechaHoraInicioReal = new Date();
        await reserva.save();
        return { reserva, ut };
    }
    async registrarBatch(viajeId, dto) {
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
    async finalizarViaje(viajeId, dto) {
        const reserva = await this.reservaModel.findById(viajeId);
        if (!reserva) {
            throw new NotFoundException(`Viaje con ID ${viajeId} no encontrado`);
        }
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
        if (dto && dto.puntos && dto.puntos.length > 0) {
            await this.registrarBatch(viajeId, { puntos: dto.puntos });
        }
        const puntos = await this.trackingModel
            .find({ viajeId: reserva._id })
            .sort({ capturadoEn: 1 });
        let kmRealesGps = calcularDistanciaRecorridoGpsKm(puntos);
        if (kmRealesGps <= 0 && reserva.kmSugeridosGoogle > 0) {
            kmRealesGps = reserva.kmSugeridosGoogle;
        }
        const ut = await this.utModel.findById(reserva.utId);
        if (!ut) {
            throw new NotFoundException(`Unidad de transporte asociada no encontrada`);
        }
        ut.kilometraje = Number((ut.kilometraje + kmRealesGps).toFixed(2));
        ut.estado = EstadoUnidadTransporte.DISPONIBLE;
        await ut.save();
        const kmSugeridos = reserva.kmSugeridosGoogle || 1;
        const porcentajeDesviacionKm = Number((((kmRealesGps - kmSugeridos) / kmSugeridos) * 100).toFixed(2));
        const excedeUmbralKm = porcentajeDesviacionKm > 10;
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
        const resultado = await Promise.all(viajesActivos.map(async (viaje) => {
            const ultimosPuntos = await this.trackingModel
                .find({ viajeId: viaje._id })
                .sort({ capturadoEn: 1 });
            const ultimoPunto = ultimosPuntos[ultimosPuntos.length - 1];
            const distanciaHastaAhora = calcularDistanciaRecorridoGpsKm(ultimosPuntos);
            return {
                viajeId: viaje._id,
                placaUt: viaje.placaUt,
                conductor: viaje.nombreConductor,
                telefonoConductor: viaje.conductorId?.telefono,
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
        }));
        return resultado;
    }
    async getHistorialViajes(query) {
        const filter = {
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
    async getTrackingDetalle(viajeId) {
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
    async guardarJustificacion(viajeId, dto) {
        const reserva = await this.reservaModel.findById(viajeId);
        if (!reserva) {
            throw new NotFoundException(`Viaje con ID ${viajeId} no encontrado`);
        }
        reserva.justificacionExcesoKm = dto.justificacionExcesoKm;
        await reserva.save();
        return reserva;
    }
    async getReservasHoy(user) {
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);
        const finDia = new Date();
        finDia.setHours(23, 59, 59, 999);
        const filter = {
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
};
TrackingService = __decorate([
    Injectable(),
    __param(0, InjectModel(ReservaViaje.name)),
    __param(1, InjectModel(UnidadTransporte.name)),
    __param(2, InjectModel(PuntoTrackingViaje.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model])
], TrackingService);
export { TrackingService };
//# sourceMappingURL=tracking.service.js.map