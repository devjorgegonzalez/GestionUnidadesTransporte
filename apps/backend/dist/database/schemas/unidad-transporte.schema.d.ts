import { Document } from 'mongoose';
export type UnidadTransporteDocument = UnidadTransporte & Document;
export declare enum TipoUnidadTransporte {
    CAMION = "CAMION",
    SEDAN = "SEDAN",
    CAMIONETA_SUV = "CAMIONETA_SUV",
    CAMIONETA_PICKUP = "CAMIONETA_PICKUP",
    VAN = "VAN",
    MOTO = "MOTO"
}
export declare enum EstadoUnidadTransporte {
    DISPONIBLE = "DISPONIBLE",
    VIAJANDO = "VIAJANDO",
    EN_MANTENIMIENTO = "EN_MANTENIMIENTO",
    INACTIVA = "INACTIVA"
}
export declare class UnidadTransporte {
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    tipo: TipoUnidadTransporte;
    capacidadPersonas: number;
    kilometraje: number;
    estado: EstadoUnidadTransporte;
}
export declare const UnidadTransporteSchema: import("mongoose").Schema<UnidadTransporte, import("mongoose").Model<UnidadTransporte, any, any, any, any, any, UnidadTransporte & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UnidadTransporte, Document<unknown, {}, UnidadTransporte, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<UnidadTransporte & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    placa?: import("mongoose").SchemaDefinitionProperty<string, UnidadTransporte, Document<unknown, {}, UnidadTransporte, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UnidadTransporte & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    marca?: import("mongoose").SchemaDefinitionProperty<string, UnidadTransporte, Document<unknown, {}, UnidadTransporte, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UnidadTransporte & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    modelo?: import("mongoose").SchemaDefinitionProperty<string, UnidadTransporte, Document<unknown, {}, UnidadTransporte, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UnidadTransporte & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    anio?: import("mongoose").SchemaDefinitionProperty<number, UnidadTransporte, Document<unknown, {}, UnidadTransporte, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UnidadTransporte & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tipo?: import("mongoose").SchemaDefinitionProperty<TipoUnidadTransporte, UnidadTransporte, Document<unknown, {}, UnidadTransporte, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UnidadTransporte & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    capacidadPersonas?: import("mongoose").SchemaDefinitionProperty<number, UnidadTransporte, Document<unknown, {}, UnidadTransporte, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UnidadTransporte & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    kilometraje?: import("mongoose").SchemaDefinitionProperty<number, UnidadTransporte, Document<unknown, {}, UnidadTransporte, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UnidadTransporte & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    estado?: import("mongoose").SchemaDefinitionProperty<EstadoUnidadTransporte, UnidadTransporte, Document<unknown, {}, UnidadTransporte, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UnidadTransporte & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, UnidadTransporte>;
