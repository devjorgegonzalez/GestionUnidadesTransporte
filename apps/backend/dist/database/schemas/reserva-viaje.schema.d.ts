import { Document, Types } from 'mongoose';
export type ReservaViajeDocument = ReservaViaje & Document;
export declare enum EstadoReservaViaje {
    PROGRAMADA = "PROGRAMADA",
    EN_CURSO = "EN_CURSO",
    FINALIZADO = "FINALIZADO",
    CANCELADA = "CANCELADA"
}
export declare class UbicacionRuta {
    nombre?: string;
    direccion: string;
    lat: number;
    lng: number;
    puntoFrecuenteId?: Types.ObjectId;
}
export declare const UbicacionRutaSchema: import("mongoose").Schema<UbicacionRuta, import("mongoose").Model<UbicacionRuta, any, any, any, any, any, UbicacionRuta & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UbicacionRuta, Document<unknown, {}, UbicacionRuta, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<UbicacionRuta & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    nombre?: import("mongoose").SchemaDefinitionProperty<string | undefined, UbicacionRuta, Document<unknown, {}, UbicacionRuta, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UbicacionRuta & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    direccion?: import("mongoose").SchemaDefinitionProperty<string, UbicacionRuta, Document<unknown, {}, UbicacionRuta, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UbicacionRuta & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lat?: import("mongoose").SchemaDefinitionProperty<number, UbicacionRuta, Document<unknown, {}, UbicacionRuta, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UbicacionRuta & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lng?: import("mongoose").SchemaDefinitionProperty<number, UbicacionRuta, Document<unknown, {}, UbicacionRuta, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UbicacionRuta & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    puntoFrecuenteId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, UbicacionRuta, Document<unknown, {}, UbicacionRuta, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UbicacionRuta & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, UbicacionRuta>;
export declare class ReservaViaje {
    utId: Types.ObjectId;
    placaUt: string;
    conductorId: Types.ObjectId;
    cedulaConductor: string;
    nombreConductor: string;
    fechaHoraInicioProgramada: Date;
    origen: UbicacionRuta;
    destino: UbicacionRuta;
    kmSugeridosGoogle: number;
    duracionSugeridaMinutos: number;
    polylineSugerida: string;
    estado: EstadoReservaViaje;
    kilometrajeUtInicial?: number;
    kilometrajeUtFinal?: number;
    kmRealesGps?: number;
    porcentajeDesviacionKm?: number;
    excedeUmbralKm?: boolean;
    justificacionExcesoKm?: string;
    fechaHoraInicioReal?: Date;
    fechaHoraFinReal?: Date;
}
export declare const ReservaViajeSchema: import("mongoose").Schema<ReservaViaje, import("mongoose").Model<ReservaViaje, any, any, any, any, any, ReservaViaje & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ReservaViaje, Document<unknown, {}, ReservaViaje, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    utId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    placaUt?: import("mongoose").SchemaDefinitionProperty<string, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    conductorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    cedulaConductor?: import("mongoose").SchemaDefinitionProperty<string, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    nombreConductor?: import("mongoose").SchemaDefinitionProperty<string, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fechaHoraInicioProgramada?: import("mongoose").SchemaDefinitionProperty<Date, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    origen?: import("mongoose").SchemaDefinitionProperty<UbicacionRuta, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    destino?: import("mongoose").SchemaDefinitionProperty<UbicacionRuta, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    kmSugeridosGoogle?: import("mongoose").SchemaDefinitionProperty<number, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    duracionSugeridaMinutos?: import("mongoose").SchemaDefinitionProperty<number, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    polylineSugerida?: import("mongoose").SchemaDefinitionProperty<string, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    estado?: import("mongoose").SchemaDefinitionProperty<EstadoReservaViaje, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    kilometrajeUtInicial?: import("mongoose").SchemaDefinitionProperty<number | undefined, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    kilometrajeUtFinal?: import("mongoose").SchemaDefinitionProperty<number | undefined, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    kmRealesGps?: import("mongoose").SchemaDefinitionProperty<number | undefined, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    porcentajeDesviacionKm?: import("mongoose").SchemaDefinitionProperty<number | undefined, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    excedeUmbralKm?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    justificacionExcesoKm?: import("mongoose").SchemaDefinitionProperty<string | undefined, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fechaHoraInicioReal?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fechaHoraFinReal?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ReservaViaje, Document<unknown, {}, ReservaViaje, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ReservaViaje & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ReservaViaje>;
