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
import { Injectable, NotFoundException, ConflictException, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnidadTransporte, EstadoUnidadTransporte, } from '../database/schemas/unidad-transporte.schema.js';
let UnidadesTransporteService = class UnidadesTransporteService {
    utModel;
    constructor(utModel) {
        this.utModel = utModel;
    }
    async create(dto) {
        const cleanPlaca = dto.placa.toUpperCase().trim();
        const existing = await this.utModel.findOne({ placa: cleanPlaca });
        if (existing) {
            throw new ConflictException(`Ya existe una unidad de transporte registrada con la placa ${cleanPlaca}`);
        }
        const created = await this.utModel.create({
            ...dto,
            placa: cleanPlaca,
            kilometraje: dto.kilometraje ?? 0,
            estado: dto.estado ?? EstadoUnidadTransporte.DISPONIBLE,
        });
        return created;
    }
    async findAll(query) {
        const filter = {};
        if (query.search) {
            const regex = new RegExp(query.search.trim(), 'i');
            filter.$or = [{ placa: regex }, { marca: regex }, { modelo: regex }];
        }
        if (query.estado) {
            filter.estado = query.estado;
        }
        if (query.tipo) {
            filter.tipo = query.tipo;
        }
        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, Math.min(100, query.limit || 10));
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.utModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            this.utModel.countDocuments(filter),
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
    async findDisponiblesReserva() {
        return this.utModel
            .find({
            estado: {
                $in: [
                    EstadoUnidadTransporte.DISPONIBLE,
                    EstadoUnidadTransporte.VIAJANDO,
                ],
            },
        })
            .sort({ placa: 1 });
    }
    async findById(id) {
        const ut = await this.utModel.findById(id);
        if (!ut) {
            throw new NotFoundException(`Unidad de transporte con ID ${id} no encontrada`);
        }
        return ut;
    }
    async update(id, dto) {
        const ut = await this.findById(id);
        if (dto.estado !== undefined && dto.estado !== ut.estado) {
            if (ut.estado === EstadoUnidadTransporte.VIAJANDO ||
                ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO) {
                throw new BadRequestException(`No se permite modificar manualmente el estado de la unidad de transporte mientras se encuentre en estado '${ut.estado}'. El estado cambiará automáticamente al concluir el viaje o mantenimiento correspondiente.`);
            }
        }
        if (dto.placa) {
            const cleanPlaca = dto.placa.toUpperCase().trim();
            const existing = await this.utModel.findOne({
                placa: cleanPlaca,
                _id: { $ne: ut._id },
            });
            if (existing) {
                throw new ConflictException(`Ya existe otra unidad de transporte con la placa ${cleanPlaca}`);
            }
            dto.placa = cleanPlaca;
        }
        Object.assign(ut, dto);
        await ut.save();
        return ut;
    }
};
UnidadesTransporteService = __decorate([
    Injectable(),
    __param(0, InjectModel(UnidadTransporte.name)),
    __metadata("design:paramtypes", [Model])
], UnidadesTransporteService);
export { UnidadesTransporteService };
//# sourceMappingURL=unidades-transporte.service.js.map