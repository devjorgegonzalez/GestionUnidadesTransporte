# SPEC 07: Módulo de Visor de Unidades de Transporte y Tracking

## 1. Objetivo
Proveer el **Visor Web en tiempo casi real** que muestra la ubicación actual y el recorrido de las Unidades de Transporte activas (`VIAJANDO`), así como el **Buscador e Historial de Viajes** (activos o terminados) para visualizar en el mapa el tracking GPS enviado desde la app móvil, comparar los kilómetros sugeridos vs. kilómetros reales y registrar justificaciones ante excesos de kilometraje.

## 2. Modelo de Datos (`PuntoTrackingViaje`)
Colección: `puntos_tracking_viajes`

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `_id` | `ObjectId` | Sí | Identificador único |
| `viajeId` | `ObjectId` | Sí | Referencia a `ReservaViaje` |
| `utId` | `ObjectId` | Sí | Referencia a `UnidadTransporte` |
| `conductorId` | `ObjectId` | Sí | Referencia a `Conductor` |
| `lat` | `number` | Sí | Latitud capturada por GPS (`-90` a `90`) |
| `lng` | `number` | Sí | Longitud capturada por GPS (`-180` a `180`) |
| `velocidadKmh` | `number` | Sí | Velocidad instantánea en `km/h` (`>= 0`) |
| `precisionMetros` | `number` | No | Precisión horizontal del GPS en metros |
| `capturadoEn` | `Date` | Sí | Timestamp exacto en que el dispositivo móvil capturó la coordenada |
| `idPuntoCliente` | `string` | Sí | UUID generado en Android para garantizar idempotencia en reintentos de lotes |
| `createdAt` | `Date` | Sí | Timestamp de recepción en el backend |

**Índices:**
- `{ viajeId: 1, capturadoEn: 1 }`
- `{ idPuntoCliente: 1 }` (Único, evita duplicados si la app reintenta enviar un lote)

## 3. Reglas de Negocio
1. **Recepción de Lotes (Batch Upload cada 5 minutos):**
   - La app móvil envía cada 5 minutos un arreglo de puntos GPS capturados localmente.
   - El backend inserta los puntos de forma idempotente (ignorando cualquier `idPuntoCliente` ya registrado) y ordena el recorrido por `capturadoEn` ascendente.
2. **Cálculo de Distancia Real GPS y Cierre de Viaje:**
   - Al finalizar el viaje, el backend toma todos los puntos de `puntos_tracking_viajes` del `viajeId` ordenados cronológicamente y calcula la distancia acumulada mediante la **fórmula de Haversine** (descartando ruido GPS con saltos irreales o precisión muy degradada `> 100m`).
   - Suma `kmRealesGps` al campo `kilometraje` de la `UnidadTransporte`.
   - Calcula `porcentajeDesviacionKm = ((kmRealesGps - kmSugeridosGoogle) / kmSugeridosGoogle) * 100`.
   - Si `kmRealesGps > kmSugeridosGoogle * 1.10` (desviación mayor al 10%), marca `excedeUmbralKm = true`.
3. **Justificación de Exceso de Kilometraje:**
   - Tal como ocurría en el proceso manual del cliente, cuando el administrador revisa un viaje terminado (especialmente aquellos con `excedeUmbralKm = true`), puede registrar o editar la **justificación del conductor / observación administrativa** (`justificacionExcesoKm`) en el detalle del viaje.
4. **Refresco del Visor de UTs Activas:**
   - El Visor Web realiza polling automático cada **30 segundos** al endpoint de viajes activos para actualizar la posición actual, velocidad reportada y polilínea recorrida de todas las UTs en estado `VIAJANDO`.

## 4. Contratos de API (Backend NestJS)

| Método | Ruta | Rol | Descripción |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/viajes/:viajeId/iniciar` | `CONDUCTOR` | Inicia un viaje programado para hoy; cambia el viaje a `EN_CURSO` y la UT a `VIAJANDO`. |
| `POST` | `/api/v1/viajes/:viajeId/tracking/batch` | `CONDUCTOR` | Recibe un lote de puntos GPS (`lat`, `lng`, `velocidadKmh`, `capturadoEn`, `idPuntoCliente`). |
| `POST` | `/api/v1/viajes/:viajeId/finalizar` | `CONDUCTOR` | Recibe el último lote pendiente (opcional), calcula `kmRealesGps`, actualiza el `kilometraje` de la UT, cierra el viaje (`FINALIZADO`) y cambia la UT a `DISPONIBLE`. |
| `GET` | `/api/v1/visor/activos` | `ADMIN` | Retorna todas las UTs actualmente en viaje (`EN_CURSO`) con su última coordenada, última velocidad y polilínea recorrida hasta el momento. |
| `GET` | `/api/v1/visor/viajes` | `ADMIN` | Busca historial de viajes (`EN_CURSO` o `FINALIZADO`) filtrando por placa, conductor, rango de fechas o alerta de exceso de km. |
| `GET` | `/api/v1/visor/viajes/:viajeId/tracking` | `ADMIN` | Retorna los datos del viaje, la polilínea sugerida por Google Maps y la lista completa de puntos GPS registrados con sus velocidades. |
| `PATCH` | `/api/v1/visor/viajes/:viajeId/justificacion` | `ADMIN` | Registra o actualiza la `justificacionExcesoKm` de un viaje finalizado. |

## 5. Especificación UI Web (`apps/web`)
- **Ruta `/visor`:**
  - **Modo 1: Flota Activa en Tiempo Real:**
    - Mapa de Google Maps a pantalla completa/amplia mostrando todas las UTs en estado `VIAJANDO`.
    - Al seleccionar una UT activa (en la lista lateral o sobre su marcador en el mapa), se resalta su ruta sugerida (línea punteada gris/azul) y su **recorrido real GPS** (línea sólida destacada), junto con una tarjeta que indica: Placa, Conductor, Velocidad en último reporte (`km/h`), Hora de último lote recibido y Km recorridos hasta el momento.
    - Indicador de auto-refresco cada 30 segundos + botón de refresco manual.
  - **Modo 2: Buscador e Historial de Viajes (Activos y Terminados):**
    - Buscador por Placa de UT, Cédula/Nombre del Conductor, Estado (`EN_CURSO`, `FINALIZADO`) y filtro rápido *"Con exceso de kilometraje (>10%)"*.
    - Al seleccionar un viaje del historial:
      - El mapa dibuja simultáneamente la **Ruta Sugerida por Google Maps** vs. el **Tracking Real GPS** (con puntos inspeccionables que muestran hora y velocidad en `km/h`).
      - Panel comparativo:
        - **Km Sugeridos (Google Maps):** `XX.XX km`
        - **Km Reales (Tracking GPS):** `YY.YY km` (con badge de alerta si supera el 10%)
        - **Kilometraje UT (Inicial -> Final):** `12,500 km -> 12,545.8 km`
        - **Justificación / Observación:** Campo de texto y botón para guardar la justificación solicitada al conductor en caso de discrepancia.

## 6. Criterios de Aceptación
- [ ] El Visor muestra en el mapa el recorrido de todas las UTs activas y se actualiza automáticamente.
- [ ] El usuario puede buscar cualquier viaje activo o terminado y visualizar su tracking completo en el mapa.
- [ ] Al finalizar un viaje, se comparan los Km sugeridos vs. Km reales GPS y el administrador puede registrar la justificación si el kilometraje fue mayor al debido.
