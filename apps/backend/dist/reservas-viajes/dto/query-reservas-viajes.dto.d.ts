import { EstadoReservaViaje } from '../../database/schemas/reserva-viaje.schema.js';
export declare class QueryReservasViajesDto {
    estado?: EstadoReservaViaje;
    placaUt?: string;
    cedulaConductor?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    page?: number;
    limit?: number;
}
