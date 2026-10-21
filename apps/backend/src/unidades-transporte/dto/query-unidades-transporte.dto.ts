import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  EstadoUnidadTransporte,
  TipoUnidadTransporte,
} from '../../database/schemas/unidad-transporte.schema.js';

export class QueryUnidadesTransporteDto {
  @ApiPropertyOptional({
    description: 'Búsqueda por placa, marca o modelo',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: EstadoUnidadTransporte,
    description: 'Filtrar por estado operativo',
  })
  @IsOptional()
  @IsEnum(EstadoUnidadTransporte)
  estado?: EstadoUnidadTransporte;

  @ApiPropertyOptional({
    enum: TipoUnidadTransporte,
    description: 'Filtrar por tipo de UT',
  })
  @IsOptional()
  @IsEnum(TipoUnidadTransporte)
  tipo?: TipoUnidadTransporte;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
