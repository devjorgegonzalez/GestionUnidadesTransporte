import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnidadTransporteDocument = UnidadTransporte & Document;

export enum TipoUnidadTransporte {
  CAMION = 'CAMION',
  SEDAN = 'SEDAN',
  CAMIONETA_SUV = 'CAMIONETA_SUV',
  CAMIONETA_PICKUP = 'CAMIONETA_PICKUP',
  VAN = 'VAN',
  MOTO = 'MOTO',
}

export enum EstadoUnidadTransporte {
  DISPONIBLE = 'DISPONIBLE',
  VIAJANDO = 'VIAJANDO',
  EN_MANTENIMIENTO = 'EN_MANTENIMIENTO',
  INACTIVA = 'INACTIVA',
}

@Schema({ collection: 'unidades_transporte', timestamps: true })
export class UnidadTransporte {
  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 7,
    maxlength: 7,
    match: /^[A-Z0-9]{7}$/,
  })
  placa: string;

  @Prop({ required: true, trim: true })
  marca: string;

  @Prop({ required: true, trim: true })
  modelo: string;

  @Prop({ required: true })
  anio: number;

  @Prop({ required: true, enum: Object.values(TipoUnidadTransporte) })
  tipo: TipoUnidadTransporte;

  @Prop({ required: true, min: 1 })
  capacidadPersonas: number;

  @Prop({ required: true, default: 0, min: 0 })
  kilometraje: number;

  @Prop({
    required: true,
    enum: Object.values(EstadoUnidadTransporte),
    default: EstadoUnidadTransporte.DISPONIBLE,
  })
  estado: EstadoUnidadTransporte;
}

export const UnidadTransporteSchema =
  SchemaFactory.createForClass(UnidadTransporte);
UnidadTransporteSchema.index({ estado: 1 });
