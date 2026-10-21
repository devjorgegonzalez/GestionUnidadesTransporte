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
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class QueryPuntosFrecuentesDto {
    search;
    activo;
    page = 1;
    limit = 10;
}
__decorate([
    ApiPropertyOptional({
        description: 'Búsqueda por nombre o dirección',
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryPuntosFrecuentesDto.prototype, "search", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Filtrar por estado activo/inactivo',
    }),
    IsOptional(),
    Transform(({ value }) => {
        if (value === 'true' || value === true)
            return true;
        if (value === 'false' || value === false)
            return false;
        return value;
    }),
    IsBoolean(),
    __metadata("design:type", Boolean)
], QueryPuntosFrecuentesDto.prototype, "activo", void 0);
__decorate([
    ApiPropertyOptional({ default: 1, minimum: 1 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QueryPuntosFrecuentesDto.prototype, "page", void 0);
__decorate([
    ApiPropertyOptional({ default: 10, minimum: 1 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QueryPuntosFrecuentesDto.prototype, "limit", void 0);
//# sourceMappingURL=query-puntos-frecuentes.dto.js.map