import { CreateUnidadTransporteDto } from './create-unidad-transporte.dto.js';
import { EstadoUnidadTransporte } from '../../database/schemas/unidad-transporte.schema.js';
declare const UpdateUnidadTransporteDto_base: import("@nestjs/common").Type<Partial<CreateUnidadTransporteDto>>;
export declare class UpdateUnidadTransporteDto extends UpdateUnidadTransporteDto_base {
    estado?: EstadoUnidadTransporte;
}
export {};
