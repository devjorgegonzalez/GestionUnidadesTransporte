import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UbicacionRutaDto {
  @ApiPropertyOptional({ example: 'Almacén Central' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 'Av. Francisco de Miranda, Caracas' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ example: 10.4901 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: -66.8202 })
  @IsNumber()
  lng: number;

  @ApiPropertyOptional({ example: '60d21b4667d0d8992e610c85' })
  @IsOptional()
  @IsMongoId()
  puntoFrecuenteId?: string;
}

export class CreateReservaViajeDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'ID de la Unidad de Transporte',
  })
  @IsMongoId()
  @IsNotEmpty()
  utId: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c86',
    description: 'ID del Conductor',
  })
  @IsMongoId()
  @IsNotEmpty()
  conductorId: string;

  @ApiProperty({
    example: '2026-10-21T08:30:00.000Z',
    description: 'Fecha y hora programada de inicio del viaje',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaHoraInicioProgramada: string;

  @ApiProperty({ type: UbicacionRutaDto, description: 'Punto de origen / salida' })
  @ValidateNested()
  @Type(() => UbicacionRutaDto)
  origen: UbicacionRutaDto;

  @ApiProperty({ type: UbicacionRutaDto, description: 'Punto de destino / llegada' })
  @ValidateNested()
  @Type(() => UbicacionRutaDto)
  destino: UbicacionRutaDto;

  @ApiProperty({
    example: 45.8,
    description: 'Kilometraje sugerido calculado por Google Maps (km)',
  })
  @IsNumber()
  @Min(0)
  kmSugeridosGoogle: number;

  @ApiPropertyOptional({ example: 60, description: 'Duración estimada en minutos' })
  @IsOptional()
  @IsNumber()
  duracionSugeridaMinutos?: number;

  @ApiPropertyOptional({ description: 'Polilínea codificada de la ruta sugerida' })
  @IsOptional()
  @IsString()
  polylineSugerida?: string;
}
