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
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, } from '@nestjs/swagger';
import { PuntosFrecuentesService } from './puntos-frecuentes.service.js';
import { CreatePuntoFrecuenteDto } from './dto/create-punto-frecuente.dto.js';
import { UpdatePuntoFrecuenteDto } from './dto/update-punto-frecuente.dto.js';
import { QueryPuntosFrecuentesDto } from './dto/query-puntos-frecuentes.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
let PuntosFrecuentesController = class PuntosFrecuentesController {
    puntosService;
    constructor(puntosService) {
        this.puntosService = puntosService;
    }
    async create(dto) {
        return this.puntosService.create(dto);
    }
    async findAll(query) {
        return this.puntosService.findAll(query);
    }
    async findActivos() {
        return this.puntosService.findActivos();
    }
    async findById(id) {
        return this.puntosService.findById(id);
    }
    async update(id, dto) {
        return this.puntosService.update(id, dto);
    }
    async remove(id) {
        return this.puntosService.remove(id);
    }
};
__decorate([
    Post(),
    ApiOperation({ summary: 'Registrar un nuevo Punto Frecuente' }),
    ApiResponse({ status: 201, description: 'Punto frecuente creado exitosamente.' }),
    ApiResponse({ status: 409, description: 'Nombre duplicado.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePuntoFrecuenteDto]),
    __metadata("design:returntype", Promise)
], PuntosFrecuentesController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Listar puntos frecuentes paginados con filtros' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryPuntosFrecuentesDto]),
    __metadata("design:returntype", Promise)
], PuntosFrecuentesController.prototype, "findAll", null);
__decorate([
    Get('activos'),
    ApiOperation({
        summary: 'Listar todos los puntos frecuentes activos para el formulario de reservas',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosFrecuentesController.prototype, "findActivos", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Obtener detalle de un punto frecuente' }),
    ApiResponse({ status: 200, description: 'Detalle del punto frecuente.' }),
    ApiResponse({ status: 404, description: 'Punto frecuente no encontrado.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PuntosFrecuentesController.prototype, "findById", null);
__decorate([
    Patch(':id'),
    ApiOperation({ summary: 'Actualizar un punto frecuente' }),
    ApiResponse({ status: 200, description: 'Punto frecuente actualizado.' }),
    ApiResponse({ status: 409, description: 'Nombre duplicado.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePuntoFrecuenteDto]),
    __metadata("design:returntype", Promise)
], PuntosFrecuentesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Desactivar un punto frecuente' }),
    ApiResponse({ status: 200, description: 'Punto frecuente desactivado.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PuntosFrecuentesController.prototype, "remove", null);
PuntosFrecuentesController = __decorate([
    ApiTags('Puntos Frecuentes'),
    ApiBearerAuth('JWT-auth'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    Controller('puntos-frecuentes'),
    __metadata("design:paramtypes", [PuntosFrecuentesService])
], PuntosFrecuentesController);
export { PuntosFrecuentesController };
//# sourceMappingURL=puntos-frecuentes.controller.js.map