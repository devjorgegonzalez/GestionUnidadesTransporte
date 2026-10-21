import { AuthService } from './auth.service.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { ConductorLoginDto } from './dto/conductor-login.dto.js';
import type { JwtPayload } from './strategies/jwt.strategy.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginAdmin(dto: AdminLoginDto): Promise<{
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            nombre: string;
            rol: string;
        };
    }>;
    loginConductor(dto: ConductorLoginDto): Promise<{
        accessToken: string;
        conductor: {
            id: import("mongoose").Types.ObjectId;
            cedula: string;
            nombre: string;
            apellido: string;
            telefono: string;
        };
        ut: {
            id: import("mongoose").Types.ObjectId;
            placa: string;
            marca: string;
            modelo: string;
            kilometraje: number;
            estado: import("../database/schemas/unidad-transporte.schema.js").EstadoUnidadTransporte.DISPONIBLE | import("../database/schemas/unidad-transporte.schema.js").EstadoUnidadTransporte.VIAJANDO;
        };
        reservasDelDia: (import("mongoose").Document<unknown, {}, import("../database/schemas/reserva-viaje.schema.js").ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schemas/reserva-viaje.schema.js").ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getProfile(user: JwtPayload): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        nombre: string;
        rol: string;
        cedula?: undefined;
        apellido?: undefined;
        telefono?: undefined;
        utAsignada?: undefined;
    } | {
        id: import("mongoose").Types.ObjectId;
        cedula: string;
        nombre: string;
        apellido: string;
        telefono: string;
        rol: string;
        utAsignada: {
            utId: string | undefined;
            placa: string | undefined;
        };
        email?: undefined;
    }>;
}
