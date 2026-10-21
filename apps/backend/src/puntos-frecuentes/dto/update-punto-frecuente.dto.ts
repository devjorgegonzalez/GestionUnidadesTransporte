import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePuntoFrecuenteDto } from './create-punto-frecuente.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePuntoFrecuenteDto extends PartialType(
  CreatePuntoFrecuenteDto,
) {
  @ApiPropertyOptional({ example: true, description: 'Estado activo/inactivo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
