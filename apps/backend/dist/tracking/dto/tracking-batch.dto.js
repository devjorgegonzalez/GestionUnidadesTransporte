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
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
export class PuntoGpsDto {
    lat;
    lng;
    velocidadKmh;
    precisionMetros;
    capturadoEn;
    idPuntoCliente;
}
__decorate([
    ApiProperty({ example: 10.4901, description: 'Latitud capturada' }),
    IsNumber(),
    Min(-90),
    Max(90),
    __metadata("design:type", Number)
], PuntoGpsDto.prototype, "lat", void 0);
__decorate([
    ApiProperty({ example: -66.8202, description: 'Longitud capturada' }),
    IsNumber(),
    Min(-180),
    Max(180),
    __metadata("design:type", Number)
], PuntoGpsDto.prototype, "lng", void 0);
__decorate([
    ApiProperty({ example: 45.5, description: 'Velocidad instantánea en km/h' }),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], PuntoGpsDto.prototype, "velocidadKmh", void 0);
__decorate([
    ApiPropertyOptional({ example: 8.5, description: 'Precisión del GPS en metros' }),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], PuntoGpsDto.prototype, "precisionMetros", void 0);
__decorate([
    ApiProperty({
        example: '2026-10-21T09:15:30.000Z',
        description: 'Timestamp de captura en el móvil (ISO 8601)',
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], PuntoGpsDto.prototype, "capturadoEn", void 0);
__decorate([
    ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID único del punto generado en el móvil para idempotencia',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], PuntoGpsDto.prototype, "idPuntoCliente", void 0);
export class TrackingBatchDto {
    puntos;
}
__decorate([
    ApiProperty({
        type: [PuntoGpsDto],
        description: 'Lote de puntos GPS acumulados por la app móvil',
    }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => PuntoGpsDto),
    __metadata("design:type", Array)
], TrackingBatchDto.prototype, "puntos", void 0);
//# sourceMappingURL=tracking-batch.dto.js.map