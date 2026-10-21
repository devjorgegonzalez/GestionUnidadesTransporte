var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getResumen() {
        return this.dashboardService.getResumen();
    }
};
__decorate([
    Get('resumen'),
    ApiOperation({
        summary: 'Obtener resumen consolidado de KPIs de flota, viajes del día y alertas de kilometraje',
    }),
    ApiResponse({
        status: 200,
        description: 'Resumen ejecutivo y operativo del Dashboard.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getResumen", null);
DashboardController = __decorate([
    ApiTags('Dashboard Operativo'),
    ApiBearerAuth('JWT-auth'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    Controller('dashboard'),
    __metadata("design:paramtypes", [DashboardService])
], DashboardController);
export { DashboardController };
//# sourceMappingURL=dashboard.controller.js.map