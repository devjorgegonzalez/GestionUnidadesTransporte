export declare class CoordenadasDto {
    lat: number;
    lng: number;
}
export declare class CreatePuntoFrecuenteDto {
    nombre: string;
    direccion: string;
    coordenadas: CoordenadasDto;
    descripcion?: string;
}
