import { Document } from 'mongoose';
export type CatalogoTareaMantenimientoDocument = CatalogoTareaMantenimiento & Document;
export declare class CatalogoTareaMantenimiento {
    codigo: string;
    nombre: string;
    orden: number;
    activo: boolean;
}
export declare const CatalogoTareaMantenimientoSchema: import("mongoose").Schema<CatalogoTareaMantenimiento, import("mongoose").Model<CatalogoTareaMantenimiento, any, any, any, any, any, CatalogoTareaMantenimiento & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CatalogoTareaMantenimiento, Document<unknown, {}, CatalogoTareaMantenimiento, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CatalogoTareaMantenimiento & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    codigo?: import("mongoose").SchemaDefinitionProperty<string, CatalogoTareaMantenimiento, Document<unknown, {}, CatalogoTareaMantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CatalogoTareaMantenimiento & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    nombre?: import("mongoose").SchemaDefinitionProperty<string, CatalogoTareaMantenimiento, Document<unknown, {}, CatalogoTareaMantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CatalogoTareaMantenimiento & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    orden?: import("mongoose").SchemaDefinitionProperty<number, CatalogoTareaMantenimiento, Document<unknown, {}, CatalogoTareaMantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CatalogoTareaMantenimiento & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    activo?: import("mongoose").SchemaDefinitionProperty<boolean, CatalogoTareaMantenimiento, Document<unknown, {}, CatalogoTareaMantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CatalogoTareaMantenimiento & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, CatalogoTareaMantenimiento>;
