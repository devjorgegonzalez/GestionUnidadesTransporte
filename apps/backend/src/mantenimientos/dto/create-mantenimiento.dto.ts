import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemTareaDto {
  @ApiPropertyOptional({ example: 'CAMBIO_ACEITE' })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiProperty({ example: 'Cambio de aceite y filtro de motor' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  seleccionada: boolean;
}

export class CreateMantenimientoDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'ID de la Unidad de Transporte',
  })
  @IsMongoId({ message: 'El ID de la UT debe ser un ObjectId válido' })
  @IsNotEmpty({ message: 'La unidad de transporte es requerida' })
  utId: string;

  @ApiProperty({
    type: [ItemTareaDto],
    description: 'Tareas seleccionadas del checklist base',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemTareaDto)
  tareasChecklist: ItemTareaDto[];

  @ApiPropertyOptional({
    type: [ItemTareaDto],
    description: 'Tareas manuales adicionales agregadas al mantenimiento',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemTareaDto)
  tareasManuales?: ItemTareaDto[];
}
