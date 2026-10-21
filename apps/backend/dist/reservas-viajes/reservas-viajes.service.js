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
import { Model, Types } from 'mongoose';
import { ReservaViaje, EstadoReservaViaje, } from '../database/schemas/reserva-viaje.schema.js';
import { UnidadTransporte, EstadoUnidadTransporte, } from '../database/schemas/unidad-transporte.schema.js';
import { Conductor, } from '../database/schemas/conductor.schema.js';
let ReservasViajesService = class ReservasViajesService {
    reservaModel;
    utModel;
    conductorModel;
    constructor(reservaModel, utModel, conductorModel) {
        this.reservaModel = reservaModel;
        this.utModel = utModel;
        this.conductorModel = conductorModel;
    }
    async create(dto) {
        const ut = await this.utModel.findById(dto.utId);
        if (!ut) {
            throw new NotFoundException(`Unidad de transporte con ID ${dto.utId} no encontrada`);
        }
        if (ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO ||
            ut.estado === EstadoUnidadTransporte.INACTIVA) {
            throw new BadRequestException(`No es posible reservar la UT ${ut.placa} porque actualmente se encuentra en estado '${ut.estado}'. Solo se admiten unidades DISPONIBLES o VIAJANDO.`);
        }
        const conductor = await this.conductorModel.findById(dto.conductorId);
        if (!conductor || !conductor.activo) {
            throw new BadRequestException(`El conductor asignado no existe o se encuentra inactivo.`);
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
    async findAll(query) {
        const filter = {};
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
    async findById(id) {
        const reserva = await this.reservaModel
            .findById(id)
            .populate('utId', 'marca modelo tipo kilometraje')
            .populate('conductorId', 'telefono');
        if (!reserva) {
            throw new NotFoundException(`Reserva de viaje con ID ${id} no encontrada`);
        }
        return reserva;
    }
    async update(id, dto) {
        const reserva = await this.findById(id);
        if (reserva.estado !== EstadoReservaViaje.PROGRAMADA) {
            throw new BadRequestException(`Solo se pueden modificar reservas que se encuentren en estado PROGRAMADA. Estado actual: ${reserva.estado}`);
        }
        if (dto.utId && dto.utId !== reserva.utId._id.toString()) {
            const ut = await this.utModel.findById(dto.utId);
            if (!ut) {
                throw new NotFoundException(`Unidad con ID ${dto.utId} no encontrada`);
            }
            if (ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO ||
                ut.estado === EstadoUnidadTransporte.INACTIVA) {
                throw new BadRequestException(`La UT ${ut.placa} no está disponible (estado actual: ${ut.estado}).`);
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
            reserva.fechaHoraInicioProgramada = new Date(dto.fechaHoraInicioProgramada);
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
    async cancelar(id) {
        const reserva = await this.findById(id);
        if (reserva.estado !== EstadoReservaViaje.PROGRAMADA) {
            throw new BadRequestException(`Solo se pueden cancelar reservas en estado PROGRAMADA. Estado actual: ${reserva.estado}`);
        }
        reserva.estado = EstadoReservaViaje.CANCELADA;
        await reserva.save();
        return reserva;
    }
};
ReservasViajesService = __decorate([
    Injectable(),
    __param(0, InjectModel(ReservaViaje.name)),
    __param(1, InjectModel(UnidadTransporte.name)),
    __param(2, InjectModel(Conductor.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model])
], ReservasViajesService);
export { ReservasViajesService };
//# sourceMappingURL=reservas-viajes.service.js.map