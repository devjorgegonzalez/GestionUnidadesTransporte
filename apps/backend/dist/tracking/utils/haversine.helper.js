export function calcularDistanciaHaversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
export function calcularDistanciaRecorridoGpsKm(puntos) {
    if (!puntos || puntos.length < 2)
        return 0;
    let distanciaTotal = 0;
    for (let i = 0; i < puntos.length - 1; i++) {
        const p1 = puntos[i];
        const p2 = puntos[i + 1];
        if ((p1.precisionMetros && p1.precisionMetros > 150) ||
            (p2.precisionMetros && p2.precisionMetros > 150)) {
            continue;
        }
        const distTramo = calcularDistanciaHaversineKm(p1.lat, p1.lng, p2.lat, p2.lng);
        if (distTramo > 10) {
            continue;
        }
        distanciaTotal += distTramo;
    }
    return Number(distanciaTotal.toFixed(2));
}
//# sourceMappingURL=haversine.helper.js.map