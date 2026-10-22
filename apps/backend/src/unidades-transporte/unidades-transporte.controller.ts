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
import { UnidadesTransporteService } from './unidades-transporte.service.js';
import { CreateUnidadTransporteDto } from './dto/create-unidad-transporte.dto.js';
import { UpdateUnidadTransporteDto } from './dto/update-unidad-transporte.dto.js';
import { QueryUnidadesTransporteDto } from './dto/query-unidades-transporte.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('Unidades de Transporte')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'GESTOR')
@Controller('unidades-transporte')
export class UnidadesTransporteController {
  constructor(private readonly utService: UnidadesTransporteService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva Unidad de Transporte' })
  @ApiResponse({ status: 201, description: 'UT creada exitosamente.' })
  @ApiResponse({ status: 409, description: 'Placa duplicada.' })
  async create(@Body() dto: CreateUnidadTransporteDto) {
    return this.utService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar Unidades de Transporte paginadas con filtros',
  })
  async findAll(@Query() query: QueryUnidadesTransporteDto) {
    return this.utService.findAll(query);
  }

  @Get('disponibles-reserva')
  @ApiOperation({
    summary:
      'Listar UTs elegibles para reservas (estados DISPONIBLE y VIAJANDO)',
  })
  async findDisponiblesReserva() {
    return this.utService.findDisponiblesReserva();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una Unidad de Transporte' })
  @ApiResponse({ status: 200, description: 'Detalle de la UT.' })
  @ApiResponse({ status: 404, description: 'UT no encontrada.' })
  async findById(@Param('id') id: string) {
    return this.utService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Actualizar datos de una UT (bloquea cambio de estado si está VIAJANDO o EN_MANTENIMIENTO)',
  })
  @ApiResponse({ status: 200, description: 'UT actualizada.' })
  @ApiResponse({
    status: 400,
    description: 'Estado bloqueado por viaje activo o mantenimiento.',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUnidadTransporteDto,
  ) {
    return this.utService.update(id, dto);
  }
}
