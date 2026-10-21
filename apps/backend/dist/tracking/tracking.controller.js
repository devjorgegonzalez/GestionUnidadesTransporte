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
import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, } from '@nestjs/swagger';
import { TrackingService } from './tracking.service.js';
import { TrackingBatchDto } from './dto/tracking-batch.dto.js';
import { FinalizarViajeDto } from './dto/finalizar-viaje.dto.js';
import { JustificacionViajeDto } from './dto/justificacion-viaje.dto.js';
import { QueryHistorialViajesDto } from './dto/query-historial-viajes.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
let TrackingController = class TrackingController {
    trackingService;
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    async getReservasHoy(user) {
        return this.trackingService.getReservasHoy(user);
    }
    async iniciarViaje(viajeId) {
        return this.trackingService.iniciarViaje(viajeId);
    }
    async registrarBatch(viajeId, dto) {
        return this.trackingService.registrarBatch(viajeId, dto);
    }
    async finalizarViaje(viajeId, dto) {
        return this.trackingService.finalizarViaje(viajeId, dto);
    }
    async getFlotaActiva() {
        return this.trackingService.getFlotaActiva();
    }
    async getHistorialViajes(query) {
        return this.trackingService.getHistorialViajes(query);
    }
    async getTrackingDetalle(viajeId) {
        return this.trackingService.getTrackingDetalle(viajeId);
    }
    async guardarJustificacion(viajeId, dto) {
        return this.trackingService.guardarJustificacion(viajeId, dto);
    }
};
__decorate([
    Get('viajes/hoy'),
    Roles('CONDUCTOR', 'ADMIN'),
    ApiOperation({
        summary: 'Listar reservas del día para el conductor o administrador autenticado',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getReservasHoy", null);
__decorate([
    Post('viajes/:viajeId/iniciar'),
    Roles('CONDUCTOR', 'ADMIN'),
    ApiOperation({
        summary: 'Iniciar viaje (cambia viaje a EN_CURSO y UT a VIAJANDO)',
    }),
    __param(0, Param('viajeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "iniciarViaje", null);
__decorate([
    Post('viajes/:viajeId/tracking/batch'),
    Roles('CONDUCTOR', 'ADMIN'),
    ApiOperation({
        summary: 'Recepción de lotes de telemetría GPS cada 5 minutos (idempotente)',
    }),
    __param(0, Param('viajeId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, TrackingBatchDto]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "registrarBatch", null);
__decorate([
    Post('viajes/:viajeId/finalizar'),
    Roles('CONDUCTOR', 'ADMIN'),
    ApiOperation({
        summary: 'Terminar viaje: calcula km reales GPS con Haversine, suma al odómetro de la UT, evalúa desviación y libera UT a DISPONIBLE',
    }),
    __param(0, Param('viajeId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, FinalizarViajeDto]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "finalizarViaje", null);
__decorate([
    Get('visor/activos'),
    Roles('ADMIN'),
    ApiOperation({
        summary: 'Listar unidades actualmente VIAJANDO con última posición, velocidad y ruta trazada',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getFlotaActiva", null);
__decorate([
    Get('visor/viajes'),
    Roles('ADMIN'),
    ApiOperation({
        summary: 'Buscar historial de viajes activos o terminados con filtros',
    }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryHistorialViajesDto]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getHistorialViajes", null);
__decorate([
    Get('visor/viajes/:viajeId/tracking'),
    Roles('ADMIN'),
    ApiOperation({
        summary: 'Obtener detalle completo de tracking GPS y ruta de un viaje',
    }),
    __param(0, Param('viajeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getTrackingDetalle", null);
__decorate([
    Patch('visor/viajes/:viajeId/justificacion'),
    Roles('ADMIN'),
    ApiOperation({
        summary: 'Registrar justificación/observación administrativa por exceso de kilometraje',
    }),
    __param(0, Param('viajeId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, JustificacionViajeDto]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "guardarJustificacion", null);
TrackingController = __decorate([
    ApiTags('Tracking y Visor de Viajes'),
    ApiBearerAuth('JWT-auth'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller(),
    __metadata("design:paramtypes", [TrackingService])
], TrackingController);
export { TrackingController };
//# sourceMappingURL=tracking.controller.js.map