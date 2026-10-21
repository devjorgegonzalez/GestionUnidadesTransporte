import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryHistorialViajesDto {
  @ApiPropertyOptional({ description: 'Placa de la UT' })
  @IsOptional()
  @IsString()
  placa?: string;

  @ApiPropertyOptional({ description: 'Cédula o nombre del conductor' })
  @IsOptional()
  @IsString()
  conductor?: string;

  @ApiPropertyOptional({ description: 'Fecha desde (ISO-8601)' })
  @IsOptional()
  @IsString()
  fechaDesde?: string;

  @ApiPropertyOptional({ description: 'Fecha hasta (ISO-8601)' })
  @IsOptional()
  @IsString()
  fechaHasta?: string;

  @ApiPropertyOptional({
    description: 'Filtrar exclusivamente viajes con desviación de kilometraje (>10%)',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  soloConExcesoKm?: boolean;

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
