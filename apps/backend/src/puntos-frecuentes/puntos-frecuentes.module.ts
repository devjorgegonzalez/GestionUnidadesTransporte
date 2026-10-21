import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { PuntosFrecuentesService } from './puntos-frecuentes.service.js';
import { PuntosFrecuentesController } from './puntos-frecuentes.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [PuntosFrecuentesController],
  providers: [PuntosFrecuentesService],
  exports: [PuntosFrecuentesService],
})
export class PuntosFrecuentesModule {}
