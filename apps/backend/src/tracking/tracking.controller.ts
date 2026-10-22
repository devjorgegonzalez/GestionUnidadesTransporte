import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TrackingService } from './tracking.service.js';
import { TrackingBatchDto } from './dto/tracking-batch.dto.js';
import { FinalizarViajeDto } from './dto/finalizar-viaje.dto.js';
import { JustificacionViajeDto } from './dto/justificacion-viaje.dto.js';
import { QueryHistorialViajesDto } from './dto/query-historial-viajes.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@ApiTags('Tracking y Visor de Viajes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('viajes/hoy')
  @Roles('CONDUCTOR', 'ADMIN', 'GESTOR')
  @ApiOperation({
    summary: 'Listar reservas del día para el conductor o administrador autenticado',
  })
  async getReservasHoy(@CurrentUser() user: any) {
    return this.trackingService.getReservasHoy(user);
  }

  @Post('viajes/:viajeId/iniciar')
  @Roles('CONDUCTOR', 'ADMIN', 'GESTOR')
  @ApiOperation({
    summary: 'Iniciar viaje (cambia viaje a EN_CURSO y UT a VIAJANDO)',
  })
  async iniciarViaje(@Param('viajeId') viajeId: string) {
    return this.trackingService.iniciarViaje(viajeId);
  }

  @Post('viajes/:viajeId/tracking/batch')
  @Roles('CONDUCTOR', 'ADMIN', 'GESTOR')
  @ApiOperation({
    summary: 'Recepción de lotes de telemetría GPS cada 5 minutos (idempotente)',
  })
  async registrarBatch(
    @Param('viajeId') viajeId: string,
    @Body() dto: TrackingBatchDto,
  ) {
    return this.trackingService.registrarBatch(viajeId, dto);
  }

  @Post('viajes/:viajeId/finalizar')
  @Roles('CONDUCTOR', 'ADMIN', 'GESTOR')
  @ApiOperation({
    summary:
      'Terminar viaje: calcula km reales GPS con Haversine, suma al odómetro de la UT, evalúa desviación y libera UT a DISPONIBLE',
  })
  async finalizarViaje(
    @Param('viajeId') viajeId: string,
    @Body() dto?: FinalizarViajeDto,
  ) {
    return this.trackingService.finalizarViaje(viajeId, dto);
  }

  @Get('visor/activos')
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({
    summary:
      'Listar unidades actualmente VIAJANDO con última posición, velocidad y ruta trazada',
  })
  async getFlotaActiva() {
    return this.trackingService.getFlotaActiva();
  }

  @Get('visor/viajes')
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({
    summary: 'Buscar historial de viajes activos o terminados con filtros',
  })
  async getHistorialViajes(@Query() query: QueryHistorialViajesDto) {
    return this.trackingService.getHistorialViajes(query);
  }

  @Get('visor/viajes/:viajeId/tracking')
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({
    summary: 'Obtener detalle completo de tracking GPS y ruta de un viaje',
  })
  async getTrackingDetalle(@Param('viajeId') viajeId: string) {
    return this.trackingService.getTrackingDetalle(viajeId);
  }

  @Patch('visor/viajes/:viajeId/justificacion')
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({
    summary:
      'Registrar justificación/observación administrativa por exceso de kilometraje',
  })
  async guardarJustificacion(
    @Param('viajeId') viajeId: string,
    @Body() dto: JustificacionViajeDto,
  ) {
    return this.trackingService.guardarJustificacion(viajeId, dto);
  }
}
