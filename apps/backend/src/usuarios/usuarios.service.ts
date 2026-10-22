import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  UsuarioAdmin,
  UsuarioAdminDocument,
} from '../database/schemas/usuario-admin.schema.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { QueryUsuariosDto } from './dto/query-usuarios.dto.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(UsuarioAdmin.name)
    private readonly adminModel: Model<UsuarioAdminDocument>,
  ) {}

  async findAll(query: QueryUsuariosDto) {
    const filter: Record<string, any> = {};

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ nombre: searchRegex }, { email: searchRegex }];
    }

    if (query.rol) {
      filter.rol = query.rol;
    }

    if (query.activo !== undefined) {
      filter.activo = query.activo;
    }

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.adminModel.countDocuments(filter),
      this.adminModel
        .find(filter)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: items,
    };
  }

  async findById(id: string) {
    const user = await this.adminModel.findById(id).select('-passwordHash');
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }
    return user;
  }

  async create(dto: CreateUsuarioDto) {
    const existing = await this.adminModel.findOne({
      email: dto.email.toLowerCase().trim(),
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe un usuario registrado con el correo '${dto.email}'`,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const created = await this.adminModel.create({
      nombre: dto.nombre.trim(),
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      rol: dto.rol,
      activo: dto.activo !== undefined ? dto.activo : true,
    });

    const userObj = created.toObject();
    delete (userObj as any).passwordHash;
    return userObj;
  }

  async update(id: string, dto: UpdateUsuarioDto, currentUserId: string) {
    const user = await this.adminModel.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    // Verificar unicidad de correo si se modifica
    if (dto.email && dto.email.toLowerCase().trim() !== user.email) {
      const emailExists = await this.adminModel.findOne({
        email: dto.email.toLowerCase().trim(),
        _id: { $ne: id },
      });
      if (emailExists) {
        throw new ConflictException(
          `Ya existe otro usuario registrado con el correo '${dto.email}'`,
        );
      }
      user.email = dto.email.toLowerCase().trim();
    }

    // Regla de seguridad: Si el usuario es el mismo que está en sesión
    if (id === currentUserId) {
      if (dto.activo === false) {
        throw new BadRequestException(
          'No puedes desactivar tu propia cuenta mientras estás en sesión',
        );
      }
      if (dto.rol && dto.rol !== 'ADMIN') {
        throw new BadRequestException(
          'No puedes degradar tu propio rol de Administrador',
        );
      }
    }

    // Regla de seguridad: No dejar al sistema sin administradores activos
    if (
      user.rol === 'ADMIN' &&
      ((dto.rol && dto.rol !== 'ADMIN') || dto.activo === false)
    ) {
      const activeAdminsCount = await this.adminModel.countDocuments({
        rol: 'ADMIN',
        activo: true,
      });
      if (activeAdminsCount <= 1) {
        throw new BadRequestException(
          'Operación denegada: no es posible desactivar ni cambiar el rol del único Administrador activo del sistema',
        );
      }
    }

    if (dto.nombre) {
      user.nombre = dto.nombre.trim();
    }

    if (dto.rol) {
      user.rol = dto.rol;
    }

    if (dto.activo !== undefined) {
      user.activo = dto.activo;
    }

    if (dto.password && dto.password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(dto.password, salt);
    }

    await user.save();

    const updated = user.toObject();
    delete (updated as any).passwordHash;
    return updated;
  }

  async toggleActivo(id: string, currentUserId: string) {
    const user = await this.adminModel.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    const nuevoEstado = !user.activo;

    if (id === currentUserId && !nuevoEstado) {
      throw new BadRequestException(
        'No puedes desactivar tu propia cuenta mientras estás en sesión',
      );
    }

    if (user.rol === 'ADMIN' && !nuevoEstado) {
      const activeAdminsCount = await this.adminModel.countDocuments({
        rol: 'ADMIN',
        activo: true,
      });
      if (activeAdminsCount <= 1) {
        throw new BadRequestException(
          'No es posible desactivar al único Administrador activo del sistema',
        );
      }
    }

    user.activo = nuevoEstado;
    await user.save();

    const res = user.toObject();
    delete (res as any).passwordHash;
    return res;
  }

  async delete(id: string, currentUserId: string) {
    const user = await this.adminModel.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    if (id === currentUserId) {
      throw new BadRequestException(
        'No puedes eliminar tu propia cuenta mientras estás en sesión',
      );
    }

    if (user.rol === 'ADMIN') {
      const activeAdminsCount = await this.adminModel.countDocuments({
        rol: 'ADMIN',
        activo: true,
      });
      if (activeAdminsCount <= 1) {
        throw new BadRequestException(
          'No es posible eliminar al único Administrador del sistema',
        );
      }
    }

    await this.adminModel.findByIdAndDelete(id);
    return { message: `Usuario '${user.nombre}' eliminado correctamente` };
  }
}
