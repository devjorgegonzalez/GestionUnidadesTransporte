import { PuntosFrecuentesService } from './puntos-frecuentes.service.js';
import { CreatePuntoFrecuenteDto } from './dto/create-punto-frecuente.dto.js';
import { UpdatePuntoFrecuenteDto } from './dto/update-punto-frecuente.dto.js';
import { QueryPuntosFrecuentesDto } from './dto/query-puntos-frecuentes.dto.js';
export declare class PuntosFrecuentesController {
    private readonly puntosService;
    constructor(puntosService: PuntosFrecuentesService);
    create(dto: CreatePuntoFrecuenteDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuenteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuente & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QueryPuntosFrecuentesDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuenteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuente & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findActivos(): Promise<(import("mongoose").Document<unknown, {}, import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuenteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuente & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuenteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuente & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdatePuntoFrecuenteDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuenteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/punto-frecuente.schema.js").PuntoFrecuente & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
