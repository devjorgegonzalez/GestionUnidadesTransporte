import mongoose, { Model } from 'mongoose';
import { UnidadTransporte, UnidadTransporteDocument } from '../database/schemas/unidad-transporte.schema.js';
import { CreateUnidadTransporteDto } from './dto/create-unidad-transporte.dto.js';
import { UpdateUnidadTransporteDto } from './dto/update-unidad-transporte.dto.js';
import { QueryUnidadesTransporteDto } from './dto/query-unidades-transporte.dto.js';
export declare class UnidadesTransporteService {
    private readonly utModel;
    constructor(utModel: Model<UnidadTransporteDocument>);
    create(dto: CreateUnidadTransporteDto): Promise<mongoose.Document<unknown, {}, UnidadTransporteDocument, {}, mongoose.DefaultSchemaOptions> & UnidadTransporte & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QueryUnidadesTransporteDto): Promise<{
        data: (mongoose.Document<unknown, {}, UnidadTransporteDocument, {}, mongoose.DefaultSchemaOptions> & UnidadTransporte & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: mongoose.Types.ObjectId;
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
    findDisponiblesReserva(): Promise<(mongoose.Document<unknown, {}, UnidadTransporteDocument, {}, mongoose.DefaultSchemaOptions> & UnidadTransporte & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findById(id: string): Promise<mongoose.Document<unknown, {}, UnidadTransporteDocument, {}, mongoose.DefaultSchemaOptions> & UnidadTransporte & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdateUnidadTransporteDto): Promise<mongoose.Document<unknown, {}, UnidadTransporteDocument, {}, mongoose.DefaultSchemaOptions> & UnidadTransporte & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
