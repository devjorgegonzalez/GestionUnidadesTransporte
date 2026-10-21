import { Document, Types } from 'mongoose';
import { EstadoUnidadTransporte } from './unidad-transporte.schema.js';
export type MantenimientoDocument = Mantenimiento & Document;
export declare enum EstadoMantenimiento {
    BORRADOR = "BORRADOR",
    FINALIZADO = "FINALIZADO"
}
export declare class ItemTareaMantenimiento {
    codigo?: string;
    nombre: string;
    seleccionada: boolean;
    esManual: boolean;
}
export declare const ItemTareaMantenimientoSchema: import("mongoose").Schema<ItemTareaMantenimiento, import("mongoose").Model<ItemTareaMantenimiento, any, any, any, any, any, ItemTareaMantenimiento & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ItemTareaMantenimiento, Document<unknown, {}, ItemTareaMantenimiento, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ItemTareaMantenimiento & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    codigo?: import("mongoose").SchemaDefinitionProperty<string | undefined, ItemTareaMantenimiento, Document<unknown, {}, ItemTareaMantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ItemTareaMantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    nombre?: import("mongoose").SchemaDefinitionProperty<string, ItemTareaMantenimiento, Document<unknown, {}, ItemTareaMantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ItemTareaMantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    seleccionada?: import("mongoose").SchemaDefinitionProperty<boolean, ItemTareaMantenimiento, Document<unknown, {}, ItemTareaMantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ItemTareaMantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    esManual?: import("mongoose").SchemaDefinitionProperty<boolean, ItemTareaMantenimiento, Document<unknown, {}, ItemTareaMantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ItemTareaMantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ItemTareaMantenimiento>;
export declare class Mantenimiento {
    utId: Types.ObjectId;
    placaUt: string;
    kilometrajeRegistro: number;
    estado: EstadoMantenimiento;
    tareasChecklist: ItemTareaMantenimiento[];
    tareasManuales: ItemTareaMantenimiento[];
    observacionesPersonal?: string;
    estadoFinalUt?: EstadoUnidadTransporte;
    fechaApertura: Date;
    fechaCierre?: Date;
}
export declare const MantenimientoSchema: import("mongoose").Schema<Mantenimiento, import("mongoose").Model<Mantenimiento, any, any, any, any, any, Mantenimiento & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Mantenimiento, Document<unknown, {}, Mantenimiento, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    utId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    placaUt?: import("mongoose").SchemaDefinitionProperty<string, Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    kilometrajeRegistro?: import("mongoose").SchemaDefinitionProperty<number, Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    estado?: import("mongoose").SchemaDefinitionProperty<EstadoMantenimiento, Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tareasChecklist?: import("mongoose").SchemaDefinitionProperty<ItemTareaMantenimiento[], Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tareasManuales?: import("mongoose").SchemaDefinitionProperty<ItemTareaMantenimiento[], Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    observacionesPersonal?: import("mongoose").SchemaDefinitionProperty<string | undefined, Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    estadoFinalUt?: import("mongoose").SchemaDefinitionProperty<EstadoUnidadTransporte | undefined, Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fechaApertura?: import("mongoose").SchemaDefinitionProperty<Date, Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fechaCierre?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Mantenimiento, Document<unknown, {}, Mantenimiento, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mantenimiento & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Mantenimiento>;
