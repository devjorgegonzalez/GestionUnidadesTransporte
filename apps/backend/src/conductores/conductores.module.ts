import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { ConductoresService } from './conductores.service.js';
import { ConductoresController } from './conductores.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ConductoresController],
  providers: [ConductoresService],
  exports: [ConductoresService],
})
export class ConductoresModule {}
