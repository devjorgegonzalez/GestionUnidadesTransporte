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
import { ConductoresService } from './conductores.service.js';
import { CreateConductorDto } from './dto/create-conductor.dto.js';
import { UpdateConductorDto } from './dto/update-conductor.dto.js';
import { QueryConductoresDto } from './dto/query-conductores.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
let ConductoresController = class ConductoresController {
    conductoresService;
    constructor(conductoresService) {
        this.conductoresService = conductoresService;
    }
    async create(dto) {
        return this.conductoresService.create(dto);
    }
    async findAll(query) {
        return this.conductoresService.findAll(query);
    }
    async findActivos() {
        return this.conductoresService.findActivos();
    }
    async findById(id) {
        return this.conductoresService.findById(id);
    }
    async update(id, dto) {
        return this.conductoresService.update(id, dto);
    }
};
__decorate([
    Post(),
    ApiOperation({ summary: 'Registrar un nuevo Conductor' }),
    ApiResponse({ status: 201, description: 'Conductor creado exitosamente.' }),
    ApiResponse({ status: 409, description: 'Cédula duplicada.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateConductorDto]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Listar conductores paginados con filtros' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryConductoresDto]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "findAll", null);
__decorate([
    Get('activos'),
    ApiOperation({
        summary: 'Listar todos los conductores activos para asignación de viajes',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "findActivos", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Obtener detalle de un conductor' }),
    ApiResponse({ status: 200, description: 'Detalle del conductor.' }),
    ApiResponse({ status: 404, description: 'Conductor no encontrado.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "findById", null);
__decorate([
    Patch(':id'),
    ApiOperation({ summary: 'Actualizar datos o estado de un conductor' }),
    ApiResponse({ status: 200, description: 'Conductor actualizado.' }),
    ApiResponse({ status: 409, description: 'Cédula duplicada.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateConductorDto]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "update", null);
ConductoresController = __decorate([
    ApiTags('Conductores'),
    ApiBearerAuth('JWT-auth'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    Controller('conductores'),
    __metadata("design:paramtypes", [ConductoresService])
], ConductoresController);
export { ConductoresController };
//# sourceMappingURL=conductores.controller.js.map