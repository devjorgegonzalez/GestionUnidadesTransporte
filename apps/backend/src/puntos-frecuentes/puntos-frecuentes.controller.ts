import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { PuntosFrecuentesService } from './puntos-frecuentes.service.js';
import { CreatePuntoFrecuenteDto } from './dto/create-punto-frecuente.dto.js';
import { UpdatePuntoFrecuenteDto } from './dto/update-punto-frecuente.dto.js';
import { QueryPuntosFrecuentesDto } from './dto/query-puntos-frecuentes.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('Puntos Frecuentes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('puntos-frecuentes')
export class PuntosFrecuentesController {
  constructor(
    private readonly puntosService: PuntosFrecuentesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo Punto Frecuente' })
  @ApiResponse({ status: 201, description: 'Punto frecuente creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'Nombre duplicado.' })
  async create(@Body() dto: CreatePuntoFrecuenteDto) {
    return this.puntosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar puntos frecuentes paginados con filtros' })
  async findAll(@Query() query: QueryPuntosFrecuentesDto) {
    return this.puntosService.findAll(query);
  }

  @Get('activos')
  @ApiOperation({
    summary:
      'Listar todos los puntos frecuentes activos para el formulario de reservas',
  })
  async findActivos() {
    return this.puntosService.findActivos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un punto frecuente' })
  @ApiResponse({ status: 200, description: 'Detalle del punto frecuente.' })
  @ApiResponse({ status: 404, description: 'Punto frecuente no encontrado.' })
  async findById(@Param('id') id: string) {
    return this.puntosService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un punto frecuente' })
  @ApiResponse({ status: 200, description: 'Punto frecuente actualizado.' })
  @ApiResponse({ status: 409, description: 'Nombre duplicado.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePuntoFrecuenteDto,
  ) {
    return this.puntosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un punto frecuente' })
  @ApiResponse({ status: 200, description: 'Punto frecuente desactivado.' })
  async remove(@Param('id') id: string) {
    return this.puntosService.remove(id);
  }
}
