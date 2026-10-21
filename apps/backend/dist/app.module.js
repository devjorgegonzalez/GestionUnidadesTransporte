var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
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
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map