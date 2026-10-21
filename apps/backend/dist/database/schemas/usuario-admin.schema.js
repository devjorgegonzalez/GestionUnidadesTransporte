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
let UsuarioAdmin = class UsuarioAdmin {
    nombre;
    email;
    passwordHash;
    rol;
    activo;
};
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], UsuarioAdmin.prototype, "nombre", void 0);
__decorate([
    Prop({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], UsuarioAdmin.prototype, "email", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], UsuarioAdmin.prototype, "passwordHash", void 0);
__decorate([
    Prop({ required: true, default: 'ADMIN' }),
    __metadata("design:type", String)
], UsuarioAdmin.prototype, "rol", void 0);
__decorate([
    Prop({ required: true, default: true }),
    __metadata("design:type", Boolean)
], UsuarioAdmin.prototype, "activo", void 0);
UsuarioAdmin = __decorate([
    Schema({ collection: 'usuarios_admin', timestamps: true })
], UsuarioAdmin);
export { UsuarioAdmin };
export const UsuarioAdminSchema = SchemaFactory.createForClass(UsuarioAdmin);
//# sourceMappingURL=usuario-admin.schema.js.map