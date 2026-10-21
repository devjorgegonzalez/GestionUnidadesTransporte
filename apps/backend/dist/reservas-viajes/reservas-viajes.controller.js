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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, } from '@nestjs/swagger';
import { ReservasViajesService } from './reservas-viajes.service.js';
import { CreateReservaViajeDto } from './dto/create-reserva-viaje.dto.js';
import { UpdateReservaViajeDto } from './dto/update-reserva-viaje.dto.js';
import { QueryReservasViajesDto } from './dto/query-reservas-viajes.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
let ReservasViajesController = class ReservasViajesController {
    reservasService;
    constructor(reservasService) {
        this.reservasService = reservasService;
    }
    async create(dto) {
        return this.reservasService.create(dto);
    }
    async findAll(query) {
        return this.reservasService.findAll(query);
    }
    async findById(id) {
        return this.reservasService.findById(id);
    }
    async update(id, dto) {
        return this.reservasService.update(id, dto);
    }
    async cancelar(id) {
        return this.reservasService.cancelar(id);
    }
};
__decorate([
    Post(),
    Roles('ADMIN'),
    ApiOperation({
        summary: 'Programar una nueva Reserva de Viaje (valida UT DISPONIBLE o VIAJANDO)',
    }),
    ApiResponse({ status: 201, description: 'Reserva creada exitosamente.' }),
    ApiResponse({
        status: 400,
        description: 'UT en mantenimiento/inactiva o conductor no activo.',
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateReservaViajeDto]),
    __metadata("design:returntype", Promise)
], ReservasViajesController.prototype, "create", null);
__decorate([
    Get(),
    Roles('ADMIN', 'CONDUCTOR'),
    ApiOperation({ summary: 'Listar reservas de viajes paginadas con filtros' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryReservasViajesDto]),
    __metadata("design:returntype", Promise)
], ReservasViajesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles('ADMIN', 'CONDUCTOR'),
    ApiOperation({ summary: 'Obtener detalle de una reserva de viaje' }),
    ApiResponse({ status: 200, description: 'Detalle de la reserva.' }),
    ApiResponse({ status: 404, description: 'Reserva no encontrada.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservasViajesController.prototype, "findById", null);
__decorate([
    Patch(':id'),
    Roles('ADMIN'),
    ApiOperation({
        summary: 'Modificar una reserva programada (reasignar UT/conductor o ruta)',
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateReservaViajeDto]),
    __metadata("design:returntype", Promise)
], ReservasViajesController.prototype, "update", null);
__decorate([
    Patch(':id/cancelar'),
    Roles('ADMIN'),
    ApiOperation({ summary: 'Cancelar una reserva programada' }),
    ApiResponse({ status: 200, description: 'Reserva cancelada exitosamente.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservasViajesController.prototype, "cancelar", null);
ReservasViajesController = __decorate([
    ApiTags('Reservas de Viajes'),
    ApiBearerAuth('JWT-auth'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('reservas-viajes'),
    __metadata("design:paramtypes", [ReservasViajesService])
], ReservasViajesController);
export { ReservasViajesController };
//# sourceMappingURL=reservas-viajes.controller.js.map