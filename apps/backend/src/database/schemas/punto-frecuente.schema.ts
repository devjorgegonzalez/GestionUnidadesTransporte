import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PuntoFrecuenteDocument = PuntoFrecuente & Document;

@Schema({ _id: false })
export class CoordenadasPunto {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;
}
export const CoordenadasPuntoSchema =
  SchemaFactory.createForClass(CoordenadasPunto);

@Schema({ collection: 'puntos_frecuentes', timestamps: true })
export class PuntoFrecuente {
  @Prop({ required: true, unique: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  direccion: string;

  @Prop({ type: CoordenadasPuntoSchema, required: true })
  coordenadas: CoordenadasPunto;

  @Prop({ trim: true })
  descripcion?: string;

  @Prop({ required: true, default: true })
  activo: boolean;
}

export const PuntoFrecuenteSchema = SchemaFactory.createForClass(PuntoFrecuente);
PuntoFrecuenteSchema.index({ activo: 1 });
