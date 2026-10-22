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
import { MantenimientosService } from './mantenimientos.service.js';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto.js';
import { UpdateBorradorMantenimientoDto } from './dto/update-borrador.dto.js';
import { FinalizarMantenimientoDto } from './dto/finalizar-mantenimiento.dto.js';
import { QueryMantenimientosDto } from './dto/query-mantenimientos.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('Mantenimientos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'GESTOR')
@Controller('mantenimientos')
export class MantenimientosController {
  constructor(private readonly mantenimientosService: MantenimientosService) {}

  @Get('catalogo-checklist')
  @ApiOperation({
    summary: 'Obtener el catálogo de tareas base del checklist predefinido',
  })
  async getCatalogoChecklist() {
    return this.mantenimientosService.getCatalogoChecklist();
  }

  @Post()
  @ApiOperation({
    summary:
      'Abrir orden de mantenimiento en BORRADOR y cambiar estado de la UT a EN_MANTENIMIENTO',
  })
  @ApiResponse({
    status: 201,
    description: 'Mantenimiento en borrador creado y UT en mantenimiento.',
  })
  @ApiResponse({
    status: 400,
    description: 'UT viajando o ya en mantenimiento.',
  })
  async create(@Body() dto: CreateMantenimientoDto) {
    return this.mantenimientosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar órdenes de mantenimiento con filtros' })
  async findAll(@Query() query: QueryMantenimientosDto) {
    return this.mantenimientosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una orden de mantenimiento' })
  @ApiResponse({ status: 200, description: 'Detalle del mantenimiento.' })
  @ApiResponse({ status: 404, description: 'Mantenimiento no encontrado.' })
  async findById(@Param('id') id: string) {
    return this.mantenimientosService.findById(id);
  }

  @Patch(':id/borrador')
  @ApiOperation({
    summary: 'Actualizar tareas de un mantenimiento que aún está en BORRADOR',
  })
  async updateBorrador(
    @Param('id') id: string,
    @Body() dto: UpdateBorradorMantenimientoDto,
  ) {
    return this.mantenimientosService.updateBorrador(id, dto);
  }

  @Post(':id/finalizar')
  @ApiOperation({
    summary:
      'Dar por terminado el mantenimiento, registrar observaciones técnicas y pasar la UT a DISPONIBLE o INACTIVA',
  })
  @ApiResponse({
    status: 200,
    description: 'Mantenimiento finalizado y estado de la UT actualizado.',
  })
  async finalizar(
    @Param('id') id: string,
    @Body() dto: FinalizarMantenimientoDto,
  ) {
    return this.mantenimientosService.finalizar(id, dto);
  }
}
