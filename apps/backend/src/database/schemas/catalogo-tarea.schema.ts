import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatalogoTareaMantenimientoDocument = CatalogoTareaMantenimiento &
  Document;

@Schema({ collection: 'catalogo_tareas_mantenimiento', timestamps: true })
export class CatalogoTareaMantenimiento {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  codigo: string;

  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, default: 0 })
  orden: number;

  @Prop({ required: true, default: true })
  activo: boolean;
}

export const CatalogoTareaMantenimientoSchema =
  SchemaFactory.createForClass(CatalogoTareaMantenimiento);
