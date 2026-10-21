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
import { UnidadesTransporteService } from './unidades-transporte.service.js';
import { CreateUnidadTransporteDto } from './dto/create-unidad-transporte.dto.js';
import { UpdateUnidadTransporteDto } from './dto/update-unidad-transporte.dto.js';
import { QueryUnidadesTransporteDto } from './dto/query-unidades-transporte.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
let UnidadesTransporteController = class UnidadesTransporteController {
    utService;
    constructor(utService) {
        this.utService = utService;
    }
    async create(dto) {
        return this.utService.create(dto);
    }
    async findAll(query) {
        return this.utService.findAll(query);
    }
    async findDisponiblesReserva() {
        return this.utService.findDisponiblesReserva();
    }
    async findById(id) {
        return this.utService.findById(id);
    }
    async update(id, dto) {
        return this.utService.update(id, dto);
    }
};
__decorate([
    Post(),
    ApiOperation({ summary: 'Registrar una nueva Unidad de Transporte' }),
    ApiResponse({ status: 201, description: 'UT creada exitosamente.' }),
    ApiResponse({ status: 409, description: 'Placa duplicada.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUnidadTransporteDto]),
    __metadata("design:returntype", Promise)
], UnidadesTransporteController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({
        summary: 'Listar Unidades de Transporte paginadas con filtros',
    }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryUnidadesTransporteDto]),
    __metadata("design:returntype", Promise)
], UnidadesTransporteController.prototype, "findAll", null);
__decorate([
    Get('disponibles-reserva'),
    ApiOperation({
        summary: 'Listar UTs elegibles para reservas (estados DISPONIBLE y VIAJANDO)',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnidadesTransporteController.prototype, "findDisponiblesReserva", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Obtener detalle de una Unidad de Transporte' }),
    ApiResponse({ status: 200, description: 'Detalle de la UT.' }),
    ApiResponse({ status: 404, description: 'UT no encontrada.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnidadesTransporteController.prototype, "findById", null);
__decorate([
    Patch(':id'),
    ApiOperation({
        summary: 'Actualizar datos de una UT (bloquea cambio de estado si está VIAJANDO o EN_MANTENIMIENTO)',
    }),
    ApiResponse({ status: 200, description: 'UT actualizada.' }),
    ApiResponse({
        status: 400,
        description: 'Estado bloqueado por viaje activo o mantenimiento.',
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUnidadTransporteDto]),
    __metadata("design:returntype", Promise)
], UnidadesTransporteController.prototype, "update", null);
UnidadesTransporteController = __decorate([
    ApiTags('Unidades de Transporte'),
    ApiBearerAuth('JWT-auth'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    Controller('unidades-transporte'),
    __metadata("design:paramtypes", [UnidadesTransporteService])
], UnidadesTransporteController);
export { UnidadesTransporteController };
//# sourceMappingURL=unidades-transporte.controller.js.map