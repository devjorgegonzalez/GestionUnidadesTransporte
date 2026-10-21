import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PuntoGpsDto } from './tracking-batch.dto.js';

export class FinalizarViajeDto {
  @ApiPropertyOptional({
    type: [PuntoGpsDto],
    description: 'Último lote opcional de puntos GPS al finalizar el viaje',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PuntoGpsDto)
  puntos?: PuntoGpsDto[];
}
