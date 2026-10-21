import { TipoUnidadTransporte, EstadoUnidadTransporte } from '../../database/schemas/unidad-transporte.schema.js';
export declare class CreateUnidadTransporteDto {
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    tipo: TipoUnidadTransporte;
    capacidadPersonas: number;
    kilometraje?: number;
    estado?: EstadoUnidadTransporte;
}
