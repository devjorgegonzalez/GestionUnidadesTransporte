import { Document } from 'mongoose';
export type UsuarioAdminDocument = UsuarioAdmin & Document;
export declare class UsuarioAdmin {
    nombre: string;
    email: string;
    passwordHash: string;
    rol: string;
    activo: boolean;
}
export declare const UsuarioAdminSchema: import("mongoose").Schema<UsuarioAdmin, import("mongoose").Model<UsuarioAdmin, any, any, any, any, any, UsuarioAdmin & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UsuarioAdmin, Document<unknown, {}, UsuarioAdmin, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<UsuarioAdmin & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    nombre?: import("mongoose").SchemaDefinitionProperty<string, UsuarioAdmin, Document<unknown, {}, UsuarioAdmin, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UsuarioAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, UsuarioAdmin, Document<unknown, {}, UsuarioAdmin, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UsuarioAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    passwordHash?: import("mongoose").SchemaDefinitionProperty<string, UsuarioAdmin, Document<unknown, {}, UsuarioAdmin, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UsuarioAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    rol?: import("mongoose").SchemaDefinitionProperty<string, UsuarioAdmin, Document<unknown, {}, UsuarioAdmin, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UsuarioAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    activo?: import("mongoose").SchemaDefinitionProperty<boolean, UsuarioAdmin, Document<unknown, {}, UsuarioAdmin, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UsuarioAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, UsuarioAdmin>;
