import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class JustificacionViajeDto {
  @ApiProperty({
    example: 'Desvío por cierre de vía principal y trabajos de asfaltado en el distribuidor.',
    description: 'Justificación del exceso de kilometraje registrado por el administrador',
  })
  @IsString()
  @IsNotEmpty({ message: 'La justificación es requerida' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  justificacionExcesoKm: string;
}
