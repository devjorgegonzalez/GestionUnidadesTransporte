import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { UnidadesTransporteService } from './unidades-transporte.service.js';
import { UnidadesTransporteController } from './unidades-transporte.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [UnidadesTransporteController],
  providers: [UnidadesTransporteService],
  exports: [UnidadesTransporteService],
})
export class UnidadesTransporteModule {}
