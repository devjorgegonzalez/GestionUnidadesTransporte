import { EstadoMantenimiento } from '../../database/schemas/mantenimiento.schema.js';
export declare class QueryMantenimientosDto {
    estado?: EstadoMantenimiento;
    utId?: string;
    placa?: string;
    page?: number;
    limit?: number;
}
