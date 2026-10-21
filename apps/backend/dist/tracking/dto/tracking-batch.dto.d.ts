export declare class PuntoGpsDto {
    lat: number;
    lng: number;
    velocidadKmh: number;
    precisionMetros?: number;
    capturadoEn: string;
    idPuntoCliente: string;
}
export declare class TrackingBatchDto {
    puntos: PuntoGpsDto[];
}
