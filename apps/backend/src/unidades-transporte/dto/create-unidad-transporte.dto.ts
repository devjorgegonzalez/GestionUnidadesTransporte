import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  TipoUnidadTransporte,
  EstadoUnidadTransporte,
} from '../../database/schemas/unidad-transporte.schema.js';

export class CreateUnidadTransporteDto {
  @ApiProperty({
    example: 'ABC1001',
    description:
      'Placa del vehículo (exactamente 7 caracteres alfanuméricos en mayúsculas, sin guiones ni espacios)',
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

  @ApiProperty({ example: 'Toyota', description: 'Marca del vehículo' })
  @IsString()
  @IsNotEmpty({ message: 'La marca es requerida' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  marca: string;

  @ApiProperty({ example: 'Hilux', description: 'Modelo del vehículo' })
  @IsString()
  @IsNotEmpty({ message: 'El modelo es requerido' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  modelo: string;

  @ApiProperty({ example: 2023, description: 'Año de fabricación' })
  @IsInt({ message: 'El año debe ser un número entero' })
  @Min(1990, { message: 'El año no puede ser anterior a 1990' })
  @Max(new Date().getFullYear() + 1, {
    message: 'El año no puede ser mayor al año siguiente',
  })
  anio: number;

  @ApiProperty({
    enum: TipoUnidadTransporte,
    example: TipoUnidadTransporte.CAMIONETA_PICKUP,
    description: 'Tipo de vehículo',
  })
  @IsEnum(TipoUnidadTransporte, {
    message: `El tipo debe ser uno de: ${Object.values(TipoUnidadTransporte).join(', ')}`,
  })
  tipo: TipoUnidadTransporte;

  @ApiProperty({ example: 5, description: 'Capacidad de pasajeros' })
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @Min(1, { message: 'La capacidad debe ser al menos 1 persona' })
  capacidadPersonas: number;

  @ApiPropertyOptional({
    example: 15400.5,
    description: 'Kilometraje inicial acumulado',
  })
  @IsOptional()
  @IsNumber({}, { message: 'El kilometraje debe ser un número' })
  @Min(0, { message: 'El kilometraje no puede ser negativo' })
  kilometraje?: number;

  @ApiPropertyOptional({
    enum: [EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA],
    example: EstadoUnidadTransporte.DISPONIBLE,
    description: 'Estado inicial permitido al crear: DISPONIBLE o INACTIVA',
  })
  @IsOptional()
  @IsEnum([EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA], {
    message:
      'Al crear manualmente una UT solo puede iniciar como DISPONIBLE o INACTIVA',
  })
  estado?: EstadoUnidadTransporte;
}
