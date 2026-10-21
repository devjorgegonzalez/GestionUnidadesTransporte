import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CoordenadasDto {
  @ApiProperty({ example: 10.4806, description: 'Latitud (-90 a 90)' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: -66.9036, description: 'Longitud (-180 a 180)' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}

export class CreatePuntoFrecuenteDto {
  @ApiProperty({
    example: 'Planta Industrial Norte',
    description: 'Nombre del punto frecuente (único)',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  nombre: string;

  @ApiProperty({
    example: 'Zona Industrial Los Galpones, Calle 4, Caracas',
    description: 'Dirección completa del punto frecuente',
  })
  @IsString()
  @IsNotEmpty({ message: 'La dirección es requerida' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  direccion: string;

  @ApiProperty({
    type: CoordenadasDto,
    description: 'Coordenadas geográficas { lat, lng }',
  })
  @ValidateNested()
  @Type(() => CoordenadasDto)
  coordenadas: CoordenadasDto;

  @ApiPropertyOptional({
    example: 'Entrada por el portón este',
    description: 'Descripción o notas de referencia',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  descripcion?: string;
}
