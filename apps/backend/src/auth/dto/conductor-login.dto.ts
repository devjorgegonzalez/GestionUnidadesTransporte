import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class ConductorLoginDto {
  @ApiProperty({
    example: '12345678',
    description: 'Cédula de identidad del conductor',
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La cédula es requerida' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  cedula: string;

  @ApiProperty({
    example: 'ABC1001',
    description:
      'Placa de la Unidad de Transporte asignada (exactamente 7 caracteres alfanuméricos en mayúsculas)',
  })
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La placa es requerida' })
  @Matches(/^[A-Z0-9]{7}$/, {
    message:
      'La placa debe tener exactamente 7 caracteres alfanuméricos en mayúsculas (sin espacios ni guiones, ej. ABC1001)',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? value.toUpperCase().trim().replace(/[\s-]/g, '')
      : value,
  )
  placa: string;
}
