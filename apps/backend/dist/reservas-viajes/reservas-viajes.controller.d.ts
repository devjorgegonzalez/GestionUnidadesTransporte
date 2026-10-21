import { ReservasViajesService } from './reservas-viajes.service.js';
import { CreateReservaViajeDto } from './dto/create-reserva-viaje.dto.js';
import { UpdateReservaViajeDto } from './dto/update-reserva-viaje.dto.js';
import { QueryReservasViajesDto } from './dto/query-reservas-viajes.dto.js';
export declare class ReservasViajesController {
    private readonly reservasService;
    constructor(reservasService: ReservasViajesService);
    create(dto: CreateReservaViajeDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QueryReservasViajesDto): Promise<{
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
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdateReservaViajeDto): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    cancelar(id: string): Promise<import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
