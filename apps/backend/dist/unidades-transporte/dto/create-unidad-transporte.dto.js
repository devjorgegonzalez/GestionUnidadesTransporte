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
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoUnidadTransporte, EstadoUnidadTransporte, } from '../../database/schemas/unidad-transporte.schema.js';
export class CreateUnidadTransporteDto {
    placa;
    marca;
    modelo;
    anio;
    tipo;
    capacidadPersonas;
    kilometraje;
    estado;
}
__decorate([
    ApiProperty({ example: 'ABC-123', description: 'Placa del vehículo' }),
    IsString({ message: 'La placa debe ser una cadena de texto' }),
    IsNotEmpty({ message: 'La placa es requerida' }),
    Transform(({ value }) => typeof value === 'string' ? value.toUpperCase().trim() : value),
    __metadata("design:type", String)
], CreateUnidadTransporteDto.prototype, "placa", void 0);
__decorate([
    ApiProperty({ example: 'Toyota', description: 'Marca del vehículo' }),
    IsString(),
    IsNotEmpty({ message: 'La marca es requerida' }),
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateUnidadTransporteDto.prototype, "marca", void 0);
__decorate([
    ApiProperty({ example: 'Hilux', description: 'Modelo del vehículo' }),
    IsString(),
    IsNotEmpty({ message: 'El modelo es requerido' }),
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateUnidadTransporteDto.prototype, "modelo", void 0);
__decorate([
    ApiProperty({ example: 2023, description: 'Año de fabricación' }),
    IsInt({ message: 'El año debe ser un número entero' }),
    Min(1990, { message: 'El año no puede ser anterior a 1990' }),
    Max(new Date().getFullYear() + 1, {
        message: 'El año no puede ser mayor al año siguiente',
    }),
    __metadata("design:type", Number)
], CreateUnidadTransporteDto.prototype, "anio", void 0);
__decorate([
    ApiProperty({
        enum: TipoUnidadTransporte,
        example: TipoUnidadTransporte.CAMIONETA_PICKUP,
        description: 'Tipo de vehículo',
    }),
    IsEnum(TipoUnidadTransporte, {
        message: `El tipo debe ser uno de: ${Object.values(TipoUnidadTransporte).join(', ')}`,
    }),
    __metadata("design:type", String)
], CreateUnidadTransporteDto.prototype, "tipo", void 0);
__decorate([
    ApiProperty({ example: 5, description: 'Capacidad de pasajeros' }),
    IsInt({ message: 'La capacidad debe ser un número entero' }),
    Min(1, { message: 'La capacidad debe ser al menos 1 persona' }),
    __metadata("design:type", Number)
], CreateUnidadTransporteDto.prototype, "capacidadPersonas", void 0);
__decorate([
    ApiPropertyOptional({
        example: 15400.5,
        description: 'Kilometraje inicial acumulado',
    }),
    IsOptional(),
    IsNumber({}, { message: 'El kilometraje debe ser un número' }),
    Min(0, { message: 'El kilometraje no puede ser negativo' }),
    __metadata("design:type", Number)
], CreateUnidadTransporteDto.prototype, "kilometraje", void 0);
__decorate([
    ApiPropertyOptional({
        enum: [EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA],
        example: EstadoUnidadTransporte.DISPONIBLE,
        description: 'Estado inicial permitido al crear: DISPONIBLE o INACTIVA',
    }),
    IsOptional(),
    IsEnum([EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA], {
        message: 'Al crear manualmente una UT solo puede iniciar como DISPONIBLE o INACTIVA',
    }),
    __metadata("design:type", String)
], CreateUnidadTransporteDto.prototype, "estado", void 0);
//# sourceMappingURL=create-unidad-transporte.dto.js.map