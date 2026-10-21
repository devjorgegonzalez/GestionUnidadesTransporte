export function calcularDistanciaHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calcularDistanciaRecorridoGpsKm(
  puntos: Array<{ lat: number; lng: number; precisionMetros?: number }>,
): number {
  if (!puntos || puntos.length < 2) return 0;

  let distanciaTotal = 0;
  for (let i = 0; i < puntos.length - 1; i++) {
    const p1 = puntos[i];
    const p2 = puntos[i + 1];

    // Descartar puntos con precisión degradada superior a 150 metros
    if (
      (p1.precisionMetros && p1.precisionMetros > 150) ||
      (p2.precisionMetros && p2.precisionMetros > 150)
    ) {
      continue;
    }

    const distTramo = calcularDistanciaHaversineKm(
      p1.lat,
      p1.lng,
      p2.lat,
      p2.lng,
    );

    // Descartar saltos GPS inverosímiles mayores a 10 km entre dos lecturas
    if (distTramo > 10) {
      continue;
    }

    distanciaTotal += distTramo;
  }

  return Number(distanciaTotal.toFixed(2));
}
