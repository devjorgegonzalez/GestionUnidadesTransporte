import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoUnidadTransporte } from '../../database/schemas/unidad-transporte.schema.js';

export class FinalizarMantenimientoDto {
  @ApiProperty({
    example: 'Se realizó cambio de aceite 20W-50 y se reemplazaron pastillas de freno delanteras.',
    description: 'Observaciones y diagnóstico del personal técnico de mantenimiento',
  })
  @IsString({ message: 'Las observaciones deben ser texto' })
  @IsNotEmpty({ message: 'Las observaciones del personal son requeridas al finalizar' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  observacionesPersonal: string;

  @ApiProperty({
    enum: [EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA],
    example: EstadoUnidadTransporte.DISPONIBLE,
    description: 'Estado operativo en el cual quedará la UT (DISPONIBLE o INACTIVA)',
  })
  @IsEnum([EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA], {
    message: 'El estado final de la UT debe ser DISPONIBLE o INACTIVA',
  })
  estadoFinalUt: EstadoUnidadTransporte;
}
