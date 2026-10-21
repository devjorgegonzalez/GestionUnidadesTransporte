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
import { Mantenimiento, EstadoMantenimiento, } from '../database/schemas/mantenimiento.schema.js';
import { UnidadTransporte, EstadoUnidadTransporte, } from '../database/schemas/unidad-transporte.schema.js';
import { CatalogoTareaMantenimiento, } from '../database/schemas/catalogo-tarea.schema.js';
import { ReservaViaje, EstadoReservaViaje, } from '../database/schemas/reserva-viaje.schema.js';
let MantenimientosService = class MantenimientosService {
    mantenimientoModel;
    utModel;
    catalogoModel;
    reservaModel;
    constructor(mantenimientoModel, utModel, catalogoModel, reservaModel) {
        this.mantenimientoModel = mantenimientoModel;
        this.utModel = utModel;
        this.catalogoModel = catalogoModel;
        this.reservaModel = reservaModel;
    }
    async getCatalogoChecklist() {
        return this.catalogoModel.find({ activo: true }).sort({ orden: 1 });
    }
    async create(dto) {
        const ut = await this.utModel.findById(dto.utId);
        if (!ut) {
            throw new NotFoundException(`Unidad de transporte con ID ${dto.utId} no encontrada`);
        }
        if (ut.estado === EstadoUnidadTransporte.VIAJANDO) {
            throw new BadRequestException(`La unidad de transporte ${ut.placa} se encuentra en estado VIAJANDO. Debe finalizar el viaje activo antes de ingresar a mantenimiento.`);
        }
        if (ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO) {
            throw new BadRequestException(`La unidad de transporte ${ut.placa} ya tiene una orden de mantenimiento abierta en curso.`);
        }
        const reservasAfectadas = await this.reservaModel.find({
            utId: ut._id,
            estado: EstadoReservaViaje.PROGRAMADA,
            fechaHoraInicioProgramada: { $gte: new Date() },
        });
        ut.estado = EstadoUnidadTransporte.EN_MANTENIMIENTO;
        await ut.save();
        const mantenimiento = await this.mantenimientoModel.create({
            utId: ut._id,
            placaUt: ut.placa,
            kilometrajeRegistro: ut.kilometraje,
            estado: EstadoMantenimiento.BORRADOR,
            tareasChecklist: dto.tareasChecklist.map((t) => ({
                ...t,
                esManual: false,
            })),
            tareasManuales: (dto.tareasManuales || []).map((t) => ({
                ...t,
                esManual: true,
            })),
            fechaApertura: new Date(),
        });
        return {
            mantenimiento,
            reservasAfectadas,
            alertaReservas: reservasAfectadas.length > 0
                ? `Atención: Esta unidad tiene ${reservasAfectadas.length} reserva(s) programada(s) pendiente(s). Se recomienda reasignarlas o cancelarlas.`
                : null,
        };
    }
    async updateBorrador(id, dto) {
        const mantenimiento = await this.findById(id);
        if (mantenimiento.estado !== EstadoMantenimiento.BORRADOR) {
            throw new BadRequestException('Solo se pueden editar las tareas de un mantenimiento que esté en estado BORRADOR.');
        }
        if (dto.tareasChecklist) {
            mantenimiento.tareasChecklist = dto.tareasChecklist.map((t) => ({
                ...t,
                esManual: false,
            }));
        }
        if (dto.tareasManuales) {
            mantenimiento.tareasManuales = dto.tareasManuales.map((t) => ({
                ...t,
                esManual: true,
            }));
        }
        await mantenimiento.save();
        return mantenimiento;
    }
    async finalizar(id, dto) {
        const mantenimiento = await this.findById(id);
        if (mantenimiento.estado !== EstadoMantenimiento.BORRADOR) {
            throw new BadRequestException('Este mantenimiento ya ha sido finalizado previamente.');
        }
        const ut = await this.utModel.findById(mantenimiento.utId);
        if (!ut) {
            throw new NotFoundException('Unidad de transporte asociada no encontrada');
        }
        mantenimiento.observacionesPersonal = dto.observacionesPersonal;
        mantenimiento.estadoFinalUt = dto.estadoFinalUt;
        mantenimiento.estado = EstadoMantenimiento.FINALIZADO;
        mantenimiento.fechaCierre = new Date();
        await mantenimiento.save();
        ut.estado = dto.estadoFinalUt;
        await ut.save();
        let reservasAfectadas = [];
        if (dto.estadoFinalUt === EstadoUnidadTransporte.INACTIVA) {
            reservasAfectadas = await this.reservaModel.find({
                utId: ut._id,
                estado: EstadoReservaViaje.PROGRAMADA,
                fechaHoraInicioProgramada: { $gte: new Date() },
            });
        }
        return {
            mantenimiento,
            ut: {
                id: ut._id,
                placa: ut.placa,
                estado: ut.estado,
            },
            reservasAfectadas,
            alerta: reservasAfectadas.length > 0
                ? `La unidad quedó INACTIVA y tiene ${reservasAfectadas.length} reserva(s) programada(s) que requieren reasignación o cancelación.`
                : null,
        };
    }
    async findAll(query) {
        const filter = {};
        if (query.estado) {
            filter.estado = query.estado;
        }
        if (query.utId) {
            filter.utId = query.utId;
        }
        if (query.placa) {
            filter.placaUt = new RegExp(query.placa.trim(), 'i');
        }
        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, Math.min(100, query.limit || 10));
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.mantenimientoModel
                .find(filter)
                .sort({ fechaApertura: -1 })
                .skip(skip)
                .limit(limit)
                .populate('utId', 'marca modelo tipo anio kilometraje'),
            this.mantenimientoModel.countDocuments(filter),
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
        const mantenimiento = await this.mantenimientoModel
            .findById(id)
            .populate('utId', 'marca modelo tipo anio kilometraje');
        if (!mantenimiento) {
            throw new NotFoundException(`Mantenimiento con ID ${id} no encontrado`);
        }
        return mantenimiento;
    }
};
MantenimientosService = __decorate([
    Injectable(),
    __param(0, InjectModel(Mantenimiento.name)),
    __param(1, InjectModel(UnidadTransporte.name)),
    __param(2, InjectModel(CatalogoTareaMantenimiento.name)),
    __param(3, InjectModel(ReservaViaje.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model,
        Model])
], MantenimientosService);
export { MantenimientosService };
//# sourceMappingURL=mantenimientos.service.js.map