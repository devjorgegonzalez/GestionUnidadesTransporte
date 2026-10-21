import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  Conductor,
  ConductorDocument,
} from '../database/schemas/conductor.schema.js';
import { CreateConductorDto } from './dto/create-conductor.dto.js';
import { UpdateConductorDto } from './dto/update-conductor.dto.js';
import { QueryConductoresDto } from './dto/query-conductores.dto.js';

@Injectable()
export class ConductoresService {
  constructor(
    @InjectModel(Conductor.name)
    private readonly conductorModel: Model<ConductorDocument>,
  ) {}

  async create(dto: CreateConductorDto) {
    const cleanCedula = dto.cedula.trim();
    const existing = await this.conductorModel.findOne({ cedula: cleanCedula });
    if (existing) {
      throw new ConflictException(
        `Ya existe un conductor registrado con la cédula ${cleanCedula}`,
      );
    }

    const created = await this.conductorModel.create({
      ...dto,
      cedula: cleanCedula,
      activo: true,
    });
    return created;
  }

  async findAll(query: QueryConductoresDto) {
    const filter: Record<string, any> = {};

    if (query.search) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ nombre: regex }, { apellido: regex }, { cedula: regex }];
    }

    if (typeof query.activo === 'boolean') {
      filter.activo = query.activo;
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.conductorModel
        .find(filter)
        .sort({ apellido: 1, nombre: 1 })
        .skip(skip)
        .limit(limit),
      this.conductorModel.countDocuments(filter),
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
    return this.conductorModel
      .find({ activo: true })
      .sort({ apellido: 1, nombre: 1 });
  }

  async findById(id: string) {
    const conductor = await this.conductorModel.findById(id);
    if (!conductor) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }
    return conductor;
  }

  async update(id: string, dto: UpdateConductorDto) {
    const conductor = await this.findById(id);

    if (dto.cedula) {
      const cleanCedula = dto.cedula.trim();
      const existing = await this.conductorModel.findOne({
        cedula: cleanCedula,
        _id: { $ne: conductor._id },
      });
      if (existing) {
        throw new ConflictException(
          `Ya existe otro conductor con la cédula ${cleanCedula}`,
        );
      }
      dto.cedula = cleanCedula;
    }

    Object.assign(conductor, dto);
    await conductor.save();
    return conductor;
  }
}
