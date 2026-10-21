import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  UsuarioAdmin,
  UsuarioAdminDocument,
} from './schemas/usuario-admin.schema.js';
import {
  CatalogoTareaMantenimiento,
  CatalogoTareaMantenimientoDocument,
} from './schemas/catalogo-tarea.schema.js';
import {
  UnidadTransporte,
  UnidadTransporteDocument,
  TipoUnidadTransporte,
  EstadoUnidadTransporte,
} from './schemas/unidad-transporte.schema.js';
import {
  Conductor,
  ConductorDocument,
} from './schemas/conductor.schema.js';
import {
  PuntoFrecuente,
  PuntoFrecuenteDocument,
} from './schemas/punto-frecuente.schema.js';
import {
  ReservaViaje,
  ReservaViajeDocument,
  EstadoReservaViaje,
} from './schemas/reserva-viaje.schema.js';
import {
  Mantenimiento,
  MantenimientoDocument,
  EstadoMantenimiento,
} from './schemas/mantenimiento.schema.js';
import {
  PuntoTrackingViaje,
  PuntoTrackingViajeDocument,
} from './schemas/punto-tracking.schema.js';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(UsuarioAdmin.name)
    private readonly adminModel: Model<UsuarioAdminDocument>,
    @InjectModel(CatalogoTareaMantenimiento.name)
    private readonly catalogoModel: Model<CatalogoTareaMantenimientoDocument>,
    @InjectModel(UnidadTransporte.name)
    private readonly utModel: Model<UnidadTransporteDocument>,
    @InjectModel(Conductor.name)
    private readonly conductorModel: Model<ConductorDocument>,
    @InjectModel(PuntoFrecuente.name)
    private readonly puntoFrecuenteModel: Model<PuntoFrecuenteDocument>,
    @InjectModel(ReservaViaje.name)
    private readonly reservaModel: Model<ReservaViajeDocument>,
    @InjectModel(Mantenimiento.name)
    private readonly mantenimientoModel: Model<MantenimientoDocument>,
    @InjectModel(PuntoTrackingViaje.name)
    private readonly trackingModel: Model<PuntoTrackingViajeDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
    await this.seedCatalogoTareas();
    await this.seedUnidadesTransporte();
    await this.seedConductores();
    await this.seedPuntosFrecuentes();
    await this.seedMantenimiento();
    await this.seedReservasYViajes();
    this.logger.log('[Seed] Poblado completo del sistema inicializado.');
  }

  private async seedAdmin() {
    const defaultEmail = (
      this.configService.get<string>('ADMIN_DEFAULT_EMAIL') || 'admin@empresa.com'
    ).toLowerCase();
    const defaultPassword =
      this.configService.get<string>('ADMIN_DEFAULT_PASSWORD') || 'Admin123*';

    const existingAdmin = await this.adminModel.findOne({ email: defaultEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);
      await this.adminModel.create({
        nombre: 'Administrador del Sistema',
        email: defaultEmail,
        passwordHash,
        rol: 'ADMIN',
        activo: true,
      });
      this.logger.log(`[Seed] Usuario administrador creado por defecto: ${defaultEmail}`);
    } else {
      this.logger.log(`[Seed] Usuario administrador verificado (${defaultEmail}).`);
    }
  }

  private async seedCatalogoTareas() {
    const tareasBase = [
      { codigo: 'CAMBIO_ACEITE', nombre: 'Cambio de aceite y filtro de motor', orden: 1 },
      { codigo: 'CAMBIO_BUJIAS', nombre: 'Cambio de bujías', orden: 2 },
      { codigo: 'LIMPIEZA_INYECTORES', nombre: 'Limpieza de inyectores', orden: 3 },
      { codigo: 'REVISION_FRENOS', nombre: 'Revisión y ajuste de sistema de frenos', orden: 4 },
      { codigo: 'REVISION_NEUMATICOS', nombre: 'Revisión de neumáticos y presión de aire', orden: 5 },
      { codigo: 'ALINEACION_BALANCEO', nombre: 'Alineación y balanceo', orden: 6 },
      { codigo: 'CAMBIO_FILTROS', nombre: 'Cambio de filtros de aire y combustible', orden: 7 },
      { codigo: 'REVISION_BATERIA', nombre: 'Revisión de batería y sistema eléctrico', orden: 8 },
      { codigo: 'REVISION_SUSPENSION', nombre: 'Revisión de suspensión y amortiguadores', orden: 9 },
      { codigo: 'REVISION_FLUIDOS', nombre: 'Revisión de niveles de fluidos (refrigerante, liga de frenos, transmisión)', orden: 10 },
    ];

    for (const item of tareasBase) {
      await this.catalogoModel.updateOne(
        { codigo: item.codigo },
        {
          $setOnInsert: {
            codigo: item.codigo,
            nombre: item.nombre,
            orden: item.orden,
            activo: true,
          },
        },
        { upsert: true },
      );
    }
  }

  private async seedUnidadesTransporte() {
    const vehiculos = [
      {
        placa: 'ABC-101',
        marca: 'Toyota',
        modelo: 'Dyna 4.0 Industrial',
        anio: 2021,
        tipo: TipoUnidadTransporte.CAMION,
        capacidadPersonas: 3,
        kilometraje: 45000,
        estado: EstadoUnidadTransporte.DISPONIBLE,
      },
      {
        placa: 'VAN-202',
        marca: 'Ford',
        modelo: 'Transit Pasajeros',
        anio: 2022,
        tipo: TipoUnidadTransporte.VAN,
        capacidadPersonas: 12,
        kilometraje: 62300,
        estado: EstadoUnidadTransporte.VIAJANDO,
      },
      {
        placa: 'SUV-303',
        marca: 'Toyota',
        modelo: 'Fortuner 4x4',
        anio: 2023,
        tipo: TipoUnidadTransporte.CAMIONETA_SUV,
        capacidadPersonas: 7,
        kilometraje: 28100,
        estado: EstadoUnidadTransporte.DISPONIBLE,
      },
      {
        placa: 'PCK-404',
        marca: 'Toyota',
        modelo: 'Hilux Doble Cabina',
        anio: 2020,
        tipo: TipoUnidadTransporte.CAMIONETA_PICKUP,
        capacidadPersonas: 5,
        kilometraje: 89400,
        estado: EstadoUnidadTransporte.EN_MANTENIMIENTO,
      },
      {
        placa: 'SED-505',
        marca: 'Toyota',
        modelo: 'Corolla GLi',
        anio: 2019,
        tipo: TipoUnidadTransporte.SEDAN,
        capacidadPersonas: 5,
        kilometraje: 115000,
        estado: EstadoUnidadTransporte.DISPONIBLE,
      },
      {
        placa: 'MOT-606',
        marca: 'Yamaha',
        modelo: 'YBR 125 Express',
        anio: 2022,
        tipo: TipoUnidadTransporte.MOTO,
        capacidadPersonas: 2,
        kilometraje: 12000,
        estado: EstadoUnidadTransporte.INACTIVA,
      },
    ];

    for (const v of vehiculos) {
      await this.utModel.updateOne(
        { placa: v.placa },
        { $set: v },
        { upsert: true },
      );
    }
  }

  private async seedConductores() {
    const conductores = [
      {
        nombre: 'Carlos',
        apellido: 'Pérez',
        cedula: '19876543',
        telefono: '+58 412 1112233',
        activo: true,
      },
      {
        nombre: 'Manuel',
        apellido: 'Gómez',
        cedula: '18234567',
        telefono: '+58 414 3334455',
        activo: true,
      },
      {
        nombre: 'Roberto',
        apellido: 'Díaz',
        cedula: '20456789',
        telefono: '+58 424 5556677',
        activo: true,
      },
      {
        nombre: 'Luis',
        apellido: 'Rodríguez',
        cedula: '17890123',
        telefono: '+58 416 7778899',
        activo: true,
      },
    ];

    for (const c of conductores) {
      await this.conductorModel.updateOne(
        { cedula: c.cedula },
        { $set: c },
        { upsert: true },
      );
    }
  }

  private async seedPuntosFrecuentes() {
    const puntos = [
      {
        nombre: 'Planta Principal Los Cortijos',
        direccion: 'Av. Principal Los Cortijos de Lourdes, Caracas',
        coordenadas: { lat: 10.4851, lng: -66.8234 },
        descripcion: 'Planta de ensamblaje e instalación industrial principal',
        activo: true,
      },
      {
        nombre: 'Almacén Central La Yaguara',
        direccion: 'Zona Industrial La Yaguara, Calle 3, Caracas',
        coordenadas: { lat: 10.4806, lng: -66.9617 },
        descripcion: 'Depósito de repuestos, tuberías y maquinaria pesada',
        activo: true,
      },
      {
        nombre: 'Cliente Siderúrgica Charallave',
        direccion: 'Carretera Nacional Charallave - Ocumare, Sector Industrial',
        coordenadas: { lat: 10.245, lng: -66.862 },
        descripcion: 'Complejo metalúrgico e instalación de hornos industriales',
        activo: true,
      },
      {
        nombre: 'Taller Mecánico Catia',
        direccion: 'Av. Sucre, Catia, Caracas',
        coordenadas: { lat: 10.515, lng: -66.938 },
        descripcion: 'Taller homologado para mantenimientos mayores',
        activo: true,
      },
      {
        nombre: 'Torre Empresarial El Rosal',
        direccion: 'Av. Francisco de Miranda, El Rosal, Chacao',
        coordenadas: { lat: 10.4905, lng: -66.8655 },
        descripcion: 'Oficinas corporativas y gerencia de operaciones',
        activo: true,
      },
    ];

    for (const p of puntos) {
      await this.puntoFrecuenteModel.updateOne(
        { nombre: p.nombre },
        { $set: p },
        { upsert: true },
      );
    }
  }

  private async seedMantenimiento() {
    const pckUt = await this.utModel.findOne({ placa: 'PCK-404' });
    if (!pckUt) return;

    const existingMant = await this.mantenimientoModel.findOne({
      utId: pckUt._id,
      estado: EstadoMantenimiento.BORRADOR,
    });

    if (!existingMant) {
      await this.mantenimientoModel.create({
        utId: pckUt._id,
        placaUt: pckUt.placa,
        kilometrajeRegistro: pckUt.kilometraje,
        estado: EstadoMantenimiento.BORRADOR,
        tareasChecklist: [
          { codigo: 'CAMBIO_ACEITE', nombre: 'Cambio de aceite y filtro de motor', seleccionada: true, esManual: false },
          { codigo: 'CAMBIO_BUJIAS', nombre: 'Cambio de bujías', seleccionada: true, esManual: false },
          { codigo: 'REVISION_FRENOS', nombre: 'Revisión y ajuste de sistema de frenos', seleccionada: true, esManual: false },
          { codigo: 'REVISION_FLUIDOS', nombre: 'Revisión de niveles de fluidos', seleccionada: true, esManual: false },
        ],
        tareasManuales: [
          { nombre: 'Inspección de fuga en cárter y reemplazo de empacadura', seleccionada: true, esManual: true },
        ],
        fechaApertura: new Date(),
      });
    }
  }

  private async seedReservasYViajes() {
    const utAbc = await this.utModel.findOne({ placa: 'ABC-101' });
    const utVan = await this.utModel.findOne({ placa: 'VAN-202' });
    const utSed = await this.utModel.findOne({ placa: 'SED-505' });

    const condCarlos = await this.conductorModel.findOne({ cedula: '19876543' });
    const condManuel = await this.conductorModel.findOne({ cedula: '18234567' });
    const condRoberto = await this.conductorModel.findOne({ cedula: '20456789' });

    if (!utAbc || !utVan || !condCarlos || !condManuel) return;

    const hoy = new Date();
    hoy.setHours(9, 0, 0, 0);

    // 1. Reserva PROGRAMADA para hoy (Conductor Carlos Pérez / UT ABC-101)
    const existingProg = await this.reservaModel.findOne({
      placaUt: utAbc.placa,
      cedulaConductor: condCarlos.cedula,
      estado: EstadoReservaViaje.PROGRAMADA,
    });

    if (!existingProg) {
      await this.reservaModel.create({
        utId: utAbc._id,
        placaUt: utAbc.placa,
        conductorId: condCarlos._id,
        cedulaConductor: condCarlos.cedula,
        nombreConductor: `${condCarlos.nombre} ${condCarlos.apellido}`,
        fechaHoraInicioProgramada: hoy,
        origen: {
          nombre: 'Planta Principal Los Cortijos',
          direccion: 'Av. Principal Los Cortijos de Lourdes, Caracas',
          lat: 10.4851,
          lng: -66.8234,
        },
        destino: {
          nombre: 'Almacén Central La Yaguara',
          direccion: 'Zona Industrial La Yaguara, Calle 3, Caracas',
          lat: 10.4806,
          lng: -66.9617,
        },
        kmSugeridosGoogle: 16.5,
        duracionSugeridaMinutos: 35,
        estado: EstadoReservaViaje.PROGRAMADA,
        kilometrajeUtInicial: utAbc.kilometraje,
      });
    }

    // 2. Viaje EN_CURSO con telemetría activa (Conductor Manuel Gómez / UT VAN-202)
    const existingEnCurso = await this.reservaModel.findOne({
      placaUt: utVan.placa,
      cedulaConductor: condManuel.cedula,
      estado: EstadoReservaViaje.EN_CURSO,
    });

    let viajeEnCursoId: Types.ObjectId | null = null;
    if (!existingEnCurso) {
      const v = await this.reservaModel.create({
        utId: utVan._id,
        placaUt: utVan.placa,
        conductorId: condManuel._id,
        cedulaConductor: condManuel.cedula,
        nombreConductor: `${condManuel.nombre} ${condManuel.apellido}`,
        fechaHoraInicioProgramada: new Date(Date.now() - 45 * 60 * 1000), // Hace 45 min
        fechaHoraInicioReal: new Date(Date.now() - 40 * 60 * 1000),
        origen: {
          nombre: 'Planta Principal Los Cortijos',
          direccion: 'Av. Principal Los Cortijos de Lourdes, Caracas',
          lat: 10.4851,
          lng: -66.8234,
        },
        destino: {
          nombre: 'Cliente Siderúrgica Charallave',
          direccion: 'Carretera Nacional Charallave - Ocumare',
          lat: 10.245,
          lng: -66.862,
        },
        kmSugeridosGoogle: 48.0,
        duracionSugeridaMinutos: 65,
        estado: EstadoReservaViaje.EN_CURSO,
        kilometrajeUtInicial: utVan.kilometraje,
      });
      viajeEnCursoId = v._id as Types.ObjectId;
    } else {
      viajeEnCursoId = existingEnCurso._id as Types.ObjectId;
    }

    // Puntos GPS en vivo para el viaje en curso
    if (viajeEnCursoId) {
      const puntosSimulados = [
        { lat: 10.4851, lng: -66.8234, speed: 30, tOffset: -35 * 60 * 1000 },
        { lat: 10.478, lng: -66.835, speed: 65, tOffset: -30 * 60 * 1000 },
        { lat: 10.45, lng: -66.85, speed: 78, tOffset: -20 * 60 * 1000 },
        { lat: 10.38, lng: -66.86, speed: 82, tOffset: -10 * 60 * 1000 },
        { lat: 10.31, lng: -66.861, speed: 75, tOffset: -2 * 60 * 1000 },
      ];

      for (let i = 0; i < puntosSimulados.length; i++) {
        const p = puntosSimulados[i];
        const idPunto = `seed-pt-${viajeEnCursoId.toString()}-${i}`;
        await this.trackingModel.updateOne(
          { idPuntoCliente: idPunto },
          {
            $setOnInsert: {
              viajeId: viajeEnCursoId,
              utId: utVan._id,
              conductorId: condManuel._id,
              lat: p.lat,
              lng: p.lng,
              velocidadKmh: p.speed,
              precisionMetros: 5.0,
              capturadoEn: new Date(Date.now() + p.tOffset),
              idPuntoCliente: idPunto,
            },
          },
          { upsert: true },
        );
      }
    }

    // 3. Viaje FINALIZADO para historial con exceso de kilometraje (>10%)
    if (utSed && condRoberto) {
      const existingFin = await this.reservaModel.findOne({
        placaUt: utSed.placa,
        cedulaConductor: condRoberto.cedula,
        estado: EstadoReservaViaje.FINALIZADO,
      });

      if (!existingFin) {
        const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await this.reservaModel.create({
          utId: utSed._id,
          placaUt: utSed.placa,
          conductorId: condRoberto._id,
          cedulaConductor: condRoberto.cedula,
          nombreConductor: `${condRoberto.nombre} ${condRoberto.apellido}`,
          fechaHoraInicioProgramada: ayer,
          fechaHoraInicioReal: ayer,
          fechaHoraFinReal: new Date(ayer.getTime() + 50 * 60 * 1000),
          origen: {
            nombre: 'Torre Empresarial El Rosal',
            direccion: 'Av. Francisco de Miranda, Chacao',
            lat: 10.4905,
            lng: -66.8655,
          },
          destino: {
            nombre: 'Almacén Central La Yaguara',
            direccion: 'Zona Industrial La Yaguara, Calle 3',
            lat: 10.4806,
            lng: -66.9617,
          },
          kmSugeridosGoogle: 12.0,
          kmRealesGps: 14.8,
          porcentajeDesviacionKm: 23.33,
          excedeUmbralKm: true,
          justificacionExcesoKm: 'Desvío por cierre vial en autopista Francisco Fajardo reportado por el conductor.',
          estado: EstadoReservaViaje.FINALIZADO,
          kilometrajeUtInicial: 114985,
          kilometrajeUtFinal: 115000,
        });
      }
    }
  }
}
