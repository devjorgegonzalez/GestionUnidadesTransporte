import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UnidadesTransporteModule } from './unidades-transporte/unidades-transporte.module.js';
import { ConductoresModule } from './conductores/conductores.module.js';
import { PuntosFrecuentesModule } from './puntos-frecuentes/puntos-frecuentes.module.js';
import { MantenimientosModule } from './mantenimientos/mantenimientos.module.js';
import { ReservasViajesModule } from './reservas-viajes/reservas-viajes.module.js';
import { TrackingModule } from './tracking/tracking.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UnidadesTransporteModule,
    ConductoresModule,
    PuntosFrecuentesModule,
    MantenimientosModule,
    ReservasViajesModule,
    TrackingModule,
    DashboardModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
