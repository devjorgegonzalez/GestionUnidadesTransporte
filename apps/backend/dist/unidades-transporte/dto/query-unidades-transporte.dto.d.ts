import { EstadoUnidadTransporte, TipoUnidadTransporte } from '../../database/schemas/unidad-transporte.schema.js';
export declare class QueryUnidadesTransporteDto {
    search?: string;
    estado?: EstadoUnidadTransporte;
    tipo?: TipoUnidadTransporte;
    page?: number;
    limit?: number;
}
