import { CreateConductorDto } from './create-conductor.dto.js';
declare const UpdateConductorDto_base: import("@nestjs/common").Type<Partial<CreateConductorDto>>;
export declare class UpdateConductorDto extends UpdateConductorDto_base {
    activo?: boolean;
}
export {};
