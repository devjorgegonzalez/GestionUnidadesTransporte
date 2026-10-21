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
import { EstadoUnidadTransporte } from './unidad-transporte.schema.js';
export var EstadoMantenimiento;
(function (EstadoMantenimiento) {
    EstadoMantenimiento["BORRADOR"] = "BORRADOR";
    EstadoMantenimiento["FINALIZADO"] = "FINALIZADO";
})(EstadoMantenimiento || (EstadoMantenimiento = {}));
let ItemTareaMantenimiento = class ItemTareaMantenimiento {
    codigo;
    nombre;
    seleccionada;
    esManual;
};
__decorate([
    Prop({ trim: true }),
    __metadata("design:type", String)
], ItemTareaMantenimiento.prototype, "codigo", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], ItemTareaMantenimiento.prototype, "nombre", void 0);
__decorate([
    Prop({ required: true, default: true }),
    __metadata("design:type", Boolean)
], ItemTareaMantenimiento.prototype, "seleccionada", void 0);
__decorate([
    Prop({ required: true, default: false }),
    __metadata("design:type", Boolean)
], ItemTareaMantenimiento.prototype, "esManual", void 0);
ItemTareaMantenimiento = __decorate([
    Schema({ _id: false })
], ItemTareaMantenimiento);
export { ItemTareaMantenimiento };
export const ItemTareaMantenimientoSchema = SchemaFactory.createForClass(ItemTareaMantenimiento);
let Mantenimiento = class Mantenimiento {
    utId;
    placaUt;
    kilometrajeRegistro;
    estado;
    tareasChecklist;
    tareasManuales;
    observacionesPersonal;
    estadoFinalUt;
    fechaApertura;
    fechaCierre;
};
__decorate([
    Prop({ type: Types.ObjectId, ref: 'UnidadTransporte', required: true }),
    __metadata("design:type", Types.ObjectId)
], Mantenimiento.prototype, "utId", void 0);
__decorate([
    Prop({ required: true, uppercase: true, trim: true }),
    __metadata("design:type", String)
], Mantenimiento.prototype, "placaUt", void 0);
__decorate([
    Prop({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Mantenimiento.prototype, "kilometrajeRegistro", void 0);
__decorate([
    Prop({
        required: true,
        enum: Object.values(EstadoMantenimiento),
        default: EstadoMantenimiento.BORRADOR,
    }),
    __metadata("design:type", String)
], Mantenimiento.prototype, "estado", void 0);
__decorate([
    Prop({ type: [ItemTareaMantenimientoSchema], default: [] }),
    __metadata("design:type", Array)
], Mantenimiento.prototype, "tareasChecklist", void 0);
__decorate([
    Prop({ type: [ItemTareaMantenimientoSchema], default: [] }),
    __metadata("design:type", Array)
], Mantenimiento.prototype, "tareasManuales", void 0);
__decorate([
    Prop({ trim: true }),
    __metadata("design:type", String)
], Mantenimiento.prototype, "observacionesPersonal", void 0);
__decorate([
    Prop({
        enum: [EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA],
        required: false,
    }),
    __metadata("design:type", String)
], Mantenimiento.prototype, "estadoFinalUt", void 0);
__decorate([
    Prop({ required: true, default: () => new Date() }),
    __metadata("design:type", Date)
], Mantenimiento.prototype, "fechaApertura", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Mantenimiento.prototype, "fechaCierre", void 0);
Mantenimiento = __decorate([
    Schema({ collection: 'mantenimientos', timestamps: true })
], Mantenimiento);
export { Mantenimiento };
export const MantenimientoSchema = SchemaFactory.createForClass(Mantenimiento);
MantenimientoSchema.index({ utId: 1, estado: 1 });
MantenimientoSchema.index({ estado: 1, fechaApertura: -1 });
//# sourceMappingURL=mantenimiento.schema.js.map