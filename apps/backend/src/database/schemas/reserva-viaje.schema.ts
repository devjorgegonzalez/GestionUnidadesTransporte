import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservaViajeDocument = ReservaViaje & Document;

export enum EstadoReservaViaje {
  PROGRAMADA = 'PROGRAMADA',
  EN_CURSO = 'EN_CURSO',
  FINALIZADO = 'FINALIZADO',
  CANCELADA = 'CANCELADA',
}

@Schema({ _id: false })
export class UbicacionRuta {
  @Prop({ trim: true })
  nombre?: string;

  @Prop({ required: true, trim: true })
  direccion: string;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;

  @Prop({ type: Types.ObjectId, ref: 'PuntoFrecuente', required: false })
  puntoFrecuenteId?: Types.ObjectId;
}
export const UbicacionRutaSchema = SchemaFactory.createForClass(UbicacionRuta);

@Schema({ collection: 'reservas_viajes', timestamps: true })
export class ReservaViaje {
  @Prop({ type: Types.ObjectId, ref: 'UnidadTransporte', required: true })
  utId: Types.ObjectId;

  @Prop({ required: true, uppercase: true, trim: true })
  placaUt: string;

  @Prop({ type: Types.ObjectId, ref: 'Conductor', required: true })
  conductorId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  cedulaConductor: string;

  @Prop({ required: true, trim: true })
  nombreConductor: string;

  @Prop({ required: true })
  fechaHoraInicioProgramada: Date;

  @Prop({ type: UbicacionRutaSchema, required: true })
  origen: UbicacionRuta;

  @Prop({ type: UbicacionRutaSchema, required: true })
  destino: UbicacionRuta;

  @Prop({ required: true, default: 0 })
  kmSugeridosGoogle: number;

  @Prop({ default: 0 })
  duracionSugeridaMinutos: number;

  @Prop({ default: '' })
  polylineSugerida: string;

  @Prop({
    required: true,
    enum: Object.values(EstadoReservaViaje),
    default: EstadoReservaViaje.PROGRAMADA,
  })
  estado: EstadoReservaViaje;

  @Prop()
  kilometrajeUtInicial?: number;

  @Prop()
  kilometrajeUtFinal?: number;

  @Prop()
  kmRealesGps?: number;

  @Prop()
  porcentajeDesviacionKm?: number;

  @Prop({ default: false })
  excedeUmbralKm?: boolean;

  @Prop({ trim: true })
  justificacionExcesoKm?: string;

  @Prop()
  fechaHoraInicioReal?: Date;

  @Prop()
  fechaHoraFinReal?: Date;
}

export const ReservaViajeSchema = SchemaFactory.createForClass(ReservaViaje);
ReservaViajeSchema.index({
  cedulaConductor: 1,
  placaUt: 1,
  estado: 1,
  fechaHoraInicioProgramada: 1,
});
ReservaViajeSchema.index({ utId: 1, estado: 1 });
ReservaViajeSchema.index({ estado: 1, fechaHoraInicioProgramada: -1 });
