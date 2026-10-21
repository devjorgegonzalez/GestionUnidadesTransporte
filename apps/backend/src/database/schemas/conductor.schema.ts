import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConductorDocument = Conductor & Document;

@Schema({ collection: 'conductores', timestamps: true })
export class Conductor {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  apellido: string;

  @Prop({ required: true, unique: true, trim: true })
  cedula: string;

  @Prop({ required: true, trim: true })
  telefono: string;

  @Prop({ required: true, default: true })
  activo: boolean;
}

export const ConductorSchema = SchemaFactory.createForClass(Conductor);
ConductorSchema.index({ apellido: 1, nombre: 1 });
