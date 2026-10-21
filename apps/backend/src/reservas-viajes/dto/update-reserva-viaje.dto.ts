import { PartialType } from '@nestjs/swagger';
import { CreateReservaViajeDto } from './create-reserva-viaje.dto.js';

export class UpdateReservaViajeDto extends PartialType(CreateReservaViajeDto) {}
