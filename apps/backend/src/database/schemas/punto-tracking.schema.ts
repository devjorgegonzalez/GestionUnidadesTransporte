import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PuntoTrackingViajeDocument = PuntoTrackingViaje & Document;

@Schema({ collection: 'puntos_tracking_viajes', timestamps: true })
export class PuntoTrackingViaje {
  @Prop({ type: Types.ObjectId, ref: 'ReservaViaje', required: true })
  viajeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UnidadTransporte', required: true })
  utId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conductor', required: true })
  conductorId: Types.ObjectId;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;

  @Prop({ required: true, min: 0 })
  velocidadKmh: number;

  @Prop()
  precisionMetros?: number;

  @Prop({ required: true })
  capturadoEn: Date;

  @Prop({ required: true, unique: true })
  idPuntoCliente: string;
}

export const PuntoTrackingViajeSchema =
  SchemaFactory.createForClass(PuntoTrackingViaje);

PuntoTrackingViajeSchema.index({ viajeId: 1, capturadoEn: 1 });
