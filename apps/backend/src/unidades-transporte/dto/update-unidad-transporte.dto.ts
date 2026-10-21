import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUnidadTransporteDto } from './create-unidad-transporte.dto.js';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoUnidadTransporte } from '../../database/schemas/unidad-transporte.schema.js';

export class UpdateUnidadTransporteDto extends PartialType(
  CreateUnidadTransporteDto,
) {
  @ApiPropertyOptional({
    enum: EstadoUnidadTransporte,
    description:
      'Nuevo estado de la UT (no permitido si la UT está VIAJANDO o EN_MANTENIMIENTO)',
  })
  @IsOptional()
  @IsEnum(EstadoUnidadTransporte, {
    message: `El estado debe ser uno de: ${Object.values(EstadoUnidadTransporte).join(', ')}`,
  })
  estado?: EstadoUnidadTransporte;
}
