import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  PuntoFrecuente,
  PuntoFrecuenteDocument,
} from '../database/schemas/punto-frecuente.schema.js';
import { CreatePuntoFrecuenteDto } from './dto/create-punto-frecuente.dto.js';
import { UpdatePuntoFrecuenteDto } from './dto/update-punto-frecuente.dto.js';
import { QueryPuntosFrecuentesDto } from './dto/query-puntos-frecuentes.dto.js';

@Injectable()
export class PuntosFrecuentesService {
  constructor(
    @InjectModel(PuntoFrecuente.name)
    private readonly puntoModel: Model<PuntoFrecuenteDocument>,
  ) {}

  async create(dto: CreatePuntoFrecuenteDto) {
    const cleanNombre = dto.nombre.trim();
    const existing = await this.puntoModel.findOne({ nombre: cleanNombre });
    if (existing) {
      throw new ConflictException(
        `Ya existe un punto frecuente con el nombre '${cleanNombre}'`,
      );
    }

    const created = await this.puntoModel.create({
      ...dto,
      nombre: cleanNombre,
      activo: true,
    });
    return created;
  }

  async findAll(query: QueryPuntosFrecuentesDto) {
    const filter: Record<string, any> = {};

    if (query.search) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ nombre: regex }, { direccion: regex }];
    }

    if (typeof query.activo === 'boolean') {
      filter.activo = query.activo;
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.puntoModel
        .find(filter)
        .sort({ nombre: 1 })
        .skip(skip)
        .limit(limit),
      this.puntoModel.countDocuments(filter),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findActivos() {
    return this.puntoModel.find({ activo: true }).sort({ nombre: 1 });
  }

  async findById(id: string) {
    const punto = await this.puntoModel.findById(id);
    if (!punto) {
      throw new NotFoundException(`Punto frecuente con ID ${id} no encontrado`);
    }
    return punto;
  }

  async update(id: string, dto: UpdatePuntoFrecuenteDto) {
    const punto = await this.findById(id);

    if (dto.nombre) {
      const cleanNombre = dto.nombre.trim();
      const existing = await this.puntoModel.findOne({
        nombre: cleanNombre,
        _id: { $ne: punto._id },
      });
      if (existing) {
        throw new ConflictException(
          `Ya existe otro punto frecuente con el nombre '${cleanNombre}'`,
        );
      }
      dto.nombre = cleanNombre;
    }

    Object.assign(punto, dto);
    await punto.save();
    return punto;
  }

  async remove(id: string) {
    const punto = await this.findById(id);
    // Marcamos como inactivo (soft disable) para preservar integridad
    punto.activo = false;
    await punto.save();
    return { message: `Punto frecuente '${punto.nombre}' desactivado correctamente.` };
  }
}
