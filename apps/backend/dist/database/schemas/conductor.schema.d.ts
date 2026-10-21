import { Document } from 'mongoose';
export type ConductorDocument = Conductor & Document;
export declare class Conductor {
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    activo: boolean;
}
export declare const ConductorSchema: import("mongoose").Schema<Conductor, import("mongoose").Model<Conductor, any, any, any, any, any, Conductor & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conductor, Document<unknown, {}, Conductor, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Conductor & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    nombre?: import("mongoose").SchemaDefinitionProperty<string, Conductor, Document<unknown, {}, Conductor, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conductor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    apellido?: import("mongoose").SchemaDefinitionProperty<string, Conductor, Document<unknown, {}, Conductor, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conductor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    cedula?: import("mongoose").SchemaDefinitionProperty<string, Conductor, Document<unknown, {}, Conductor, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conductor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    telefono?: import("mongoose").SchemaDefinitionProperty<string, Conductor, Document<unknown, {}, Conductor, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conductor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    activo?: import("mongoose").SchemaDefinitionProperty<boolean, Conductor, Document<unknown, {}, Conductor, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conductor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Conductor>;
