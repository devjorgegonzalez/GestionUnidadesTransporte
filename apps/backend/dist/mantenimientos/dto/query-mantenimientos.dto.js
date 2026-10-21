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
import { EstadoMantenimiento } from '../../database/schemas/mantenimiento.schema.js';
export class QueryMantenimientosDto {
    estado;
    utId;
    placa;
    page = 1;
    limit = 10;
}
__decorate([
    ApiPropertyOptional({ enum: EstadoMantenimiento }),
    IsOptional(),
    IsEnum(EstadoMantenimiento),
    __metadata("design:type", String)
], QueryMantenimientosDto.prototype, "estado", void 0);
__decorate([
    ApiPropertyOptional({ description: 'ID de la UT' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryMantenimientosDto.prototype, "utId", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Placa de la UT' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryMantenimientosDto.prototype, "placa", void 0);
__decorate([
    ApiPropertyOptional({ default: 1, minimum: 1 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QueryMantenimientosDto.prototype, "page", void 0);
__decorate([
    ApiPropertyOptional({ default: 10, minimum: 1 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QueryMantenimientosDto.prototype, "limit", void 0);
//# sourceMappingURL=query-mantenimientos.dto.js.map