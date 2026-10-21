var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested, } from 'class-validator';
import { Type, Transform } from 'class-transformer';
export class CoordenadasDto {
    lat;
    lng;
}
__decorate([
    ApiProperty({ example: 10.4806, description: 'Latitud (-90 a 90)' }),
    IsNumber(),
    Min(-90),
    Max(90),
    __metadata("design:type", Number)
], CoordenadasDto.prototype, "lat", void 0);
__decorate([
    ApiProperty({ example: -66.9036, description: 'Longitud (-180 a 180)' }),
    IsNumber(),
    Min(-180),
    Max(180),
    __metadata("design:type", Number)
], CoordenadasDto.prototype, "lng", void 0);
export class CreatePuntoFrecuenteDto {
    nombre;
    direccion;
    coordenadas;
    descripcion;
}
__decorate([
    ApiProperty({
        example: 'Planta Industrial Norte',
        description: 'Nombre del punto frecuente (único)',
    }),
    IsString(),
    IsNotEmpty({ message: 'El nombre es requerido' }),
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreatePuntoFrecuenteDto.prototype, "nombre", void 0);
__decorate([
    ApiProperty({
        example: 'Zona Industrial Los Galpones, Calle 4, Caracas',
        description: 'Dirección completa del punto frecuente',
    }),
    IsString(),
    IsNotEmpty({ message: 'La dirección es requerida' }),
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreatePuntoFrecuenteDto.prototype, "direccion", void 0);
__decorate([
    ApiProperty({
        type: CoordenadasDto,
        description: 'Coordenadas geográficas { lat, lng }',
    }),
    ValidateNested(),
    Type(() => CoordenadasDto),
    __metadata("design:type", CoordenadasDto)
], CreatePuntoFrecuenteDto.prototype, "coordenadas", void 0);
__decorate([
    ApiPropertyOptional({
        example: 'Entrada por el portón este',
        description: 'Descripción o notas de referencia',
    }),
    IsOptional(),
    IsString(),
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreatePuntoFrecuenteDto.prototype, "descripcion", void 0);
//# sourceMappingURL=create-punto-frecuente.dto.js.map