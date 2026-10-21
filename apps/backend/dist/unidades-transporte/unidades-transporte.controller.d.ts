import { UnidadesTransporteService } from './unidades-transporte.service.js';
import { CreateUnidadTransporteDto } from './dto/create-unidad-transporte.dto.js';
import { UpdateUnidadTransporteDto } from './dto/update-unidad-transporte.dto.js';
import { QueryUnidadesTransporteDto } from './dto/query-unidades-transporte.dto.js';
export declare class UnidadesTransporteController {
    private readonly utService;
    constructor(utService: UnidadesTransporteService);
    create(dto: CreateUnidadTransporteDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/unidad-transporte.schema.js").UnidadTransporteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/unidad-transporte.schema.js").UnidadTransporte & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QueryUnidadesTransporteDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../database/schemas/unidad-transporte.schema.js").UnidadTransporteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/unidad-transporte.schema.js").UnidadTransporte & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findDisponiblesReserva(): Promise<(import("mongoose").Document<unknown, {}, import("../database/schemas/unidad-transporte.schema.js").UnidadTransporteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/unidad-transporte.schema.js").UnidadTransporte & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/unidad-transporte.schema.js").UnidadTransporteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/unidad-transporte.schema.js").UnidadTransporte & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdateUnidadTransporteDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/unidad-transporte.schema.js").UnidadTransporteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/unidad-transporte.schema.js").UnidadTransporte & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
