import { ConductoresService } from './conductores.service.js';
import { CreateConductorDto } from './dto/create-conductor.dto.js';
import { UpdateConductorDto } from './dto/update-conductor.dto.js';
import { QueryConductoresDto } from './dto/query-conductores.dto.js';
export declare class ConductoresController {
    private readonly conductoresService;
    constructor(conductoresService: ConductoresService);
    create(dto: CreateConductorDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/conductor.schema.js").ConductorDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/conductor.schema.js").Conductor & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QueryConductoresDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../database/schemas/conductor.schema.js").ConductorDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/conductor.schema.js").Conductor & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findActivos(): Promise<(import("mongoose").Document<unknown, {}, import("../database/schemas/conductor.schema.js").ConductorDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/conductor.schema.js").Conductor & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/conductor.schema.js").ConductorDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/conductor.schema.js").Conductor & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdateConductorDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/conductor.schema.js").ConductorDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/conductor.schema.js").Conductor & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
