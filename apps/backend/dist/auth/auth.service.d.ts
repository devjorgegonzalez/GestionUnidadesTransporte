import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UsuarioAdminDocument } from '../database/schemas/usuario-admin.schema.js';
import { ConductorDocument } from '../database/schemas/conductor.schema.js';
import { UnidadTransporteDocument, EstadoUnidadTransporte } from '../database/schemas/unidad-transporte.schema.js';
import { ReservaViaje, ReservaViajeDocument } from '../database/schemas/reserva-viaje.schema.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { ConductorLoginDto } from './dto/conductor-login.dto.js';
import { JwtPayload } from './strategies/jwt.strategy.js';
export declare class AuthService {
    private readonly adminModel;
    private readonly conductorModel;
    private readonly utModel;
    private readonly reservaModel;
    private readonly jwtService;
    constructor(adminModel: Model<UsuarioAdminDocument>, conductorModel: Model<ConductorDocument>, utModel: Model<UnidadTransporteDocument>, reservaModel: Model<ReservaViajeDocument>, jwtService: JwtService);
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
            estado: EstadoUnidadTransporte.DISPONIBLE | EstadoUnidadTransporte.VIAJANDO;
        };
        reservasDelDia: (import("mongoose").Document<unknown, {}, ReservaViajeDocument, {}, import("mongoose").DefaultSchemaOptions> & ReservaViaje & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getProfile(userPayload: JwtPayload): Promise<{
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
