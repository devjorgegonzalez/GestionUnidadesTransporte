import { Document } from 'mongoose';
export type PuntoFrecuenteDocument = PuntoFrecuente & Document;
export declare class CoordenadasPunto {
    lat: number;
    lng: number;
}
export declare const CoordenadasPuntoSchema: import("mongoose").Schema<CoordenadasPunto, import("mongoose").Model<CoordenadasPunto, any, any, any, any, any, CoordenadasPunto & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CoordenadasPunto, Document<unknown, {}, CoordenadasPunto, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CoordenadasPunto & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    lat?: import("mongoose").SchemaDefinitionProperty<number, CoordenadasPunto, Document<unknown, {}, CoordenadasPunto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CoordenadasPunto & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lng?: import("mongoose").SchemaDefinitionProperty<number, CoordenadasPunto, Document<unknown, {}, CoordenadasPunto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CoordenadasPunto & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, CoordenadasPunto>;
export declare class PuntoFrecuente {
    nombre: string;
    direccion: string;
    coordenadas: CoordenadasPunto;
    descripcion?: string;
    activo: boolean;
}
export declare const PuntoFrecuenteSchema: import("mongoose").Schema<PuntoFrecuente, import("mongoose").Model<PuntoFrecuente, any, any, any, any, any, PuntoFrecuente & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PuntoFrecuente, Document<unknown, {}, PuntoFrecuente, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PuntoFrecuente & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    nombre?: import("mongoose").SchemaDefinitionProperty<string, PuntoFrecuente, Document<unknown, {}, PuntoFrecuente, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoFrecuente & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    direccion?: import("mongoose").SchemaDefinitionProperty<string, PuntoFrecuente, Document<unknown, {}, PuntoFrecuente, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoFrecuente & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    coordenadas?: import("mongoose").SchemaDefinitionProperty<CoordenadasPunto, PuntoFrecuente, Document<unknown, {}, PuntoFrecuente, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoFrecuente & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    descripcion?: import("mongoose").SchemaDefinitionProperty<string | undefined, PuntoFrecuente, Document<unknown, {}, PuntoFrecuente, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoFrecuente & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    activo?: import("mongoose").SchemaDefinitionProperty<boolean, PuntoFrecuente, Document<unknown, {}, PuntoFrecuente, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoFrecuente & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, PuntoFrecuente>;
