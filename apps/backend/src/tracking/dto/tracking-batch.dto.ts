import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PuntoGpsDto {
  @ApiProperty({ example: 10.4901, description: 'Latitud capturada' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: -66.8202, description: 'Longitud capturada' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiProperty({ example: 45.5, description: 'Velocidad instantánea en km/h' })
  @IsNumber()
  @Min(0)
  velocidadKmh: number;

  @ApiPropertyOptional({ example: 8.5, description: 'Precisión del GPS en metros' })
  @IsOptional()
  @IsNumber()
  precisionMetros?: number;

  @ApiProperty({
    example: '2026-10-21T09:15:30.000Z',
    description: 'Timestamp de captura en el móvil (ISO 8601)',
  })
  @IsDateString()
  @IsNotEmpty()
  capturadoEn: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID único del punto generado en el móvil para idempotencia',
  })
  @IsString()
  @IsNotEmpty()
  idPuntoCliente: string;
}

export class TrackingBatchDto {
  @ApiProperty({
    type: [PuntoGpsDto],
    description: 'Lote de puntos GPS acumulados por la app móvil',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PuntoGpsDto)
  puntos: PuntoGpsDto[];
}
