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
import { ConductoresService } from './conductores.service.js';
import { CreateConductorDto } from './dto/create-conductor.dto.js';
import { UpdateConductorDto } from './dto/update-conductor.dto.js';
import { QueryConductoresDto } from './dto/query-conductores.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('Conductores')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'GESTOR')
@Controller('conductores')
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo Conductor' })
  @ApiResponse({ status: 201, description: 'Conductor creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'Cédula duplicada.' })
  async create(@Body() dto: CreateConductorDto) {
    return this.conductoresService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar conductores paginados con filtros' })
  async findAll(@Query() query: QueryConductoresDto) {
    return this.conductoresService.findAll(query);
  }

  @Get('activos')
  @ApiOperation({
    summary: 'Listar todos los conductores activos para asignación de viajes',
  })
  async findActivos() {
    return this.conductoresService.findActivos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un conductor' })
  @ApiResponse({ status: 200, description: 'Detalle del conductor.' })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado.' })
  async findById(@Param('id') id: string) {
    return this.conductoresService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos o estado de un conductor' })
  @ApiResponse({ status: 200, description: 'Conductor actualizado.' })
  @ApiResponse({ status: 409, description: 'Cédula duplicada.' })
  async update(@Param('id') id: string, @Body() dto: UpdateConductorDto) {
    return this.conductoresService.update(id, dto);
  }
}
