import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { MantenimientosService } from './mantenimientos.service.js';
import { MantenimientosController } from './mantenimientos.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [MantenimientosController],
  providers: [MantenimientosService],
  exports: [MantenimientosService],
})
export class MantenimientosModule {}
