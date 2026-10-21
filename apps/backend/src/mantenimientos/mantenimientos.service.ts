import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Mantenimiento,
  MantenimientoDocument,
  EstadoMantenimiento,
} from '../database/schemas/mantenimiento.schema.js';
import {
  UnidadTransporte,
  UnidadTransporteDocument,
  EstadoUnidadTransporte,
} from '../database/schemas/unidad-transporte.schema.js';
import {
  CatalogoTareaMantenimiento,
  CatalogoTareaMantenimientoDocument,
} from '../database/schemas/catalogo-tarea.schema.js';
import {
  ReservaViaje,
  ReservaViajeDocument,
  EstadoReservaViaje,
} from '../database/schemas/reserva-viaje.schema.js';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto.js';
import { UpdateBorradorMantenimientoDto } from './dto/update-borrador.dto.js';
import { FinalizarMantenimientoDto } from './dto/finalizar-mantenimiento.dto.js';
import { QueryMantenimientosDto } from './dto/query-mantenimientos.dto.js';

@Injectable()
export class MantenimientosService {
  constructor(
    @InjectModel(Mantenimiento.name)
    private readonly mantenimientoModel: Model<MantenimientoDocument>,
    @InjectModel(UnidadTransporte.name)
    private readonly utModel: Model<UnidadTransporteDocument>,
    @InjectModel(CatalogoTareaMantenimiento.name)
    private readonly catalogoModel: Model<CatalogoTareaMantenimientoDocument>,
    @InjectModel(ReservaViaje.name)
    private readonly reservaModel: Model<ReservaViajeDocument>,
  ) {}

  async getCatalogoChecklist() {
    return this.catalogoModel.find({ activo: true }).sort({ orden: 1 });
  }

  async create(dto: CreateMantenimientoDto) {
    const ut = await this.utModel.findById(dto.utId);
    if (!ut) {
      throw new NotFoundException(
        `Unidad de transporte con ID ${dto.utId} no encontrada`,
      );
    }

    if (ut.estado === EstadoUnidadTransporte.VIAJANDO) {
      throw new BadRequestException(
        `La unidad de transporte ${ut.placa} se encuentra en estado VIAJANDO. Debe finalizar el viaje activo antes de ingresar a mantenimiento.`,
      );
    }

    if (ut.estado === EstadoUnidadTransporte.EN_MANTENIMIENTO) {
      throw new BadRequestException(
        `La unidad de transporte ${ut.placa} ya tiene una orden de mantenimiento abierta en curso.`,
      );
    }

    // Buscar reservas pendientes que podrían verse afectadas
    const reservasAfectadas = await this.reservaModel.find({
      utId: ut._id,
      estado: EstadoReservaViaje.PROGRAMADA,
      fechaHoraInicioProgramada: { $gte: new Date() },
    });

    // Cambiar estado de la UT a EN_MANTENIMIENTO
    ut.estado = EstadoUnidadTransporte.EN_MANTENIMIENTO;
    await ut.save();

    // Crear registro de mantenimiento en BORRADOR
    const mantenimiento = await this.mantenimientoModel.create({
      utId: ut._id,
      placaUt: ut.placa,
      kilometrajeRegistro: ut.kilometraje,
      estado: EstadoMantenimiento.BORRADOR,
      tareasChecklist: dto.tareasChecklist.map((t) => ({
        ...t,
        esManual: false,
      })),
      tareasManuales: (dto.tareasManuales || []).map((t) => ({
        ...t,
        esManual: true,
      })),
      fechaApertura: new Date(),
    });

    return {
      mantenimiento,
      reservasAfectadas,
      alertaReservas:
        reservasAfectadas.length > 0
          ? `Atención: Esta unidad tiene ${reservasAfectadas.length} reserva(s) programada(s) pendiente(s). Se recomienda reasignarlas o cancelarlas.`
          : null,
    };
  }

  async updateBorrador(id: string, dto: UpdateBorradorMantenimientoDto) {
    const mantenimiento = await this.findById(id);

    if (mantenimiento.estado !== EstadoMantenimiento.BORRADOR) {
      throw new BadRequestException(
        'Solo se pueden editar las tareas de un mantenimiento que esté en estado BORRADOR.',
      );
    }

    if (dto.tareasChecklist) {
      mantenimiento.tareasChecklist = dto.tareasChecklist.map((t) => ({
        ...t,
        esManual: false,
      }));
    }

    if (dto.tareasManuales) {
      mantenimiento.tareasManuales = dto.tareasManuales.map((t) => ({
        ...t,
        esManual: true,
      }));
    }

    await mantenimiento.save();
    return mantenimiento;
  }

  async finalizar(id: string, dto: FinalizarMantenimientoDto) {
    const mantenimiento = await this.findById(id);

    if (mantenimiento.estado !== EstadoMantenimiento.BORRADOR) {
      throw new BadRequestException(
        'Este mantenimiento ya ha sido finalizado previamente.',
      );
    }

    const ut = await this.utModel.findById(mantenimiento.utId);
    if (!ut) {
      throw new NotFoundException('Unidad de transporte asociada no encontrada');
    }

    // Actualizar registro de mantenimiento
    mantenimiento.observacionesPersonal = dto.observacionesPersonal;
    mantenimiento.estadoFinalUt = dto.estadoFinalUt;
    mantenimiento.estado = EstadoMantenimiento.FINALIZADO;
    mantenimiento.fechaCierre = new Date();
    await mantenimiento.save();

    // Actualizar estado de la UT según selección del administrador
    ut.estado = dto.estadoFinalUt;
    await ut.save();

    // Si la UT queda INACTIVA, alertar reservas pendientes
    let reservasAfectadas: ReservaViajeDocument[] = [];
    if (dto.estadoFinalUt === EstadoUnidadTransporte.INACTIVA) {
      reservasAfectadas = await this.reservaModel.find({
        utId: ut._id,
        estado: EstadoReservaViaje.PROGRAMADA,
        fechaHoraInicioProgramada: { $gte: new Date() },
      });
    }

    return {
      mantenimiento,
      ut: {
        id: ut._id,
        placa: ut.placa,
        estado: ut.estado,
      },
      reservasAfectadas,
      alerta:
        reservasAfectadas.length > 0
          ? `La unidad quedó INACTIVA y tiene ${reservasAfectadas.length} reserva(s) programada(s) que requieren reasignación o cancelación.`
          : null,
    };
  }

  async findAll(query: QueryMantenimientosDto) {
    const filter: Record<string, any> = {};

    if (query.estado) {
      filter.estado = query.estado;
    }

    if (query.utId) {
      filter.utId = query.utId;
    }

    if (query.placa) {
      filter.placaUt = new RegExp(query.placa.trim(), 'i');
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.mantenimientoModel
        .find(filter)
        .sort({ fechaApertura: -1 })
        .skip(skip)
        .limit(limit)
        .populate('utId', 'marca modelo tipo anio kilometraje'),
      this.mantenimientoModel.countDocuments(filter),
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

  async findById(id: string) {
    const mantenimiento = await this.mantenimientoModel
      .findById(id)
      .populate('utId', 'marca modelo tipo anio kilometraje');
    if (!mantenimiento) {
      throw new NotFoundException(`Mantenimiento con ID ${id} no encontrado`);
    }
    return mantenimiento;
  }
}
