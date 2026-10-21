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
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnidadTransporte, EstadoUnidadTransporte, } from '../database/schemas/unidad-transporte.schema.js';
import { ReservaViaje, } from '../database/schemas/reserva-viaje.schema.js';
import { Mantenimiento, EstadoMantenimiento, } from '../database/schemas/mantenimiento.schema.js';
let DashboardService = class DashboardService {
    utModel;
    reservaModel;
    mantenimientoModel;
    constructor(utModel, reservaModel, mantenimientoModel) {
        this.utModel = utModel;
        this.reservaModel = reservaModel;
        this.mantenimientoModel = mantenimientoModel;
    }
    async getResumen() {
        const [disponibles, viajando, enMantenimiento, inactivas, totalUts] = await Promise.all([
            this.utModel.countDocuments({ estado: EstadoUnidadTransporte.DISPONIBLE }),
            this.utModel.countDocuments({ estado: EstadoUnidadTransporte.VIAJANDO }),
            this.utModel.countDocuments({
                estado: EstadoUnidadTransporte.EN_MANTENIMIENTO,
            }),
            this.utModel.countDocuments({ estado: EstadoUnidadTransporte.INACTIVA }),
            this.utModel.countDocuments(),
        ]);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const viajesHoyRaw = await this.reservaModel
            .find({
            fechaHoraInicioProgramada: { $gte: startOfDay, $lte: endOfDay },
        })
            .sort({ fechaHoraInicioProgramada: 1 })
            .limit(10);
        const viajesHoy = viajesHoyRaw.map((v) => ({
            id: v._id,
            placaUt: v.placaUt,
            conductor: v.nombreConductor,
            estado: v.estado,
            origen: v.origen.direccion,
            destino: v.destino.direccion,
            hora: new Date(v.fechaHoraInicioProgramada).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        }));
        const alertasExcesoKmRaw = await this.reservaModel
            .find({
            excedeUmbralKm: true,
            $or: [
                { justificacionExcesoKm: { $exists: false } },
                { justificacionExcesoKm: '' },
                { justificacionExcesoKm: null },
            ],
        })
            .sort({ fechaHoraFinReal: -1 })
            .limit(5);
        const alertasExcesoKm = alertasExcesoKmRaw.map((a) => ({
            id: a._id,
            placaUt: a.placaUt,
            conductor: a.nombreConductor,
            kmSugeridos: a.kmSugeridosGoogle,
            kmReales: a.kmRealesGps || a.kmSugeridosGoogle,
            desviacion: a.porcentajeDesviacionKm || 0,
        }));
        const mantenimientosBorradorRaw = await this.mantenimientoModel
            .find({ estado: EstadoMantenimiento.BORRADOR })
            .sort({ fechaApertura: -1 })
            .limit(5);
        const mantenimientosBorrador = mantenimientosBorradorRaw.map((m) => ({
            id: m._id,
            placaUt: m.placaUt,
            fechaApertura: m.fechaApertura.toISOString(),
            tareas: m.tareasChecklist.filter((t) => t.seleccionada).length +
                m.tareasManuales.length,
        }));
        return {
            kpis: {
                disponibles,
                viajando,
                enMantenimiento,
                inactivas,
                total: totalUts,
            },
            viajesHoy,
            alertasExcesoKm,
            mantenimientosBorrador,
        };
    }
};
DashboardService = __decorate([
    Injectable(),
    __param(0, InjectModel(UnidadTransporte.name)),
    __param(1, InjectModel(ReservaViaje.name)),
    __param(2, InjectModel(Mantenimiento.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map