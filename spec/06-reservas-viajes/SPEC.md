# SPEC 06: Módulo de Registro de Reserva de Viajes

## 1. Objetivo
Permitir la programación de Reservas de Viajes asignando un Conductor y una Unidad de Transporte (UT), definiendo la fecha y hora de inicio del viaje, seleccionando el Punto de Origen y el Punto de Destino en un mapa de Google Maps (o desde la lista de Puntos Frecuentes) y calculando automáticamente el kilometraje sugerido por Google Maps para la ruta.

## 2. Modelo de Datos (`ReservaViaje`)
Colección: `reservas_viajes`

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `_id` | `ObjectId` | Sí | Identificador único de la reserva/viaje |
| `utId` | `ObjectId` | Sí | Referencia a `UnidadTransporte` |
| `placaUt` | `string` | Sí | Snapshot de la placa de la UT (ej. `ABC-123`) |
| `conductorId` | `ObjectId` | Sí | Referencia a `Conductor` |
| `cedulaConductor` | `string` | Sí | Snapshot de la cédula del conductor |
| `nombreConductor` | `string` | Sí | Snapshot del nombre completo del conductor |
| `fechaHoraInicioProgramada` | `Date` | Sí | Fecha y hora programada para el inicio del viaje |
| `origen` | `UbicacionRuta` | Sí | `{ nombre?: string, direccion: string, lat: number, lng: number, puntoFrecuenteId?: ObjectId }` |
| `destino` | `UbicacionRuta` | Sí | `{ nombre?: string, direccion: string, lat: number, lng: number, puntoFrecuenteId?: ObjectId }` |
| `kmSugeridosGoogle` | `number` | Sí | Distancia sugerida por Google Maps en kilómetros (precisión 2 decimales) |
| `duracionSugeridaMinutos` | `number` | No | Tiempo estimado por Google Maps en minutos |
| `polylineSugerida` | `string` | No | Polilínea codificada (`encodedPolyline`) de la ruta sugerida por Google Maps |
| `estado` | `enum` | Sí | `PROGRAMADA`, `EN_CURSO`, `FINALIZADO`, `CANCELADA` |
| `kilometrajeUtInicial` | `number` | No | Kilometraje de la UT al momento en que el conductor inicia el viaje |
| `kilometrajeUtFinal` | `number` | No | Kilometraje de la UT tras sumar la distancia real al terminar el viaje |
| `kmRealesGps` | `number` | No | Distancia real recorrida calculada según los puntos GPS al finalizar |
| `porcentajeDesviacionKm` | `number` | No | `((kmRealesGps - kmSugeridosGoogle) / kmSugeridosGoogle) * 100` |
| `excedeUmbralKm` | `boolean` | No | `true` si `porcentajeDesviacionKm > 10` |
| `justificacionExcesoKm` | `string` | No | Justificación/observación registrada por el administrador si hubo exceso de km |
| `fechaHoraInicioReal` | `Date` | No | Timestamp exacto cuando el conductor pulsó "Iniciar viaje" en la app |
| `fechaHoraFinReal` | `Date` | No | Timestamp exacto cuando el conductor pulsó "Terminar viaje" en la app |
| `createdAt` | `Date` | Sí | Fecha de creación de la reserva |
| `updatedAt` | `Date` | Sí | Fecha de última actualización |

**Índices:**
- `{ cedulaConductor: 1, placaUt: 1, estado: 1, fechaHoraInicioProgramada: 1 }`
- `{ utId: 1, estado: 1 }`
- `{ estado: 1, fechaHoraInicioProgramada: -1 }`

## 3. Reglas de Negocio
1. **Validación de Disponibilidad de UT y Conductor:**
   - Solo se pueden seleccionar UTs cuyo estado sea `DISPONIBLE` o `VIAJANDO`. No se permite crear una reserva con una UT `EN_MANTENIMIENTO` ni `INACTIVA`.
   - Solo se pueden seleccionar Conductores con `activo: true`.
   - Se solicita únicamente `fechaHoraInicioProgramada` (sin hora de fin) y se permiten múltiples reservas para la misma UT o conductor en el mismo día.
2. **Selección de Origen y Destino:**
   - El administrador puede elegir el **Punto de Origen (Salida)** y el **Punto de Destino (Llegada)** de dos maneras combinables libremente:
     - Seleccionándolo de un desplegable de **Puntos Frecuentes** registrados en el Módulo 05.
     - Marcándolo directamente con clic o buscador en el mapa interactivo de **Google Maps**.
3. **Cálculo de Kilometraje Sugerido por Google Maps:**
   - Una vez definidos Origen y Destino, el sistema consulta `DirectionsService` / Google Routes API, traza la ruta sugerida sobre el mapa y obtiene la distancia en kilómetros (`kmSugeridosGoogle`), la duración estimada y la polilínea codificada (`polylineSugerida`).
   - El kilometraje sugerido se muestra de forma destacada en el formulario y se guarda junto con la reserva.
4. **Reasignación y Cancelación:**
   - Una reserva en estado `PROGRAMADA` puede ser cancelada (`CANCELADA`) o reasignada a otra UT disponible (por ejemplo, cuando la UT original entra en mantenimiento).

## 4. Contratos de API (Backend NestJS)

| Método | Ruta | Rol | Descripción |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/reservas-viajes` | `ADMIN` | Lista reservas/viajes paginados con filtros por `estado`, `placaUt`, `cedulaConductor`, `fechaDesde`, `fechaHasta`. |
| `GET` | `/api/v1/reservas-viajes/:id` | `ADMIN`, `CONDUCTOR` | Obtiene el detalle completo de una reserva/viaje. |
| `POST` | `/api/v1/reservas-viajes` | `ADMIN` | Crea una nueva reserva de viaje en estado `PROGRAMADA`. |
| `PATCH` | `/api/v1/reservas-viajes/:id` | `ADMIN` | Permite reasignar UT/Conductor o modificar fecha/ruta mientras esté `PROGRAMADA`. |
| `PATCH` | `/api/v1/reservas-viajes/:id/cancelar` | `ADMIN` | Cancela una reserva en estado `PROGRAMADA`. |

## 5. Especificación UI Web (`apps/web`)
- **Ruta `/reservas-viajes`:**
  - **Listado de Reservas (`@tanstack/react-table`):**
    - Columnas: Fecha/Hora Inicio, Placa UT, Conductor (Nombre + Cédula), Origen -> Destino, Km Sugeridos, Estado (`PROGRAMADA`, `EN_CURSO`, `FINALIZADO`, `CANCELADA`), Acciones (Ver en Mapa, Reasignar, Cancelar).
- **Ruta o Modal Amplio `/reservas-viajes/nueva`:**
  - **Columna Izquierda (Datos de la Reserva):**
    - Selector de Unidad de Transporte (filtra solo UTs en estado `DISPONIBLE` o `VIAJANDO`, mostrando placa, tipo y km actual).
    - Selector de Conductor activo (buscable por nombre o cédula).
    - Selector de Fecha y Hora de inicio del viaje.
    - Selector de **Punto de Origen**: opción de elegir un Punto Frecuente o botón *"Marcar origen en el mapa"*.
    - Selector de **Punto de Destino**: opción de elegir un Punto Frecuente o botón *"Marcar destino en el mapa"*.
    - Tarjeta de resumen de ruta que muestra en grande: **Kilometraje sugerido por Google Maps (`XX.XX km`)** y tiempo estimado.
  - **Columna Derecha (Mapa Interactivo Google Maps):**
    - Muestra marcador `A` (Origen), marcador `B` (Destino) y la polilínea de la ruta sugerida por Google Maps.

## 6. Criterios de Aceptación
- [ ] El usuario puede elegir Origen y Destino tanto desde la lista de Puntos Frecuentes como marcándolos en el mapa de Google Maps.
- [ ] Al definir ambos puntos, se traza la ruta en el mapa y se muestra y almacena el kilometraje sugerido por Google Maps.
- [ ] No se permite reservar una UT que esté `EN_MANTENIMIENTO` o `INACTIVA`.
