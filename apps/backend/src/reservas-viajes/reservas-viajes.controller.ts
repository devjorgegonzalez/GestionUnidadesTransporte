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
import { ReservasViajesService } from './reservas-viajes.service.js';
import { CreateReservaViajeDto } from './dto/create-reserva-viaje.dto.js';
import { UpdateReservaViajeDto } from './dto/update-reserva-viaje.dto.js';
import { QueryReservasViajesDto } from './dto/query-reservas-viajes.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('Reservas de Viajes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservas-viajes')
export class ReservasViajesController {
  constructor(private readonly reservasService: ReservasViajesService) {}

  @Post()
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({
    summary:
      'Programar una nueva Reserva de Viaje (valida UT DISPONIBLE o VIAJANDO)',
  })
  @ApiResponse({ status: 201, description: 'Reserva creada exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'UT en mantenimiento/inactiva o conductor no activo.',
  })
  async create(@Body() dto: CreateReservaViajeDto) {
    return this.reservasService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'GESTOR', 'CONDUCTOR')
  @ApiOperation({ summary: 'Listar reservas de viajes paginadas con filtros' })
  async findAll(@Query() query: QueryReservasViajesDto) {
    return this.reservasService.findAll(query);
  }

  @Get(':id')
  @Roles('ADMIN', 'GESTOR', 'CONDUCTOR')
  @ApiOperation({ summary: 'Obtener detalle de una reserva de viaje' })
  @ApiResponse({ status: 200, description: 'Detalle de la reserva.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async findById(@Param('id') id: string) {
    return this.reservasService.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({
    summary: 'Modificar una reserva programada (reasignar UT/conductor o ruta)',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReservaViajeDto,
  ) {
    return this.reservasService.update(id, dto);
  }

  @Patch(':id/cancelar')
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({ summary: 'Cancelar una reserva programada' })
  @ApiResponse({ status: 200, description: 'Reserva cancelada exitosamente.' })
  async cancelar(@Param('id') id: string) {
    return this.reservasService.cancelar(id);
  }
}
