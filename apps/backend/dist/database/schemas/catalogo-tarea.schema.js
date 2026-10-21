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
let CatalogoTareaMantenimiento = class CatalogoTareaMantenimiento {
    codigo;
    nombre;
    orden;
    activo;
};
__decorate([
    Prop({ required: true, unique: true, uppercase: true, trim: true }),
    __metadata("design:type", String)
], CatalogoTareaMantenimiento.prototype, "codigo", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], CatalogoTareaMantenimiento.prototype, "nombre", void 0);
__decorate([
    Prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CatalogoTareaMantenimiento.prototype, "orden", void 0);
__decorate([
    Prop({ required: true, default: true }),
    __metadata("design:type", Boolean)
], CatalogoTareaMantenimiento.prototype, "activo", void 0);
CatalogoTareaMantenimiento = __decorate([
    Schema({ collection: 'catalogo_tareas_mantenimiento', timestamps: true })
], CatalogoTareaMantenimiento);
export { CatalogoTareaMantenimiento };
export const CatalogoTareaMantenimientoSchema = SchemaFactory.createForClass(CatalogoTareaMantenimiento);
//# sourceMappingURL=catalogo-tarea.schema.js.map