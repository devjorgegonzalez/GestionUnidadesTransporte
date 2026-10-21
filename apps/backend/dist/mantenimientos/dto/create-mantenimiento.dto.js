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
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
export class ItemTareaDto {
    codigo;
    nombre;
    seleccionada;
}
__decorate([
    ApiPropertyOptional({ example: 'CAMBIO_ACEITE' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ItemTareaDto.prototype, "codigo", void 0);
__decorate([
    ApiProperty({ example: 'Cambio de aceite y filtro de motor' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ItemTareaDto.prototype, "nombre", void 0);
__decorate([
    ApiProperty({ example: true }),
    IsBoolean(),
    __metadata("design:type", Boolean)
], ItemTareaDto.prototype, "seleccionada", void 0);
export class CreateMantenimientoDto {
    utId;
    tareasChecklist;
    tareasManuales;
}
__decorate([
    ApiProperty({
        example: '60d21b4667d0d8992e610c85',
        description: 'ID de la Unidad de Transporte',
    }),
    IsMongoId({ message: 'El ID de la UT debe ser un ObjectId válido' }),
    IsNotEmpty({ message: 'La unidad de transporte es requerida' }),
    __metadata("design:type", String)
], CreateMantenimientoDto.prototype, "utId", void 0);
__decorate([
    ApiProperty({
        type: [ItemTareaDto],
        description: 'Tareas seleccionadas del checklist base',
    }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => ItemTareaDto),
    __metadata("design:type", Array)
], CreateMantenimientoDto.prototype, "tareasChecklist", void 0);
__decorate([
    ApiPropertyOptional({
        type: [ItemTareaDto],
        description: 'Tareas manuales adicionales agregadas al mantenimiento',
    }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => ItemTareaDto),
    __metadata("design:type", Array)
], CreateMantenimientoDto.prototype, "tareasManuales", void 0);
//# sourceMappingURL=create-mantenimiento.dto.js.map