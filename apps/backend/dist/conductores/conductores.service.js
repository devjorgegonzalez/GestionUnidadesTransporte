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
import { Injectable, NotFoundException, ConflictException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conductor, } from '../database/schemas/conductor.schema.js';
let ConductoresService = class ConductoresService {
    conductorModel;
    constructor(conductorModel) {
        this.conductorModel = conductorModel;
    }
    async create(dto) {
        const cleanCedula = dto.cedula.trim();
        const existing = await this.conductorModel.findOne({ cedula: cleanCedula });
        if (existing) {
            throw new ConflictException(`Ya existe un conductor registrado con la cédula ${cleanCedula}`);
        }
        const created = await this.conductorModel.create({
            ...dto,
            cedula: cleanCedula,
            activo: true,
        });
        return created;
    }
    async findAll(query) {
        const filter = {};
        if (query.search) {
            const regex = new RegExp(query.search.trim(), 'i');
            filter.$or = [{ nombre: regex }, { apellido: regex }, { cedula: regex }];
        }
        if (typeof query.activo === 'boolean') {
            filter.activo = query.activo;
        }
        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, Math.min(100, query.limit || 10));
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.conductorModel
                .find(filter)
                .sort({ apellido: 1, nombre: 1 })
                .skip(skip)
                .limit(limit),
            this.conductorModel.countDocuments(filter),
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
    async findActivos() {
        return this.conductorModel
            .find({ activo: true })
            .sort({ apellido: 1, nombre: 1 });
    }
    async findById(id) {
        const conductor = await this.conductorModel.findById(id);
        if (!conductor) {
            throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
        }
        return conductor;
    }
    async update(id, dto) {
        const conductor = await this.findById(id);
        if (dto.cedula) {
            const cleanCedula = dto.cedula.trim();
            const existing = await this.conductorModel.findOne({
                cedula: cleanCedula,
                _id: { $ne: conductor._id },
            });
            if (existing) {
                throw new ConflictException(`Ya existe otro conductor con la cédula ${cleanCedula}`);
            }
            dto.cedula = cleanCedula;
        }
        Object.assign(conductor, dto);
        await conductor.save();
        return conductor;
    }
};
ConductoresService = __decorate([
    Injectable(),
    __param(0, InjectModel(Conductor.name)),
    __metadata("design:paramtypes", [Model])
], ConductoresService);
export { ConductoresService };
//# sourceMappingURL=conductores.service.js.map