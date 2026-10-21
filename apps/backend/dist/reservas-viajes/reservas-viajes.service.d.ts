import { Model, Types } from 'mongoose';
import { ReservaViaje, ReservaViajeDocument } from '../database/schemas/reserva-viaje.schema.js';
import { UnidadTransporteDocument } from '../database/schemas/unidad-transporte.schema.js';
import { ConductorDocument } from '../database/schemas/conductor.schema.js';
import { CreateReservaViajeDto } from './dto/create-reserva-viaje.dto.js';
import { UpdateReservaViajeDto } from './dto/update-reserva-viaje.dto.js';
import { QueryReservasViajesDto } from './dto/query-reservas-viajes.dto.js';
export declare class ReservasViajesService {
    private readonly reservaModel;
    private readonly utModel;
    private readonly conductorModel;
    constructor(reservaModel: Model<ReservaViajeDocument>, utModel: Model<UnidadTransporteDocument>, conductorModel: Model<ConductorDocument>);
    create(dto: CreateReservaViajeDto): Promise<import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QueryReservasViajesDto): Promise<{
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
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdateReservaViajeDto): Promise<import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    cancelar(id: string): Promise<import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
