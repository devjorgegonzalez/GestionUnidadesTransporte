var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { PuntosFrecuentesService } from './puntos-frecuentes.service.js';
import { PuntosFrecuentesController } from './puntos-frecuentes.controller.js';
let PuntosFrecuentesModule = class PuntosFrecuentesModule {
};
PuntosFrecuentesModule = __decorate([
    Module({
        imports: [DatabaseModule],
        controllers: [PuntosFrecuentesController],
        providers: [PuntosFrecuentesService],
        exports: [PuntosFrecuentesService],
    })
], PuntosFrecuentesModule);
export { PuntosFrecuentesModule };
//# sourceMappingURL=puntos-frecuentes.module.js.map