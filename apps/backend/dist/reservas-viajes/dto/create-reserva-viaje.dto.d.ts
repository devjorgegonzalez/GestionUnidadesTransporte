export declare class UbicacionRutaDto {
    nombre?: string;
    direccion: string;
    lat: number;
    lng: number;
    puntoFrecuenteId?: string;
}
export declare class CreateReservaViajeDto {
    utId: string;
    conductorId: string;
    fechaHoraInicioProgramada: string;
    origen: UbicacionRutaDto;
    destino: UbicacionRutaDto;
    kmSugeridosGoogle: number;
    duracionSugeridaMinutos?: number;
    polylineSugerida?: string;
}
