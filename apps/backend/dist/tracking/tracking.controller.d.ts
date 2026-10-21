import { TrackingService } from './tracking.service.js';
import { TrackingBatchDto } from './dto/tracking-batch.dto.js';
import { FinalizarViajeDto } from './dto/finalizar-viaje.dto.js';
import { JustificacionViajeDto } from './dto/justificacion-viaje.dto.js';
import { QueryHistorialViajesDto } from './dto/query-historial-viajes.dto.js';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    getReservasHoy(user: any): Promise<(import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    iniciarViaje(viajeId: string): Promise<{
        reserva: import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        ut: (import("mongoose").Document<unknown, {}, import("../database/schemas/unidad-transporte.schema.js").UnidadTransporteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/unidad-transporte.schema.js").UnidadTransporte & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
        reserva: import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        ut: (import("mongoose").Document<unknown, {}, import("../database/schemas/unidad-transporte.schema.js").UnidadTransporteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/unidad-transporte.schema.js").UnidadTransporte & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
        viajeId: import("mongoose").Types.ObjectId;
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
        data: (import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
        viaje: import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        puntos: {
            id: import("mongoose").Types.ObjectId;
            lat: number;
            lng: number;
            velocidadKmh: number;
            precisionMetros: number | undefined;
            capturadoEn: Date;
        }[];
    }>;
    guardarJustificacion(viajeId: string, dto: JustificacionViajeDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
