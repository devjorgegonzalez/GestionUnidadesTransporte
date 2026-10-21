var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUnidadTransporteDto } from './create-unidad-transporte.dto.js';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoUnidadTransporte } from '../../database/schemas/unidad-transporte.schema.js';
export class UpdateUnidadTransporteDto extends PartialType(CreateUnidadTransporteDto) {
    estado;
}
__decorate([
    ApiPropertyOptional({
        enum: EstadoUnidadTransporte,
        description: 'Nuevo estado de la UT (no permitido si la UT está VIAJANDO o EN_MANTENIMIENTO)',
    }),
    IsOptional(),
    IsEnum(EstadoUnidadTransporte, {
        message: `El estado debe ser uno de: ${Object.values(EstadoUnidadTransporte).join(', ')}`,
    }),
    __metadata("design:type", String)
], UpdateUnidadTransporteDto.prototype, "estado", void 0);
//# sourceMappingURL=update-unidad-transporte.dto.js.map