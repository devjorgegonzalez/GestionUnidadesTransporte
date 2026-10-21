var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
export class AdminLoginDto {
    email;
    password;
}
__decorate([
    ApiProperty({
        example: 'admin@empresa.com',
        description: 'Correo electrónico del administrador',
    }),
    IsEmail({}, { message: 'El correo electrónico debe ser válido' }),
    IsNotEmpty({ message: 'El correo electrónico es requerido' }),
    Transform(({ value }) => typeof value === 'string' ? value.toLowerCase().trim() : value),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "email", void 0);
__decorate([
    ApiProperty({
        example: 'Admin123*',
        description: 'Contraseña del administrador',
    }),
    IsString({ message: 'La contraseña debe ser una cadena de texto' }),
    IsNotEmpty({ message: 'La contraseña es requerida' }),
    MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "password", void 0);
//# sourceMappingURL=admin-login.dto.js.map