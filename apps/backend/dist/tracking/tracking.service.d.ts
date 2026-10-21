import { Model, Types } from 'mongoose';
import { ReservaViaje, ReservaViajeDocument } from '../database/schemas/reserva-viaje.schema.js';
import { UnidadTransporte, UnidadTransporteDocument } from '../database/schemas/unidad-transporte.schema.js';
import { PuntoTrackingViajeDocument } from '../database/schemas/punto-tracking.schema.js';
import { TrackingBatchDto } from './dto/tracking-batch.dto.js';
import { FinalizarViajeDto } from './dto/finalizar-viaje.dto.js';
import { JustificacionViajeDto } from './dto/justificacion-viaje.dto.js';
import { QueryHistorialViajesDto } from './dto/query-historial-viajes.dto.js';
export declare class TrackingService {
    private readonly reservaModel;
    private readonly utModel;
    private readonly trackingModel;
    constructor(reservaModel: Model<ReservaViajeDocument>, utModel: Model<UnidadTransporteDocument>, trackingModel: Model<PuntoTrackingViajeDocument>);
    iniciarViaje(viajeId: string): Promise<{
        reserva: import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        ut: (import("mongoose").Document<unknown, {}, UnidadTransporteDocument, {}, import("mongoose").DefaultSchemaOptions> & UnidadTransporte & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    registrarBatch(viajeId: string, dto: TrackingBatchDto): Promise<{
        procesados: number;
    }>;
    finalizarViaje(viajeId: string, dto?: FinalizarViajeDto): Promise<{
        reserva: import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        ut: (import("mongoose").Document<unknown, {}, UnidadTransporteDocument, {}, import("mongoose").DefaultSchemaOptions> & UnidadTransporte & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
        kmRealesGps: number | undefined;
        excedeUmbralKm: boolean | undefined;
        porcentajeDesviacionKm: number | undefined;
    }>;
    getFlotaActiva(): Promise<{
        viajeId: Types.ObjectId;
        placaUt: string;
        conductor: string;
        telefonoConductor: any;
        origen: import("../database/schemas/reserva-viaje.schema.js").UbicacionRuta;
        destino: import("../database/schemas/reserva-viaje.schema.js").UbicacionRuta;
        kmSugeridosGoogle: number;
        polylineSugerida: string;
        distanciaRecorridaKm: number;
        ultimaUbicacion: {
            lat: number;
            lng: number;
            velocidadKmh: number;
            capturadoEn: Date;
        } | null;
        recorridoRuta: {
            lat: number;
            lng: number;
            velocidadKmh: number;
            capturadoEn: Date;
        }[];
    }[]>;
    getHistorialViajes(query: QueryHistorialViajesDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTrackingDetalle(viajeId: string): Promise<{
        viaje: import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        puntos: {
            id: Types.ObjectId;
            lat: number;
            lng: number;
            velocidadKmh: number;
            precisionMetros: number | undefined;
            capturadoEn: Date;
        }[];
    }>;
    guardarJustificacion(viajeId: string, dto: JustificacionViajeDto): Promise<import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getReservasHoy(user: any): Promise<(import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
