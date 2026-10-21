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
export var EstadoReservaViaje;
(function (EstadoReservaViaje) {
    EstadoReservaViaje["PROGRAMADA"] = "PROGRAMADA";
    EstadoReservaViaje["EN_CURSO"] = "EN_CURSO";
    EstadoReservaViaje["FINALIZADO"] = "FINALIZADO";
    EstadoReservaViaje["CANCELADA"] = "CANCELADA";
})(EstadoReservaViaje || (EstadoReservaViaje = {}));
let UbicacionRuta = class UbicacionRuta {
    nombre;
    direccion;
    lat;
    lng;
    puntoFrecuenteId;
};
__decorate([
    Prop({ trim: true }),
    __metadata("design:type", String)
], UbicacionRuta.prototype, "nombre", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], UbicacionRuta.prototype, "direccion", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Number)
], UbicacionRuta.prototype, "lat", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Number)
], UbicacionRuta.prototype, "lng", void 0);
__decorate([
    Prop({ type: Types.ObjectId, ref: 'PuntoFrecuente', required: false }),
    __metadata("design:type", Types.ObjectId)
], UbicacionRuta.prototype, "puntoFrecuenteId", void 0);
UbicacionRuta = __decorate([
    Schema({ _id: false })
], UbicacionRuta);
export { UbicacionRuta };
export const UbicacionRutaSchema = SchemaFactory.createForClass(UbicacionRuta);
let ReservaViaje = class ReservaViaje {
    utId;
    placaUt;
    conductorId;
    cedulaConductor;
    nombreConductor;
    fechaHoraInicioProgramada;
    origen;
    destino;
    kmSugeridosGoogle;
    duracionSugeridaMinutos;
    polylineSugerida;
    estado;
    kilometrajeUtInicial;
    kilometrajeUtFinal;
    kmRealesGps;
    porcentajeDesviacionKm;
    excedeUmbralKm;
    justificacionExcesoKm;
    fechaHoraInicioReal;
    fechaHoraFinReal;
};
__decorate([
    Prop({ type: Types.ObjectId, ref: 'UnidadTransporte', required: true }),
    __metadata("design:type", Types.ObjectId)
], ReservaViaje.prototype, "utId", void 0);
__decorate([
    Prop({ required: true, uppercase: true, trim: true }),
    __metadata("design:type", String)
], ReservaViaje.prototype, "placaUt", void 0);
__decorate([
    Prop({ type: Types.ObjectId, ref: 'Conductor', required: true }),
    __metadata("design:type", Types.ObjectId)
], ReservaViaje.prototype, "conductorId", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], ReservaViaje.prototype, "cedulaConductor", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], ReservaViaje.prototype, "nombreConductor", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Date)
], ReservaViaje.prototype, "fechaHoraInicioProgramada", void 0);
__decorate([
    Prop({ type: UbicacionRutaSchema, required: true }),
    __metadata("design:type", UbicacionRuta)
], ReservaViaje.prototype, "origen", void 0);
__decorate([
    Prop({ type: UbicacionRutaSchema, required: true }),
    __metadata("design:type", UbicacionRuta)
], ReservaViaje.prototype, "destino", void 0);
__decorate([
    Prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], ReservaViaje.prototype, "kmSugeridosGoogle", void 0);
__decorate([
    Prop({ default: 0 }),
    __metadata("design:type", Number)
], ReservaViaje.prototype, "duracionSugeridaMinutos", void 0);
__decorate([
    Prop({ default: '' }),
    __metadata("design:type", String)
], ReservaViaje.prototype, "polylineSugerida", void 0);
__decorate([
    Prop({
        required: true,
        enum: Object.values(EstadoReservaViaje),
        default: EstadoReservaViaje.PROGRAMADA,
    }),
    __metadata("design:type", String)
], ReservaViaje.prototype, "estado", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], ReservaViaje.prototype, "kilometrajeUtInicial", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], ReservaViaje.prototype, "kilometrajeUtFinal", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], ReservaViaje.prototype, "kmRealesGps", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], ReservaViaje.prototype, "porcentajeDesviacionKm", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], ReservaViaje.prototype, "excedeUmbralKm", void 0);
__decorate([
    Prop({ trim: true }),
    __metadata("design:type", String)
], ReservaViaje.prototype, "justificacionExcesoKm", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], ReservaViaje.prototype, "fechaHoraInicioReal", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], ReservaViaje.prototype, "fechaHoraFinReal", void 0);
ReservaViaje = __decorate([
    Schema({ collection: 'reservas_viajes', timestamps: true })
], ReservaViaje);
export { ReservaViaje };
export const ReservaViajeSchema = SchemaFactory.createForClass(ReservaViaje);
ReservaViajeSchema.index({
    cedulaConductor: 1,
    placaUt: 1,
    estado: 1,
    fechaHoraInicioProgramada: 1,
});
ReservaViajeSchema.index({ utId: 1, estado: 1 });
ReservaViajeSchema.index({ estado: 1, fechaHoraInicioProgramada: -1 });
//# sourceMappingURL=reserva-viaje.schema.js.map