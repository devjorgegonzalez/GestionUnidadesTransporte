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
import { Injectable, UnauthorizedException, BadRequestException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsuarioAdmin, } from '../database/schemas/usuario-admin.schema.js';
import { Conductor, } from '../database/schemas/conductor.schema.js';
import { UnidadTransporte, EstadoUnidadTransporte, } from '../database/schemas/unidad-transporte.schema.js';
import { ReservaViaje, EstadoReservaViaje, } from '../database/schemas/reserva-viaje.schema.js';
let AuthService = class AuthService {
    adminModel;
    conductorModel;
    utModel;
    reservaModel;
    jwtService;
    constructor(adminModel, conductorModel, utModel, reservaModel, jwtService) {
        this.adminModel = adminModel;
        this.conductorModel = conductorModel;
        this.utModel = utModel;
        this.reservaModel = reservaModel;
        this.jwtService = jwtService;
    }
    async loginAdmin(dto) {
        const admin = await this.adminModel.findOne({
            email: dto.email.toLowerCase().trim(),
        });
        if (!admin || !admin.activo) {
            throw new UnauthorizedException('Credenciales inválidas o usuario inactivo');
        }
        const isMatch = await bcrypt.compare(dto.password, admin.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        const payload = {
            sub: admin._id.toString(),
            email: admin.email,
            nombre: admin.nombre,
            rol: 'ADMIN',
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '8h' });
        return {
            accessToken,
            user: {
                id: admin._id,
                email: admin.email,
                nombre: admin.nombre,
                rol: admin.rol,
            },
        };
    }
    async loginConductor(dto) {
        const cleanCedula = dto.cedula.trim();
        const cleanPlaca = dto.placa.toUpperCase().trim();
        const conductor = await this.conductorModel.findOne({
            cedula: cleanCedula,
            activo: true,
        });
        if (!conductor) {
            throw new UnauthorizedException(`Conductor con cédula ${cleanCedula} no encontrado o se encuentra inactivo`);
        }
        const ut = await this.utModel.findOne({ placa: cleanPlaca });
        if (!ut) {
            throw new UnauthorizedException(`Unidad de transporte con placa ${cleanPlaca} no encontrada`);
        }
        if (ut.estado === EstadoUnidadTransporte.INACTIVA ||
            ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO) {
            throw new BadRequestException(`La unidad de transporte ${cleanPlaca} está actualmente en estado ${ut.estado} y no puede operar viajes`);
        }
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const reservasDelDia = await this.reservaModel.find({
            $or: [
                { conductorId: conductor._id },
                { cedulaConductor: conductor.cedula },
            ],
            placaUt: ut.placa,
            estado: {
                $in: [EstadoReservaViaje.PROGRAMADA, EstadoReservaViaje.EN_CURSO],
            },
            fechaHoraInicioProgramada: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ fechaHoraInicioProgramada: 1 });
        const payload = {
            sub: conductor._id.toString(),
            rol: 'CONDUCTOR',
            cedula: conductor.cedula,
            nombreCompleto: `${conductor.nombre} ${conductor.apellido}`,
            utId: ut._id.toString(),
            placa: ut.placa,
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
        return {
            accessToken,
            conductor: {
                id: conductor._id,
                cedula: conductor.cedula,
                nombre: conductor.nombre,
                apellido: conductor.apellido,
                telefono: conductor.telefono,
            },
            ut: {
                id: ut._id,
                placa: ut.placa,
                marca: ut.marca,
                modelo: ut.modelo,
                kilometraje: ut.kilometraje,
                estado: ut.estado,
            },
            reservasDelDia,
        };
    }
    async getProfile(userPayload) {
        if (userPayload.rol === 'ADMIN') {
            const admin = await this.adminModel.findById(userPayload.sub).select('-passwordHash');
            if (!admin || !admin.activo) {
                throw new UnauthorizedException('Usuario administrador no encontrado o inactivo');
            }
            return {
                id: admin._id,
                email: admin.email,
                nombre: admin.nombre,
                rol: admin.rol,
            };
        }
        else {
            const conductor = await this.conductorModel.findById(userPayload.sub);
            if (!conductor || !conductor.activo) {
                throw new UnauthorizedException('Conductor no encontrado o inactivo');
            }
            return {
                id: conductor._id,
                cedula: conductor.cedula,
                nombre: conductor.nombre,
                apellido: conductor.apellido,
                telefono: conductor.telefono,
                rol: 'CONDUCTOR',
                utAsignada: {
                    utId: userPayload.utId,
                    placa: userPayload.placa,
                },
            };
        }
    }
};
AuthService = __decorate([
    Injectable(),
    __param(0, InjectModel(UsuarioAdmin.name)),
    __param(1, InjectModel(Conductor.name)),
    __param(2, InjectModel(UnidadTransporte.name)),
    __param(3, InjectModel(ReservaViaje.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model,
        Model,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map