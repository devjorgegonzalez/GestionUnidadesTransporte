import { Document, Types } from 'mongoose';
export type PuntoTrackingViajeDocument = PuntoTrackingViaje & Document;
export declare class PuntoTrackingViaje {
    viajeId: Types.ObjectId;
    utId: Types.ObjectId;
    conductorId: Types.ObjectId;
    lat: number;
    lng: number;
    velocidadKmh: number;
    precisionMetros?: number;
    capturadoEn: Date;
    idPuntoCliente: string;
}
export declare const PuntoTrackingViajeSchema: import("mongoose").Schema<PuntoTrackingViaje, import("mongoose").Model<PuntoTrackingViaje, any, any, any, any, any, PuntoTrackingViaje & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    viajeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    utId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    conductorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lat?: import("mongoose").SchemaDefinitionProperty<number, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lng?: import("mongoose").SchemaDefinitionProperty<number, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    velocidadKmh?: import("mongoose").SchemaDefinitionProperty<number, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    precisionMetros?: import("mongoose").SchemaDefinitionProperty<number | undefined, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    capturadoEn?: import("mongoose").SchemaDefinitionProperty<Date, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    idPuntoCliente?: import("mongoose").SchemaDefinitionProperty<string, PuntoTrackingViaje, Document<unknown, {}, PuntoTrackingViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PuntoTrackingViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, PuntoTrackingViaje>;
