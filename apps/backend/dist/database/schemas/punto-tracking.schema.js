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
import { Types } from 'mongoose';
let PuntoTrackingViaje = class PuntoTrackingViaje {
    viajeId;
    utId;
    conductorId;
    lat;
    lng;
    velocidadKmh;
    precisionMetros;
    capturadoEn;
    idPuntoCliente;
};
__decorate([
    Prop({ type: Types.ObjectId, ref: 'ReservaViaje', required: true }),
    __metadata("design:type", Types.ObjectId)
], PuntoTrackingViaje.prototype, "viajeId", void 0);
__decorate([
    Prop({ type: Types.ObjectId, ref: 'UnidadTransporte', required: true }),
    __metadata("design:type", Types.ObjectId)
], PuntoTrackingViaje.prototype, "utId", void 0);
__decorate([
    Prop({ type: Types.ObjectId, ref: 'Conductor', required: true }),
    __metadata("design:type", Types.ObjectId)
], PuntoTrackingViaje.prototype, "conductorId", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Number)
], PuntoTrackingViaje.prototype, "lat", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Number)
], PuntoTrackingViaje.prototype, "lng", void 0);
__decorate([
    Prop({ required: true, min: 0 }),
    __metadata("design:type", Number)
], PuntoTrackingViaje.prototype, "velocidadKmh", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], PuntoTrackingViaje.prototype, "precisionMetros", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Date)
], PuntoTrackingViaje.prototype, "capturadoEn", void 0);
__decorate([
    Prop({ required: true, unique: true }),
    __metadata("design:type", String)
], PuntoTrackingViaje.prototype, "idPuntoCliente", void 0);
PuntoTrackingViaje = __decorate([
    Schema({ collection: 'puntos_tracking_viajes', timestamps: true })
], PuntoTrackingViaje);
export { PuntoTrackingViaje };
export const PuntoTrackingViajeSchema = SchemaFactory.createForClass(PuntoTrackingViaje);
PuntoTrackingViajeSchema.index({ viajeId: 1, capturadoEn: 1 });
//# sourceMappingURL=punto-tracking.schema.js.map