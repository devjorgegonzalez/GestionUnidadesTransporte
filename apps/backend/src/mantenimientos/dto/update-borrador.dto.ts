import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemTareaDto } from './create-mantenimiento.dto.js';

export class UpdateBorradorMantenimientoDto {
  @ApiPropertyOptional({ type: [ItemTareaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemTareaDto)
  tareasChecklist?: ItemTareaDto[];

  @ApiPropertyOptional({ type: [ItemTareaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemTareaDto)
  tareasManuales?: ItemTareaDto[];
}
