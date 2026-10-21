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
export class ConductorLoginDto {
    cedula;
    placa;
}
__decorate([
    ApiProperty({
        example: '12345678',
        description: 'Cédula de identidad del conductor',
    }),
    IsString({ message: 'La cédula debe ser una cadena de texto' }),
    IsNotEmpty({ message: 'La cédula es requerida' }),
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], ConductorLoginDto.prototype, "cedula", void 0);
__decorate([
    ApiProperty({
        example: 'ABC-123',
        description: 'Placa de la Unidad de Transporte asignada',
    }),
    IsString({ message: 'La placa debe ser una cadena de texto' }),
    IsNotEmpty({ message: 'La placa es requerida' }),
    Transform(({ value }) => typeof value === 'string' ? value.toUpperCase().trim() : value),
    __metadata("design:type", String)
], ConductorLoginDto.prototype, "placa", void 0);
//# sourceMappingURL=conductor-login.dto.js.map