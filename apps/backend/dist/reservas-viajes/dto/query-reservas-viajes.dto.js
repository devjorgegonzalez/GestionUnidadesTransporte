var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoReservaViaje } from '../../database/schemas/reserva-viaje.schema.js';
export class QueryReservasViajesDto {
    estado;
    placaUt;
    cedulaConductor;
    fechaDesde;
    fechaHasta;
    page = 1;
    limit = 10;
}
__decorate([
    ApiPropertyOptional({ enum: EstadoReservaViaje }),
    IsOptional(),
    IsEnum(EstadoReservaViaje),
    __metadata("design:type", String)
], QueryReservasViajesDto.prototype, "estado", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Placa de la UT' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryReservasViajesDto.prototype, "placaUt", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Cédula del conductor' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryReservasViajesDto.prototype, "cedulaConductor", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Fecha desde (ISO-8601)' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryReservasViajesDto.prototype, "fechaDesde", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Fecha hasta (ISO-8601)' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryReservasViajesDto.prototype, "fechaHasta", void 0);
__decorate([
    ApiPropertyOptional({ default: 1, minimum: 1 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QueryReservasViajesDto.prototype, "page", void 0);
__decorate([
    ApiPropertyOptional({ default: 10, minimum: 1 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QueryReservasViajesDto.prototype, "limit", void 0);
//# sourceMappingURL=query-reservas-viajes.dto.js.map