import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({
    example: 'María González',
    description: 'Nombre completo del usuario',
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  nombre?: string;

  @ApiPropertyOptional({
    example: 'maria.gonzalez@empresa.com',
    description: 'Correo electrónico único',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email?: string;

  @ApiPropertyOptional({
    example: 'NuevaClave456*',
    description:
      'Nueva contraseña del usuario (mínimo 6 caracteres). Si se omite, se conserva la actual.',
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    example: 'GESTOR',
    enum: ['ADMIN', 'GESTOR'],
    description: 'Rol del usuario: ADMIN (acceso total) o GESTOR (acceso operativo)',
  })
  @IsOptional()
  @IsEnum(['ADMIN', 'GESTOR'], {
    message: 'El rol debe ser ADMIN o GESTOR',
  })
  rol?: 'ADMIN' | 'GESTOR';

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el usuario se encuentra habilitado para iniciar sesión',
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un booleano' })
  activo?: boolean;
}
