import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'María González',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  nombre: string;

  @ApiProperty({
    example: 'maria.gonzalez@empresa.com',
    description: 'Correo electrónico único para el inicio de sesión',
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email: string;

  @ApiProperty({
    example: 'ClaveSegura123*',
    description: 'Contraseña para acceso al sistema (mínimo 6 caracteres)',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'GESTOR',
    enum: ['ADMIN', 'GESTOR'],
    description: 'Rol del usuario: ADMIN (acceso total) o GESTOR (acceso operativo)',
  })
  @IsEnum(['ADMIN', 'GESTOR'], {
    message: 'El rol debe ser ADMIN o GESTOR',
  })
  rol: 'ADMIN' | 'GESTOR';

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el usuario se encuentra habilitado para iniciar sesión',
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un booleano' })
  activo?: boolean;
}
