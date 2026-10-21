import mongoose, { Model } from 'mongoose';
import { PuntoFrecuente, PuntoFrecuenteDocument } from '../database/schemas/punto-frecuente.schema.js';
import { CreatePuntoFrecuenteDto } from './dto/create-punto-frecuente.dto.js';
import { UpdatePuntoFrecuenteDto } from './dto/update-punto-frecuente.dto.js';
import { QueryPuntosFrecuentesDto } from './dto/query-puntos-frecuentes.dto.js';
export declare class PuntosFrecuentesService {
    private readonly puntoModel;
    constructor(puntoModel: Model<PuntoFrecuenteDocument>);
    create(dto: CreatePuntoFrecuenteDto): Promise<mongoose.Document<unknown, {}, PuntoFrecuenteDocument, {}, mongoose.DefaultSchemaOptions> & PuntoFrecuente & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QueryPuntosFrecuentesDto): Promise<{
        data: (mongoose.Document<unknown, {}, PuntoFrecuenteDocument, {}, mongoose.DefaultSchemaOptions> & PuntoFrecuente & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findActivos(): Promise<(mongoose.Document<unknown, {}, PuntoFrecuenteDocument, {}, mongoose.DefaultSchemaOptions> & PuntoFrecuente & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findById(id: string): Promise<mongoose.Document<unknown, {}, PuntoFrecuenteDocument, {}, mongoose.DefaultSchemaOptions> & PuntoFrecuente & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdatePuntoFrecuenteDto): Promise<mongoose.Document<unknown, {}, PuntoFrecuenteDocument, {}, mongoose.DefaultSchemaOptions> & PuntoFrecuente & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
