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
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
export class UbicacionRutaDto {
    nombre;
    direccion;
    lat;
    lng;
    puntoFrecuenteId;
}
__decorate([
    ApiPropertyOptional({ example: 'Almacén Central' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UbicacionRutaDto.prototype, "nombre", void 0);
__decorate([
    ApiProperty({ example: 'Av. Francisco de Miranda, Caracas' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], UbicacionRutaDto.prototype, "direccion", void 0);
__decorate([
    ApiProperty({ example: 10.4901 }),
    IsNumber(),
    __metadata("design:type", Number)
], UbicacionRutaDto.prototype, "lat", void 0);
__decorate([
    ApiProperty({ example: -66.8202 }),
    IsNumber(),
    __metadata("design:type", Number)
], UbicacionRutaDto.prototype, "lng", void 0);
__decorate([
    ApiPropertyOptional({ example: '60d21b4667d0d8992e610c85' }),
    IsOptional(),
    IsMongoId(),
    __metadata("design:type", String)
], UbicacionRutaDto.prototype, "puntoFrecuenteId", void 0);
export class CreateReservaViajeDto {
    utId;
    conductorId;
    fechaHoraInicioProgramada;
    origen;
    destino;
    kmSugeridosGoogle;
    duracionSugeridaMinutos;
    polylineSugerida;
}
__decorate([
    ApiProperty({
        example: '60d21b4667d0d8992e610c85',
        description: 'ID de la Unidad de Transporte',
    }),
    IsMongoId(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateReservaViajeDto.prototype, "utId", void 0);
__decorate([
    ApiProperty({
        example: '60d21b4667d0d8992e610c86',
        description: 'ID del Conductor',
    }),
    IsMongoId(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateReservaViajeDto.prototype, "conductorId", void 0);
__decorate([
    ApiProperty({
        example: '2026-10-21T08:30:00.000Z',
        description: 'Fecha y hora programada de inicio del viaje',
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateReservaViajeDto.prototype, "fechaHoraInicioProgramada", void 0);
__decorate([
    ApiProperty({ type: UbicacionRutaDto, description: 'Punto de origen / salida' }),
    ValidateNested(),
    Type(() => UbicacionRutaDto),
    __metadata("design:type", UbicacionRutaDto)
], CreateReservaViajeDto.prototype, "origen", void 0);
__decorate([
    ApiProperty({ type: UbicacionRutaDto, description: 'Punto de destino / llegada' }),
    ValidateNested(),
    Type(() => UbicacionRutaDto),
    __metadata("design:type", UbicacionRutaDto)
], CreateReservaViajeDto.prototype, "destino", void 0);
__decorate([
    ApiProperty({
        example: 45.8,
        description: 'Kilometraje sugerido calculado por Google Maps (km)',
    }),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateReservaViajeDto.prototype, "kmSugeridosGoogle", void 0);
__decorate([
    ApiPropertyOptional({ example: 60, description: 'Duración estimada en minutos' }),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateReservaViajeDto.prototype, "duracionSugeridaMinutos", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Polilínea codificada de la ruta sugerida' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateReservaViajeDto.prototype, "polylineSugerida", void 0);
//# sourceMappingURL=create-reserva-viaje.dto.js.map