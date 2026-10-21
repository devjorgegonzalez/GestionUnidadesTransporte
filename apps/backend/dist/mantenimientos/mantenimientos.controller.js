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
import { MantenimientosService } from './mantenimientos.service.js';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto.js';
import { UpdateBorradorMantenimientoDto } from './dto/update-borrador.dto.js';
import { FinalizarMantenimientoDto } from './dto/finalizar-mantenimiento.dto.js';
import { QueryMantenimientosDto } from './dto/query-mantenimientos.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
let MantenimientosController = class MantenimientosController {
    mantenimientosService;
    constructor(mantenimientosService) {
        this.mantenimientosService = mantenimientosService;
    }
    async getCatalogoChecklist() {
        return this.mantenimientosService.getCatalogoChecklist();
    }
    async create(dto) {
        return this.mantenimientosService.create(dto);
    }
    async findAll(query) {
        return this.mantenimientosService.findAll(query);
    }
    async findById(id) {
        return this.mantenimientosService.findById(id);
    }
    async updateBorrador(id, dto) {
        return this.mantenimientosService.updateBorrador(id, dto);
    }
    async finalizar(id, dto) {
        return this.mantenimientosService.finalizar(id, dto);
    }
};
__decorate([
    Get('catalogo-checklist'),
    ApiOperation({
        summary: 'Obtener el catálogo de tareas base del checklist predefinido',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MantenimientosController.prototype, "getCatalogoChecklist", null);
__decorate([
    Post(),
    ApiOperation({
        summary: 'Abrir orden de mantenimiento en BORRADOR y cambiar estado de la UT a EN_MANTENIMIENTO',
    }),
    ApiResponse({
        status: 201,
        description: 'Mantenimiento en borrador creado y UT en mantenimiento.',
    }),
    ApiResponse({
        status: 400,
        description: 'UT viajando o ya en mantenimiento.',
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateMantenimientoDto]),
    __metadata("design:returntype", Promise)
], MantenimientosController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Listar órdenes de mantenimiento con filtros' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryMantenimientosDto]),
    __metadata("design:returntype", Promise)
], MantenimientosController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Obtener detalle de una orden de mantenimiento' }),
    ApiResponse({ status: 200, description: 'Detalle del mantenimiento.' }),
    ApiResponse({ status: 404, description: 'Mantenimiento no encontrado.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MantenimientosController.prototype, "findById", null);
__decorate([
    Patch(':id/borrador'),
    ApiOperation({
        summary: 'Actualizar tareas de un mantenimiento que aún está en BORRADOR',
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateBorradorMantenimientoDto]),
    __metadata("design:returntype", Promise)
], MantenimientosController.prototype, "updateBorrador", null);
__decorate([
    Post(':id/finalizar'),
    ApiOperation({
        summary: 'Dar por terminado el mantenimiento, registrar observaciones técnicas y pasar la UT a DISPONIBLE o INACTIVA',
    }),
    ApiResponse({
        status: 200,
        description: 'Mantenimiento finalizado y estado de la UT actualizado.',
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, FinalizarMantenimientoDto]),
    __metadata("design:returntype", Promise)
], MantenimientosController.prototype, "finalizar", null);
MantenimientosController = __decorate([
    ApiTags('Mantenimientos'),
    ApiBearerAuth('JWT-auth'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    Controller('mantenimientos'),
    __metadata("design:paramtypes", [MantenimientosService])
], MantenimientosController);
export { MantenimientosController };
//# sourceMappingURL=mantenimientos.controller.js.map