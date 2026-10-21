import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioAdminDocument = UsuarioAdmin & Document;

@Schema({ collection: 'usuarios_admin', timestamps: true })
export class UsuarioAdmin {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, default: 'ADMIN' })
  rol: string;

  @Prop({ required: true, default: true })
  activo: boolean;
}

export const UsuarioAdminSchema = SchemaFactory.createForClass(UsuarioAdmin);
