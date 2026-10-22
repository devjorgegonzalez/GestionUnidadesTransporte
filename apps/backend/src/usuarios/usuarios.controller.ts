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
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { QueryUsuariosDto } from './dto/query-usuarios.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/strategies/jwt.strategy.js';

@ApiTags('Administración de Usuarios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios registrados (Solo Administrador)',
    description:
      'Retorna la lista de usuarios con rol ADMIN o GESTOR, permitiendo filtrar por búsqueda, rol y estado activo.',
  })
  @ApiResponse({ status: 200, description: 'Listado de usuarios.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado (requiere rol ADMIN).' })
  async findAll(@Query() query: QueryUsuariosDto) {
    return this.usuariosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Detalle del usuario.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findById(@Param('id') id: string) {
    return this.usuariosService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar un nuevo usuario (ADMIN o GESTOR)',
    description:
      'Crea una nueva cuenta de acceso a la plataforma web asignando el rol especificado.',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya existe.' })
  async create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar datos, rol o contraseña de un usuario',
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Violación de reglas de seguridad de administración.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUsuarioDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usuariosService.update(id, dto, user.sub);
  }

  @Patch(':id/toggle-activo')
  @ApiOperation({ summary: 'Alternar estado activo/inactivo de un usuario' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente.' })
  async toggleActivo(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usuariosService.toggleActivo(id, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario del sistema' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar la cuenta propia o el último admin.' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usuariosService.delete(id, user.sub);
  }
}
