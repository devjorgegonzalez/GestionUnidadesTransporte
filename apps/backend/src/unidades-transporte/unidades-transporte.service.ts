import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  UnidadTransporte,
  UnidadTransporteDocument,
  EstadoUnidadTransporte,
} from '../database/schemas/unidad-transporte.schema.js';
import { CreateUnidadTransporteDto } from './dto/create-unidad-transporte.dto.js';
import { UpdateUnidadTransporteDto } from './dto/update-unidad-transporte.dto.js';
import { QueryUnidadesTransporteDto } from './dto/query-unidades-transporte.dto.js';

@Injectable()
export class UnidadesTransporteService {
  constructor(
    @InjectModel(UnidadTransporte.name)
    private readonly utModel: Model<UnidadTransporteDocument>,
  ) {}

  async create(dto: CreateUnidadTransporteDto) {
    const cleanPlaca = dto.placa.toUpperCase().trim().replace(/[\s-]/g, '');
    const existing = await this.utModel.findOne({ placa: cleanPlaca });
    if (existing) {
      throw new ConflictException(
        `Ya existe una unidad de transporte registrada con la placa ${cleanPlaca}`,
      );
    }

    const created = await this.utModel.create({
      ...dto,
      placa: cleanPlaca,
      kilometraje: dto.kilometraje ?? 0,
      estado: dto.estado ?? EstadoUnidadTransporte.DISPONIBLE,
    });
    return created;
  }

  async findAll(query: QueryUnidadesTransporteDto) {
    const filter: Record<string, any> = {};

    if (query.search) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ placa: regex }, { marca: regex }, { modelo: regex }];
    }

    if (query.estado) {
      filter.estado = query.estado;
    }

    if (query.tipo) {
      filter.tipo = query.tipo;
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.utModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.utModel.countDocuments(filter),
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

  async findDisponiblesReserva() {
    return this.utModel
      .find({
        estado: {
          $in: [
            EstadoUnidadTransporte.DISPONIBLE,
            EstadoUnidadTransporte.VIAJANDO,
          ],
        },
      })
      .sort({ placa: 1 });
  }

  async findById(id: string) {
    const ut = await this.utModel.findById(id);
    if (!ut) {
      throw new NotFoundException(`Unidad de transporte con ID ${id} no encontrada`);
    }
    return ut;
  }

  async update(id: string, dto: UpdateUnidadTransporteDto) {
    const ut = await this.findById(id);

    // Regla de Negocio: Bloqueo de cambio manual de estado si está VIAJANDO o EN_MANTENIMIENTO
    if (dto.estado !== undefined && dto.estado !== ut.estado) {
      if (
        ut.estado === EstadoUnidadTransporte.VIAJANDO ||
        ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO
      ) {
        throw new BadRequestException(
          `No se permite modificar manualmente el estado de la unidad de transporte mientras se encuentre en estado '${ut.estado}'. El estado cambiará automáticamente al concluir el viaje o mantenimiento correspondiente.`,
        );
      }
    }

    if (dto.placa) {
      const cleanPlaca = dto.placa.toUpperCase().trim().replace(/[\s-]/g, '');
      const existing = await this.utModel.findOne({
        placa: cleanPlaca,
        _id: { $ne: ut._id },
      });
      if (existing) {
        throw new ConflictException(
          `Ya existe otra unidad de transporte con la placa ${cleanPlaca}`,
        );
      }
      dto.placa = cleanPlaca;
    }

    Object.assign(ut, dto);
    await ut.save();
    return ut;
  }
}
