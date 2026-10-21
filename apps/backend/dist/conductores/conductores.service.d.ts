import mongoose, { Model } from 'mongoose';
import { Conductor, ConductorDocument } from '../database/schemas/conductor.schema.js';
import { CreateConductorDto } from './dto/create-conductor.dto.js';
import { UpdateConductorDto } from './dto/update-conductor.dto.js';
import { QueryConductoresDto } from './dto/query-conductores.dto.js';
export declare class ConductoresService {
    private readonly conductorModel;
    constructor(conductorModel: Model<ConductorDocument>);
    create(dto: CreateConductorDto): Promise<mongoose.Document<unknown, {}, ConductorDocument, {}, mongoose.DefaultSchemaOptions> & Conductor & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QueryConductoresDto): Promise<{
        data: (mongoose.Document<unknown, {}, ConductorDocument, {}, mongoose.DefaultSchemaOptions> & Conductor & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findActivos(): Promise<(mongoose.Document<unknown, {}, ConductorDocument, {}, mongoose.DefaultSchemaOptions> & Conductor & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findById(id: string): Promise<mongoose.Document<unknown, {}, ConductorDocument, {}, mongoose.DefaultSchemaOptions> & Conductor & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdateConductorDto): Promise<mongoose.Document<unknown, {}, ConductorDocument, {}, mongoose.DefaultSchemaOptions> & Conductor & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
