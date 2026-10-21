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
import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { ConductorLoginDto } from './dto/conductor-login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async loginAdmin(dto) {
        return this.authService.loginAdmin(dto);
    }
    async loginConductor(dto) {
        return this.authService.loginConductor(dto);
    }
    async getProfile(user) {
        return this.authService.getProfile(user);
    }
};
__decorate([
    Post('admin/login'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
        summary: 'Iniciar sesión Administrador (Web)',
        description: 'Autentica a un usuario administrador con email y contraseña, retornando un JWT Bearer Token.',
    }),
    ApiResponse({
        status: 200,
        description: 'Login exitoso; retorna token y datos de usuario.',
    }),
    ApiResponse({ status: 401, description: 'Credenciales inválidas.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdminLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginAdmin", null);
__decorate([
    Post('conductor/login'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
        summary: 'Iniciar sesión Conductor (App Móvil)',
        description: 'Autentica al conductor mediante su cédula y la placa de la UT asignada. Retorna token JWT y las reservas del día actual.',
    }),
    ApiResponse({
        status: 200,
        description: 'Autenticación exitosa; retorna JWT y reservas disponibles.',
    }),
    ApiResponse({
        status: 401,
        description: 'Conductor o unidad de transporte no encontrados o inactivos.',
    }),
    ApiResponse({
        status: 400,
        description: 'La UT se encuentra en mantenimiento o inactiva.',
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ConductorLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginConductor", null);
__decorate([
    Get('me'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
        summary: 'Obtener información de la sesión actual',
        description: 'Retorna el perfil del usuario autenticado a partir del JWT Bearer Token.',
    }),
    ApiResponse({ status: 200, description: 'Datos del usuario autenticado.' }),
    ApiResponse({ status: 401, description: 'Token ausente o inválido.' }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    ApiTags('Autenticación'),
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map