import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  UsuarioAdmin,
  UsuarioAdminSchema,
} from './schemas/usuario-admin.schema.js';
import { Conductor, ConductorSchema } from './schemas/conductor.schema.js';
import {
  UnidadTransporte,
  UnidadTransporteSchema,
} from './schemas/unidad-transporte.schema.js';
import {
  CatalogoTareaMantenimiento,
  CatalogoTareaMantenimientoSchema,
} from './schemas/catalogo-tarea.schema.js';
import {
  ReservaViaje,
  ReservaViajeSchema,
} from './schemas/reserva-viaje.schema.js';
import {
  Mantenimiento,
  MantenimientoSchema,
} from './schemas/mantenimiento.schema.js';
import {
  PuntoFrecuente,
  PuntoFrecuenteSchema,
} from './schemas/punto-frecuente.schema.js';
import {
  PuntoTrackingViaje,
  PuntoTrackingViajeSchema,
} from './schemas/punto-tracking.schema.js';
import { SeedService } from './seed.service.js';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGODB_URI') ||
          'mongodb://mongodb:27017/gestion_ut';
        return {
          uri,
          // Compatible with CosmosDB and standard MongoDB wire protocol
          autoIndex: true,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: UsuarioAdmin.name, schema: UsuarioAdminSchema },
      { name: Conductor.name, schema: ConductorSchema },
      { name: UnidadTransporte.name, schema: UnidadTransporteSchema },
      {
        name: CatalogoTareaMantenimiento.name,
        schema: CatalogoTareaMantenimientoSchema,
      },
      { name: ReservaViaje.name, schema: ReservaViajeSchema },
      { name: PuntoFrecuente.name, schema: PuntoFrecuenteSchema },
      { name: Mantenimiento.name, schema: MantenimientoSchema },
      { name: PuntoTrackingViaje.name, schema: PuntoTrackingViajeSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [MongooseModule, SeedService],
})
export class DatabaseModule {}
