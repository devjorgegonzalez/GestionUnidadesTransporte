import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateConductorDto } from './create-conductor.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConductorDto extends PartialType(CreateConductorDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Estado operativo del conductor (activo/inactivo)',
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
