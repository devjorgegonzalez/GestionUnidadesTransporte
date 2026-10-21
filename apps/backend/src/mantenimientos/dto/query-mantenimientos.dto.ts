import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoMantenimiento } from '../../database/schemas/mantenimiento.schema.js';

export class QueryMantenimientosDto {
  @ApiPropertyOptional({ enum: EstadoMantenimiento })
  @IsOptional()
  @IsEnum(EstadoMantenimiento)
  estado?: EstadoMantenimiento;

  @ApiPropertyOptional({ description: 'ID de la UT' })
  @IsOptional()
  @IsString()
  utId?: string;

  @ApiPropertyOptional({ description: 'Placa de la UT' })
  @IsOptional()
  @IsString()
  placa?: string;

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
