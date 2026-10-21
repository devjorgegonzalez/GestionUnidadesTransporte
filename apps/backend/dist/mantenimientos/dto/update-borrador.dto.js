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
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemTareaDto } from './create-mantenimiento.dto.js';
export class UpdateBorradorMantenimientoDto {
    tareasChecklist;
    tareasManuales;
}
__decorate([
    ApiPropertyOptional({ type: [ItemTareaDto] }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => ItemTareaDto),
    __metadata("design:type", Array)
], UpdateBorradorMantenimientoDto.prototype, "tareasChecklist", void 0);
__decorate([
    ApiPropertyOptional({ type: [ItemTareaDto] }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => ItemTareaDto),
    __metadata("design:type", Array)
], UpdateBorradorMantenimientoDto.prototype, "tareasManuales", void 0);
//# sourceMappingURL=update-borrador.dto.js.map