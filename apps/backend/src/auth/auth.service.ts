import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  UsuarioAdmin,
  UsuarioAdminDocument,
} from '../database/schemas/usuario-admin.schema.js';
import {
  Conductor,
  ConductorDocument,
} from '../database/schemas/conductor.schema.js';
import {
  UnidadTransporte,
  UnidadTransporteDocument,
  EstadoUnidadTransporte,
} from '../database/schemas/unidad-transporte.schema.js';
import {
  ReservaViaje,
  ReservaViajeDocument,
  EstadoReservaViaje,
} from '../database/schemas/reserva-viaje.schema.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { ConductorLoginDto } from './dto/conductor-login.dto.js';
import { JwtPayload } from './strategies/jwt.strategy.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UsuarioAdmin.name)
    private readonly adminModel: Model<UsuarioAdminDocument>,
    @InjectModel(Conductor.name)
    private readonly conductorModel: Model<ConductorDocument>,
    @InjectModel(UnidadTransporte.name)
    private readonly utModel: Model<UnidadTransporteDocument>,
    @InjectModel(ReservaViaje.name)
    private readonly reservaModel: Model<ReservaViajeDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async loginAdmin(dto: AdminLoginDto) {
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

    const payload: JwtPayload = {
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

  async loginConductor(dto: ConductorLoginDto) {
    const cleanCedula = dto.cedula.trim();
    const cleanPlaca = dto.placa.toUpperCase().trim().replace(/[\s-]/g, '');

    const conductor = await this.conductorModel.findOne({
      cedula: cleanCedula,
      activo: true,
    });
    if (!conductor) {
      throw new UnauthorizedException(
        `Conductor con cédula ${cleanCedula} no encontrado o se encuentra inactivo`,
      );
    }

    const ut = await this.utModel.findOne({ placa: cleanPlaca });
    if (!ut) {
      throw new UnauthorizedException(
        `Unidad de transporte con placa ${cleanPlaca} no encontrada`,
      );
    }

    if (
      ut.estado === EstadoUnidadTransporte.INACTIVA ||
      ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO
    ) {
      throw new BadRequestException(
        `La unidad de transporte ${cleanPlaca} está actualmente en estado ${ut.estado} y no puede operar viajes`,
      );
    }

    // Buscar reservas disponibles para hoy (sin restringir por hora exacta)
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

    const payload: JwtPayload = {
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

  async getProfile(userPayload: JwtPayload) {
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
    } else {
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
}
