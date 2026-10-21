import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoReservaViaje } from '../../database/schemas/reserva-viaje.schema.js';

export class QueryReservasViajesDto {
  @ApiPropertyOptional({ enum: EstadoReservaViaje })
  @IsOptional()
  @IsEnum(EstadoReservaViaje)
  estado?: EstadoReservaViaje;

  @ApiPropertyOptional({ description: 'Placa de la UT' })
  @IsOptional()
  @IsString()
  placaUt?: string;

  @ApiPropertyOptional({ description: 'Cédula del conductor' })
  @IsOptional()
  @IsString()
  cedulaConductor?: string;

  @ApiPropertyOptional({ description: 'Fecha desde (ISO-8601)' })
  @IsOptional()
  @IsString()
  fechaDesde?: string;

  @ApiPropertyOptional({ description: 'Fecha hasta (ISO-8601)' })
  @IsOptional()
  @IsString()
  fechaHasta?: string;

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
