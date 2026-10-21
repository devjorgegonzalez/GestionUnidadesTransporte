import { Model } from 'mongoose';
import { UnidadTransporteDocument } from '../database/schemas/unidad-transporte.schema.js';
import { ReservaViajeDocument, EstadoReservaViaje } from '../database/schemas/reserva-viaje.schema.js';
import { MantenimientoDocument } from '../database/schemas/mantenimiento.schema.js';
export declare class DashboardService {
    private readonly utModel;
    private readonly reservaModel;
    private readonly mantenimientoModel;
    constructor(utModel: Model<UnidadTransporteDocument>, reservaModel: Model<ReservaViajeDocument>, mantenimientoModel: Model<MantenimientoDocument>);
    getResumen(): Promise<{
        kpis: {
            disponibles: number;
            viajando: number;
            enMantenimiento: number;
            inactivas: number;
            total: number;
        };
        viajesHoy: {
            id: import("mongoose").Types.ObjectId;
            placaUt: string;
            conductor: string;
            estado: EstadoReservaViaje;
            origen: string;
            destino: string;
            hora: string;
        }[];
        alertasExcesoKm: {
            id: import("mongoose").Types.ObjectId;
            placaUt: string;
            conductor: string;
            kmSugeridos: number;
            kmReales: number;
            desviacion: number;
        }[];
        mantenimientosBorrador: {
            id: import("mongoose").Types.ObjectId;
            placaUt: string;
            fechaApertura: string;
            tareas: number;
        }[];
    }>;
}
