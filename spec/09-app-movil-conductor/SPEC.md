# SPEC 09: Aplicación Móvil para Conductores (Android Nativo 14+)

## 1. Objetivo
Desarrollar la aplicación móvil nativa para **Android 14+ (API 34+)** enfocada en los conductores, permitiéndoles ingresar con su **cédula** y la **placa de la UT**, consultar sus reservas disponibles para el día actual (sin restringir por la hora de inicio), iniciar el viaje, visualizar un **velocímetro en tiempo real** junto con el **mapa de ubicación y ruta recorrida**, capturar coordenadas y velocidad en **segundo plano** (incluso con la app minimizada o en otra aplicación) con persistencia local **offline-first** y envío en lotes cada **5 minutos** al backend, y finalmente terminar el viaje desde un botón.

## 2. Stack y Arquitectura Móvil (`apps/mobile`)
- **SO Objetivo:** Android 14+ (`minSdk = 34`, `targetSdk = 34+`).
- **Lenguaje y UI:** Kotlin + Jetpack Compose (Material 3).
- **Patrón Arquitectónico:** MVVM (`Screen Compose` -> `ViewModel` + `StateFlow` -> `Repository` -> `Room Database` + `Retrofit Service`).
- **Inyección de Dependencias:** Dagger Hilt.
- **Mapas y Ubicación:**
  - Google Maps SDK for Android (`maps-compose`).
  - Google Play Services Location (`FusedLocationProviderClient`).
- **Persistencia Local (Offline-First):**
  - `Room` (SQLite) con tabla `puntos_tracking_locales` para almacenar cada coordenada capturada junto con su velocidad e indicador de sincronización.
- **Ejecución en Segundo Plano:**
  - `ForegroundService` con `foregroundServiceType="location"` en `AndroidManifest.xml`, permisos `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_LOCATION` y `POST_NOTIFICATIONS`.

## 3. Pantallas y Flujo de Usuario

### 3.1 Pantalla 1: Ingreso y Búsqueda de Reservas del Día (`LoginReservasScreen`)
1. **Formulario de Identificación:**
   - Campo `Cédula de Identidad` (teclado numérico/texto).
   - Campo `Placa de la UT` (exactamente 7 caracteres alfanuméricos en mayúsculas, sin espacios ni guiones, ej. `ABC1001`).
   - Botón **"Buscar Reservas de Hoy"**.
2. **Comportamiento:**
   - Consume `POST /api/v1/auth/conductor/login`.
   - Guarda el `accessToken` JWT en `DataStore` / `EncryptedSharedPreferences`.
   - Muestra las reservas encontradas para ese conductor y esa UT correspondientes a la **fecha del día actual** (en estado `PROGRAMADA` o `EN_CURSO`), **sin bloquear ni validar la hora exacta de inicio programada**.
3. **Tarjeta de Reserva del Día:**
   - Muestra Nombre del Conductor, Placa y Modelo de la UT, Punto de Origen, Punto de Destino y Distancia sugerida por Google Maps (`km`).
   - Botón principal destacado: **"Iniciar Viaje"** (o **"Continuar Viaje en Curso"** si el viaje ya estaba `EN_CURSO`).

### 3.2 Pantalla 2: Viaje en Curso — Velocímetro y Mapa (`ViajeActivoScreen`)
Al pulsar **"Iniciar Viaje"**, la app invoca `POST /api/v1/viajes/:id/iniciar`, arranca el `TrackingForegroundService` y navega a la pantalla de viaje activo, compuesta por:
1. **Cabecera y Velocímetro en Tiempo Real:**
   - Indicador visual tipo **Velocímetro Digital / Gauge en Compose** que muestra la velocidad actual del vehículo en **`km/h`** (calculada desde `location.speed * 3.6f`), distancia acumulada en el viaje (`km`) y estado de conectividad/sincronización con el API (*"Sincronizado con API"* / *"Sin conexión con el API — X registros guardados en dispositivo, esperando conexión..."*).
2. **Mapa Interactivo Google Maps (`GoogleMap` Compose):**
   - Muestra en tiempo real la ubicación actual de la UT (marcador del vehículo con orientación).
   - Muestra los marcadores de **Origen** y **Destino** y la polilínea sugerida por Google Maps (color tenue/punteado).
   - Dibuja en tiempo real la **polilínea de la ruta que ha realizado la UT** (`Polyline` sólida de alto contraste construida a partir de los puntos guardados en Room para este viaje).
3. **Botón de Cierre:**
   - Botón destacado en la parte inferior: **"Terminar Viaje"** (con diálogo de confirmación para evitar toques accidentales).

## 4. Especificación Técnica del Tracking en Segundo Plano y Sincronización Cada 5 Minutos

### 4.1 Tabla Local Room (`PuntoTrackingLocalEntity`)
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `idPuntoCliente` | `String` (`PK`) | UUID v4 generado al capturar el punto |
| `viajeId` | `String` | ID del viaje activo |
| `lat` | `Double` | Latitud GPS |
| `lng` | `Double` | Longitud GPS |
| `velocidadKmh` | `Float` | Velocidad en `km/h` (`max(0f, location.speed * 3.6f)`) |
| `precisionMetros` | `Float` | `location.accuracy` |
| `capturadoEn` | `Long` | Epoch timestamp en milisegundos (convertido a ISO-8601 al enviar) |
| `sincronizado` | `Boolean` | `false` al crearse; pasa a `true` cuando el backend confirma recepción (`200/201`) |

### 4.2 Reglas del `TrackingForegroundService`
1. **Captura Continua en Segundo Plano:**
   - Solicita actualizaciones a `FusedLocationProviderClient` con `Priority.PRIORITY_HIGH_ACCURACY`, intervalo de **10 segundos** (`10_000 ms`) y desplazamiento mínimo de **15 metros**.
   - Aunque el conductor minimice la app, abra otra aplicación (ej. Waze, WhatsApp, llamadas) o bloquee la pantalla, el `ForegroundService` mantiene una notificación persistente (*"Viaje en curso - Registrando recorrido de UT [PLACA]"*) y continúa guardando cada punto en Room.
2. **Sincronización al Backend cada 5 Minutos y Espera por Conexión con el API (Offline-First):**
   - Un bucle periódico dentro del alcance de corrutinas del servicio (cada **5 minutos = 300,000 ms**) más un observador de conectividad de red (`ConnectivityManager.NetworkCallback`):
     - Consulta en Room todos los registros del `viajeId` con `sincronizado = false` ordenados por `capturadoEn ASC`.
     - Intenta el envío en lote a `POST /api/v1/viajes/:viajeId/tracking/batch`.
     - **Regla de Espera de Conexión con el API:** Si la app **no encuentra conexión con la API** (sin internet, timeout, red inestable o API no disponible), **no se descarta ningún dato**; la app mantiene los registros guardados localmente en Room y **esperará hasta tener conexión efectiva con la API** para reintentar el envío. Apenas se reanuda la conectividad con el API, se envían automáticamente todos los lotes acumulados en orden cronológico.
     - Al recibir confirmación exitosa del backend (`HTTP 200/201`), marca dichos registros como `sincronizado = true` en Room.
3. **Finalización del Viaje:**
   - Al presionar **"Terminar Viaje"**:
     1. Detiene la captura de nuevos puntos GPS.
     2. Toma todos los puntos pendientes (`sincronizado = false`) en Room e intenta enviarlos junto con la petición de cierre a `POST /api/v1/viajes/:viajeId/finalizar`.
     3. Si en el momento de terminar el viaje la app no encuentra conexión con la API, encola la tarea mediante `WorkManager` con política de reintentos continuos para que, en cuanto la app recupere conexión con la API, se envíen todos los registros pendientes y se finalice formalmente el viaje en el servidor, manteniendo al conductor informado en pantalla (*"Viaje finalizado localmente. Esperando conexión con el API para sincronizar registros..."*).
     4. Detiene el `TrackingForegroundService` y regresa a la pantalla de reservas.

## 5. Criterios de Aceptación
- [ ] El conductor ingresa solo con su cédula y la placa de la UT, visualizando las reservas del día actual sin restricción por hora de inicio.
- [ ] Durante el viaje se muestra en pantalla el velocímetro en `km/h`, la ubicación actual en Google Maps y el trazo de la ruta realizada.
- [ ] La app continúa registrando coordenadas y velocidad en segundo plano cuando el conductor cambia a otra aplicación.
- [ ] Los puntos se guardan localmente en Room y se suben al backend cada 5 minutos.
- [ ] Si la app no encuentra conexión con la API, espera a tener conexión disponible con la API para enviar los registros, garantizando cero pérdida de datos.
- [ ] Al pulsar "Terminar Viaje", se envían los puntos restantes (o se programan para envío en cuanto haya conexión con la API), se cierra el viaje y la UT actualiza su kilometraje y vuelve a estado `DISPONIBLE`.
