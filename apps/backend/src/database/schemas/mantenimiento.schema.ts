import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EstadoUnidadTransporte } from './unidad-transporte.schema.js';

export type MantenimientoDocument = Mantenimiento & Document;

export enum EstadoMantenimiento {
  BORRADOR = 'BORRADOR',
  FINALIZADO = 'FINALIZADO',
}

@Schema({ _id: false })
export class ItemTareaMantenimiento {
  @Prop({ trim: true })
  codigo?: string;

  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, default: true })
  seleccionada: boolean;

  @Prop({ required: true, default: false })
  esManual: boolean;
}
export const ItemTareaMantenimientoSchema = SchemaFactory.createForClass(
  ItemTareaMantenimiento,
);

@Schema({ collection: 'mantenimientos', timestamps: true })
export class Mantenimiento {
  @Prop({ type: Types.ObjectId, ref: 'UnidadTransporte', required: true })
  utId: Types.ObjectId;

  @Prop({ required: true, uppercase: true, trim: true })
  placaUt: string;

  @Prop({ required: true, min: 0 })
  kilometrajeRegistro: number;

  @Prop({
    required: true,
    enum: Object.values(EstadoMantenimiento),
    default: EstadoMantenimiento.BORRADOR,
  })
  estado: EstadoMantenimiento;

  @Prop({ type: [ItemTareaMantenimientoSchema], default: [] })
  tareasChecklist: ItemTareaMantenimiento[];

  @Prop({ type: [ItemTareaMantenimientoSchema], default: [] })
  tareasManuales: ItemTareaMantenimiento[];

  @Prop({ trim: true })
  observacionesPersonal?: string;

  @Prop({
    enum: [EstadoUnidadTransporte.DISPONIBLE, EstadoUnidadTransporte.INACTIVA],
    required: false,
  })
  estadoFinalUt?: EstadoUnidadTransporte;

  @Prop({ required: true, default: () => new Date() })
  fechaApertura: Date;

  @Prop()
  fechaCierre?: Date;
}

export const MantenimientoSchema = SchemaFactory.createForClass(Mantenimiento);
MantenimientoSchema.index({ utId: 1, estado: 1 });
MantenimientoSchema.index({ estado: 1, fechaApertura: -1 });
