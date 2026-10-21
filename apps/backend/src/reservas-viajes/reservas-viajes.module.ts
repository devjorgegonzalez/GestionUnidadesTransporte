import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { ReservasViajesService } from './reservas-viajes.service.js';
import { ReservasViajesController } from './reservas-viajes.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ReservasViajesController],
  providers: [ReservasViajesService],
  exports: [ReservasViajesService],
})
export class ReservasViajesModule {}
