var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioAdmin, UsuarioAdminSchema, } from './schemas/usuario-admin.schema.js';
import { Conductor, ConductorSchema } from './schemas/conductor.schema.js';
import { UnidadTransporte, UnidadTransporteSchema, } from './schemas/unidad-transporte.schema.js';
import { CatalogoTareaMantenimiento, CatalogoTareaMantenimientoSchema, } from './schemas/catalogo-tarea.schema.js';
import { ReservaViaje, ReservaViajeSchema, } from './schemas/reserva-viaje.schema.js';
import { Mantenimiento, MantenimientoSchema, } from './schemas/mantenimiento.schema.js';
import { PuntoFrecuente, PuntoFrecuenteSchema, } from './schemas/punto-frecuente.schema.js';
import { PuntoTrackingViaje, PuntoTrackingViajeSchema, } from './schemas/punto-tracking.schema.js';
import { SeedService } from './seed.service.js';
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    Module({
        imports: [
            MongooseModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService) => {
                    const uri = configService.get('MONGODB_URI') ||
                        'mongodb://mongodb:27017/gestion_ut';
                    return {
                        uri,
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
], DatabaseModule);
export { DatabaseModule };
//# sourceMappingURL=database.module.js.map