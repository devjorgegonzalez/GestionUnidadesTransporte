var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export var TipoUnidadTransporte;
(function (TipoUnidadTransporte) {
    TipoUnidadTransporte["CAMION"] = "CAMION";
    TipoUnidadTransporte["SEDAN"] = "SEDAN";
    TipoUnidadTransporte["CAMIONETA_SUV"] = "CAMIONETA_SUV";
    TipoUnidadTransporte["CAMIONETA_PICKUP"] = "CAMIONETA_PICKUP";
    TipoUnidadTransporte["VAN"] = "VAN";
    TipoUnidadTransporte["MOTO"] = "MOTO";
})(TipoUnidadTransporte || (TipoUnidadTransporte = {}));
export var EstadoUnidadTransporte;
(function (EstadoUnidadTransporte) {
    EstadoUnidadTransporte["DISPONIBLE"] = "DISPONIBLE";
    EstadoUnidadTransporte["VIAJANDO"] = "VIAJANDO";
    EstadoUnidadTransporte["EN_MANTENIMIENTO"] = "EN_MANTENIMIENTO";
    EstadoUnidadTransporte["INACTIVA"] = "INACTIVA";
})(EstadoUnidadTransporte || (EstadoUnidadTransporte = {}));
let UnidadTransporte = class UnidadTransporte {
    placa;
    marca;
    modelo;
    anio;
    tipo;
    capacidadPersonas;
    kilometraje;
    estado;
};
__decorate([
    Prop({ required: true, unique: true, uppercase: true, trim: true }),
    __metadata("design:type", String)
], UnidadTransporte.prototype, "placa", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], UnidadTransporte.prototype, "marca", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], UnidadTransporte.prototype, "modelo", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Number)
], UnidadTransporte.prototype, "anio", void 0);
__decorate([
    Prop({ required: true, enum: Object.values(TipoUnidadTransporte) }),
    __metadata("design:type", String)
], UnidadTransporte.prototype, "tipo", void 0);
__decorate([
    Prop({ required: true, min: 1 }),
    __metadata("design:type", Number)
], UnidadTransporte.prototype, "capacidadPersonas", void 0);
__decorate([
    Prop({ required: true, default: 0, min: 0 }),
    __metadata("design:type", Number)
], UnidadTransporte.prototype, "kilometraje", void 0);
__decorate([
    Prop({
        required: true,
        enum: Object.values(EstadoUnidadTransporte),
        default: EstadoUnidadTransporte.DISPONIBLE,
    }),
    __metadata("design:type", String)
], UnidadTransporte.prototype, "estado", void 0);
UnidadTransporte = __decorate([
    Schema({ collection: 'unidades_transporte', timestamps: true })
], UnidadTransporte);
export { UnidadTransporte };
export const UnidadTransporteSchema = SchemaFactory.createForClass(UnidadTransporte);
UnidadTransporteSchema.index({ estado: 1 });
//# sourceMappingURL=unidad-transporte.schema.js.map