import { MantenimientosService } from './mantenimientos.service.js';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto.js';
import { UpdateBorradorMantenimientoDto } from './dto/update-borrador.dto.js';
import { FinalizarMantenimientoDto } from './dto/finalizar-mantenimiento.dto.js';
import { QueryMantenimientosDto } from './dto/query-mantenimientos.dto.js';
export declare class MantenimientosController {
    private readonly mantenimientosService;
    constructor(mantenimientosService: MantenimientosService);
    getCatalogoChecklist(): Promise<(import("mongoose").Document<unknown, {}, import("../database/schemas/catalogo-tarea.schema.js").CatalogoTareaMantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/catalogo-tarea.schema.js").CatalogoTareaMantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(dto: CreateMantenimientoDto): Promise<{
        mantenimiento: import("mongoose").Document<unknown, {}, import("../database/schemas/mantenimiento.schema.js").MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/mantenimiento.schema.js").Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        reservasAfectadas: (import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        alertaReservas: string | null;
    }>;
    findAll(query: QueryMantenimientosDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../database/schemas/mantenimiento.schema.js").MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/mantenimiento.schema.js").Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/mantenimiento.schema.js").MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/mantenimiento.schema.js").Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateBorrador(id: string, dto: UpdateBorradorMantenimientoDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/mantenimiento.schema.js").MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/mantenimiento.schema.js").Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    finalizar(id: string, dto: FinalizarMantenimientoDto): Promise<{
        mantenimiento: import("mongoose").Document<unknown, {}, import("../database/schemas/mantenimiento.schema.js").MantenimientoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/mantenimiento.schema.js").Mantenimiento & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        ut: {
            id: import("mongoose").Types.ObjectId;
            placa: string;
            estado: import("../database/schemas/unidad-transporte.schema.js").EstadoUnidadTransporte;
        };
        reservasAfectadas: import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument[];
        alerta: string | null;
    }>;
}
