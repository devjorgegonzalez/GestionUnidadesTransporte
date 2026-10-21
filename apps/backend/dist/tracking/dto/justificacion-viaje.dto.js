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
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
export class JustificacionViajeDto {
    justificacionExcesoKm;
}
__decorate([
    ApiProperty({
        example: 'Desvío por cierre de vía principal y trabajos de asfaltado en el distribuidor.',
        description: 'Justificación del exceso de kilometraje registrado por el administrador',
    }),
    IsString(),
    IsNotEmpty({ message: 'La justificación es requerida' }),
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], JustificacionViajeDto.prototype, "justificacionExcesoKm", void 0);
//# sourceMappingURL=justificacion-viaje.dto.js.map