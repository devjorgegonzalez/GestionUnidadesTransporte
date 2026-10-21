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
let CoordenadasPunto = class CoordenadasPunto {
    lat;
    lng;
};
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Number)
], CoordenadasPunto.prototype, "lat", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Number)
], CoordenadasPunto.prototype, "lng", void 0);
CoordenadasPunto = __decorate([
    Schema({ _id: false })
], CoordenadasPunto);
export { CoordenadasPunto };
export const CoordenadasPuntoSchema = SchemaFactory.createForClass(CoordenadasPunto);
let PuntoFrecuente = class PuntoFrecuente {
    nombre;
    direccion;
    coordenadas;
    descripcion;
    activo;
};
__decorate([
    Prop({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], PuntoFrecuente.prototype, "nombre", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], PuntoFrecuente.prototype, "direccion", void 0);
__decorate([
    Prop({ type: CoordenadasPuntoSchema, required: true }),
    __metadata("design:type", CoordenadasPunto)
], PuntoFrecuente.prototype, "coordenadas", void 0);
__decorate([
    Prop({ trim: true }),
    __metadata("design:type", String)
], PuntoFrecuente.prototype, "descripcion", void 0);
__decorate([
    Prop({ required: true, default: true }),
    __metadata("design:type", Boolean)
], PuntoFrecuente.prototype, "activo", void 0);
PuntoFrecuente = __decorate([
    Schema({ collection: 'puntos_frecuentes', timestamps: true })
], PuntoFrecuente);
export { PuntoFrecuente };
export const PuntoFrecuenteSchema = SchemaFactory.createForClass(PuntoFrecuente);
PuntoFrecuenteSchema.index({ activo: 1 });
//# sourceMappingURL=punto-frecuente.schema.js.map