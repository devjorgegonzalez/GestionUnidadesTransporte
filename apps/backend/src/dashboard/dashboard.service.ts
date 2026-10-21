import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import {
  Mantenimiento,
  MantenimientoDocument,
  EstadoMantenimiento,
} from '../database/schemas/mantenimiento.schema.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(UnidadTransporte.name)
    private readonly utModel: Model<UnidadTransporteDocument>,
    @InjectModel(ReservaViaje.name)
    private readonly reservaModel: Model<ReservaViajeDocument>,
    @InjectModel(Mantenimiento.name)
    private readonly mantenimientoModel: Model<MantenimientoDocument>,
  ) {}

  async getResumen() {
    const [disponibles, viajando, enMantenimiento, inactivas, totalUts] =
      await Promise.all([
        this.utModel.countDocuments({ estado: EstadoUnidadTransporte.DISPONIBLE }),
        this.utModel.countDocuments({ estado: EstadoUnidadTransporte.VIAJANDO }),
        this.utModel.countDocuments({
          estado: EstadoUnidadTransporte.EN_MANTENIMIENTO,
        }),
        this.utModel.countDocuments({ estado: EstadoUnidadTransporte.INACTIVA }),
        this.utModel.countDocuments(),
      ]);

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const viajesHoyRaw = await this.reservaModel
      .find({
        fechaHoraInicioProgramada: { $gte: startOfDay, $lte: endOfDay },
      })
      .sort({ fechaHoraInicioProgramada: 1 })
      .limit(10);

    const viajesHoy = viajesHoyRaw.map((v) => ({
      id: v._id,
      placaUt: v.placaUt,
      conductor: v.nombreConductor,
      estado: v.estado,
      origen: v.origen.direccion,
      destino: v.destino.direccion,
      hora: new Date(v.fechaHoraInicioProgramada).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    const alertasExcesoKmRaw = await this.reservaModel
      .find({
        excedeUmbralKm: true,
        $or: [
          { justificacionExcesoKm: { $exists: false } },
          { justificacionExcesoKm: '' },
          { justificacionExcesoKm: null },
        ],
      })
      .sort({ fechaHoraFinReal: -1 })
      .limit(5);

    const alertasExcesoKm = alertasExcesoKmRaw.map((a) => ({
      id: a._id,
      placaUt: a.placaUt,
      conductor: a.nombreConductor,
      kmSugeridos: a.kmSugeridosGoogle,
      kmReales: a.kmRealesGps || a.kmSugeridosGoogle,
      desviacion: a.porcentajeDesviacionKm || 0,
    }));

    const mantenimientosBorradorRaw = await this.mantenimientoModel
      .find({ estado: EstadoMantenimiento.BORRADOR })
      .sort({ fechaApertura: -1 })
      .limit(5);

    const mantenimientosBorrador = mantenimientosBorradorRaw.map((m) => ({
      id: m._id,
      placaUt: m.placaUt,
      fechaApertura: m.fechaApertura.toISOString(),
      tareas:
        m.tareasChecklist.filter((t) => t.seleccionada).length +
        m.tareasManuales.length,
    }));

    return {
      kpis: {
        disponibles,
        viajando,
        enMantenimiento,
        inactivas,
        total: totalUts,
      },
      viajesHoy,
      alertasExcesoKm,
      mantenimientosBorrador,
    };
  }
}
