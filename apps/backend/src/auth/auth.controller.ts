import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { ConductorLoginDto } from './dto/conductor-login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { JwtPayload } from './strategies/jwt.strategy.js';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión Administrador (Web)',
    description:
      'Autentica a un usuario administrador con email y contraseña, retornando un JWT Bearer Token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso; retorna token y datos de usuario.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async loginAdmin(@Body() dto: AdminLoginDto) {
    return this.authService.loginAdmin(dto);
  }

  @Post('conductor/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión Conductor (App Móvil)',
    description:
      'Autentica al conductor mediante su cédula y la placa de la UT asignada. Retorna token JWT y las reservas del día actual.',
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticación exitosa; retorna JWT y reservas disponibles.',
  })
  @ApiResponse({
    status: 401,
    description: 'Conductor o unidad de transporte no encontrados o inactivos.',
  })
  @ApiResponse({
    status: 400,
    description: 'La UT se encuentra en mantenimiento o inactiva.',
  })
  async loginConductor(@Body() dto: ConductorLoginDto) {
    return this.authService.loginConductor(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener información de la sesión actual',
    description:
      'Retorna el perfil del usuario autenticado a partir del JWT Bearer Token.',
  })
  @ApiResponse({ status: 200, description: 'Datos del usuario autenticado.' })
  @ApiResponse({ status: 401, description: 'Token ausente o inválido.' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user);
  }
}
