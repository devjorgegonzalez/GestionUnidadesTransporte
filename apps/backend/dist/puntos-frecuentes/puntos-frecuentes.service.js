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
import { PuntoFrecuente, } from '../database/schemas/punto-frecuente.schema.js';
let PuntosFrecuentesService = class PuntosFrecuentesService {
    puntoModel;
    constructor(puntoModel) {
        this.puntoModel = puntoModel;
    }
    async create(dto) {
        const cleanNombre = dto.nombre.trim();
        const existing = await this.puntoModel.findOne({ nombre: cleanNombre });
        if (existing) {
            throw new ConflictException(`Ya existe un punto frecuente con el nombre '${cleanNombre}'`);
        }
        const created = await this.puntoModel.create({
            ...dto,
            nombre: cleanNombre,
            activo: true,
        });
        return created;
    }
    async findAll(query) {
        const filter = {};
        if (query.search) {
            const regex = new RegExp(query.search.trim(), 'i');
            filter.$or = [{ nombre: regex }, { direccion: regex }];
        }
        if (typeof query.activo === 'boolean') {
            filter.activo = query.activo;
        }
        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, Math.min(100, query.limit || 10));
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.puntoModel
                .find(filter)
                .sort({ nombre: 1 })
                .skip(skip)
                .limit(limit),
            this.puntoModel.countDocuments(filter),
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
        return this.puntoModel.find({ activo: true }).sort({ nombre: 1 });
    }
    async findById(id) {
        const punto = await this.puntoModel.findById(id);
        if (!punto) {
            throw new NotFoundException(`Punto frecuente con ID ${id} no encontrado`);
        }
        return punto;
    }
    async update(id, dto) {
        const punto = await this.findById(id);
        if (dto.nombre) {
            const cleanNombre = dto.nombre.trim();
            const existing = await this.puntoModel.findOne({
                nombre: cleanNombre,
                _id: { $ne: punto._id },
            });
            if (existing) {
                throw new ConflictException(`Ya existe otro punto frecuente con el nombre '${cleanNombre}'`);
            }
            dto.nombre = cleanNombre;
        }
        Object.assign(punto, dto);
        await punto.save();
        return punto;
    }
    async remove(id) {
        const punto = await this.findById(id);
        punto.activo = false;
        await punto.save();
        return { message: `Punto frecuente '${punto.nombre}' desactivado correctamente.` };
    }
};
PuntosFrecuentesService = __decorate([
    Injectable(),
    __param(0, InjectModel(PuntoFrecuente.name)),
    __metadata("design:paramtypes", [Model])
], PuntosFrecuentesService);
export { PuntosFrecuentesService };
//# sourceMappingURL=puntos-frecuentes.service.js.map