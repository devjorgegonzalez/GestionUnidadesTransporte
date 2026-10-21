import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateConductorDto {
  @ApiProperty({ example: 'Carlos', description: 'Nombre del conductor' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  nombre: string;

  @ApiProperty({ example: 'Rodríguez', description: 'Apellido del conductor' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  apellido: string;

  @ApiProperty({
    example: '18234567',
    description: 'Cédula de identidad (única en el sistema)',
  })
  @IsString()
  @IsNotEmpty({ message: 'La cédula es requerida' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  cedula: string;

  @ApiProperty({
    example: '+58 412 1234567',
    description: 'Número telefónico de contacto',
  })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  telefono: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo/inactivo del conductor',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
