import { DashboardService } from './dashboard.service.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getResumen(): Promise<{
        kpis: {
            disponibles: number;
            viajando: number;
            enMantenimiento: number;
            inactivas: number;
            total: number;
        };
        viajesHoy: {
            id: import("mongoose").Types.ObjectId;
            placaUt: string;
            conductor: string;
            estado: import("../database/schemas/reserva-viaje.schema.js").EstadoReservaViaje;
            origen: string;
            destino: string;
            hora: string;
        }[];
        alertasExcesoKm: {
            id: import("mongoose").Types.ObjectId;
            placaUt: string;
            conductor: string;
            kmSugeridos: number;
            kmReales: number;
            desviacion: number;
        }[];
        mantenimientosBorrador: {
            id: import("mongoose").Types.ObjectId;
            placaUt: string;
            fechaApertura: string;
            tareas: number;
        }[];
    }>;
}
