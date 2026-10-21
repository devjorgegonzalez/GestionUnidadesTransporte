import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { TrackingService } from './tracking.service.js';
import { TrackingController } from './tracking.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
