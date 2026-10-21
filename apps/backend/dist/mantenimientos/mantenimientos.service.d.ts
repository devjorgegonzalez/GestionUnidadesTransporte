import { Model } from 'mongoose';
import { Mantenimiento, MantenimientoDocument } from '../database/schemas/mantenimiento.schema.js';
import { UnidadTransporteDocument, EstadoUnidadTransporte } from '../database/schemas/unidad-transporte.schema.js';
import { CatalogoTareaMantenimiento, CatalogoTareaMantenimientoDocument } from '../database/schemas/catalogo-tarea.schema.js';
import { ReservaViaje, ReservaViajeDocument } from '../database/schemas/reserva-viaje.schema.js';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto.js';
import { UpdateBorradorMantenimientoDto } from './dto/update-borrador.dto.js';
import { FinalizarMantenimientoDto } from './dto/finalizar-mantenimiento.dto.js';
import { QueryMantenimientosDto } from './dto/query-mantenimientos.dto.js';
export declare class MantenimientosService {
    private readonly mantenimientoModel;
    private readonly utModel;
    private readonly catalogoModel;
    private readonly reservaModel;
    constructor(mantenimientoModel: Model<MantenimientoDocument>, utModel: Model<UnidadTransporteDocument>, catalogoModel: Model<CatalogoTareaMantenimientoDocument>, reservaModel: Model<ReservaViajeDocument>);
    getCatalogoChecklist(): Promise<(import("mongoose").Document<unknown, {}, CatalogoTareaMantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & CatalogoTareaMantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(dto: CreateMantenimientoDto): Promise<{
        mantenimiento: import("mongoose").Document<unknown, {}, MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        reservasAfectadas: (import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        alertaReservas: string | null;
    }>;
    updateBorrador(id: string, dto: UpdateBorradorMantenimientoDto): Promise<import("mongoose").Document<unknown, {}, MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    finalizar(id: string, dto: FinalizarMantenimientoDto): Promise<{
        mantenimiento: import("mongoose").Document<unknown, {}, MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        ut: {
            id: import("mongoose").Types.ObjectId;
            placa: string;
            estado: EstadoUnidadTransporte;
        };
        reservasAfectadas: ReservaViajeDocument[];
        alerta: string | null;
    }>;
    findAll(query: QueryMantenimientosDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
