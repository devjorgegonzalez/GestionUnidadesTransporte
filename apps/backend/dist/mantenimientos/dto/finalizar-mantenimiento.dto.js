var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoUnidadTransporte } from '../../database/schemas/unidad-transporte.schema.js';
export class FinalizarMantenimientoDto {
    observacionesPersonal;
    estadoFinalUt;
}
__decorate([
    ApiProperty({
        example: 'Se realizó cambio de aceite 20W-50 y se reemplazaron pastillas de freno delanteras.',
        description: 'Observaciones y diagnóstico del personal técnico de mantenimiento',
    }),
    IsString({ message: 'Las observaciones deben ser texto' }),
    IsNotEmpty({ message: 'Las observaciones del personal son requeridas al finalizar' }),
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], FinalizarMantenimientoDto.prototype, "observacionesPersonal", void 0);
__decorate([
    ApiProperty({
        enum: [EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA],
        example: EstadoUnidadTransporte.DISPONIBLE,
        description: 'Estado operativo en el cual quedará la UT (DISPONIBLE o INACTIVA)',
    }),
    IsEnum([EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA], {
        message: 'El estado final de la UT debe ser DISPONIBLE o INACTIVA',
    }),
    __metadata("design:type", String)
], FinalizarMantenimientoDto.prototype, "estadoFinalUt", void 0);
//# sourceMappingURL=finalizar-mantenimiento.dto.js.map