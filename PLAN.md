# PLAN.md — Plan de Implementación Basado en Especificaciones (SDD)

Este plan de implementación sigue la estrategia **Spec-Driven Development (SDD)**. Cada fase construye de manera incremental los módulos definidos en la carpeta `spec/` y mantiene trazabilidad directa hacia sus criterios de aceptación.

---

## Mapa de Dependencias entre Módulos (`spec/`)

```mermaid
flowchart TD
    S00["spec/00-arquitectura-general"] --> S01["spec/01-autenticacion"]
    S01 --> S02["spec/02-unidades-transporte"]
    S01 --> S03["spec/03-conductores"]
    S01 --> S05["spec/05-puntos-frecuentes"]
    S02 --> S04["spec/04-mantenimientos"]
    S02 --> S06["spec/06-reservas-viajes"]
    S03 --> S06
    S05 --> S06
    S06 --> S07["spec/07-visor-tracking"]
    S06 --> S09["spec/09-app-movil-conductor"]
    S07 --> S08["spec/08-dashboard"]
    S04 --> S08
    S09 --> S07
```

---

## Fase 1: Cimientos del Monorepo, Base de Datos, Seed y Autenticación (COMPLETADA)
**Specs Asociados:**
- [`spec/00-arquitectura-general/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/00-arquitectura-general/SPEC.md)
- [`spec/01-autenticacion/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/01-autenticacion/SPEC.md)

### Tareas:
1. [x] **Estructura Base y Docker (`spec/00`):**
   - Inicializar `apps/backend` (NestJS + TypeScript) y `apps/web` (Next.js App Router + TailwindCSS + `shadcn/ui` + `@tanstack/react-table`).
   - Configurar conexión `@nestjs/mongoose` compatible con Azure CosmosDB para MongoDB y variables `.env.example`.
   - Configurar Swagger (`/api/docs`), `ValidationPipe` global, filtro estándar de excepciones HTTP y CORS.
   - Crear `docker-compose.yml` en la raíz con contenedores `mongodb`, `backend` y `web`.
2. [x] **Autenticación Dual y Seed (`spec/01`):**
   - Implementar esquema `UsuarioAdmin` y servicio de `SeedService` (creación idempotente de Admin por defecto + catálogo base del checklist de mantenimiento).
   - Implementar `JwtStrategy`, `JwtAuthGuard` y `RolesGuard` (`ADMIN`, `GESTOR` y `CONDUCTOR`).
   - Crear endpoints `POST /api/v1/auth/admin/login`, `POST /api/v1/auth/conductor/login` y `GET /api/v1/auth/me`.
   - Implementar módulo CRUD de Administración de Usuarios (`/api/v1/usuarios`) restringido exclusivamente a rol `ADMIN`.
   - Habilitar rol `GESTOR` con acceso a todos los módulos operativos de flota (UTs, Conductores, Puntos, Reservas, Mantenimiento, Visor, Dashboard) y restricción del módulo de usuarios.
   - Implementar en `apps/web` la pantalla `/login`, almacenamiento de sesión JWT, layout administrativo con navegación lateral filtrada por rol y módulo `/usuarios`.

### Entregable y Verificación de Fase 1:
- [x] Contenedores Docker corriendo en los puertos `10101` (web), `10102` (backend REST API + Swagger) y `10103` (MongoDB).

---

## Fase 2: Catálogos Base de Flota (Unidades de Transporte, Conductores y Puntos Frecuentes) (COMPLETADA)
**Specs Asociados:**
- [`spec/02-unidades-transporte/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/02-unidades-transporte/SPEC.md)
- [`spec/03-conductores/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/03-conductores/SPEC.md)
- [`spec/05-puntos-frecuentes/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/05-puntos-frecuentes/SPEC.md)

### Tareas:
1. [x] **Módulo de Unidades de Transporte (`spec/02`):**
   - Backend: Esquema `UnidadTransporte`, validaciones de placa única, tipos de UT (`CAMION`, `SEDAN`, `CAMIONETA_SUV`, `CAMIONETA_PICKUP`, `VAN`, `MOTO`) y bloqueo de cambio manual de estado si la UT está en `VIAJANDO` o `EN_MANTENIMIENTO`.
   - Web (`/unidades-transporte`): Tabla con `@tanstack/react-table` (filtros por estado y tipo, buscador, paginación) y modal de creación/edición con bloqueo visual del campo estado cuando corresponda.
2. [x] **Módulo de Conductores (`spec/03`):**
   - Backend: Esquema `Conductor` con índice único en `cedula` y endpoints CRUD (`/api/v1/conductores`).
   - Web (`/conductores`): Tabla con `@tanstack/react-table` y modal de registro/edición de conductores (`nombre`, `apellido`, `cedula`, `telefono`, `activo`).
3. [x] **Módulo de Puntos Frecuentes (`spec/05`):**
   - Backend: Esquema `PuntoFrecuente` (`nombre`, `direccion`, `coordenadas { lat, lng }`) y endpoints CRUD (`/api/v1/puntos-frecuentes`).
   - Web (`/puntos-frecuentes`): Vista dividida con listado en TanStack Table e integración de **Google Maps** para marcar puntos en el mapa, obtener dirección por Reverse Geocoding y guardarlos como puntos frecuentes.

---

## Fase 3: Gestión de Mantenimientos y Reserva de Viajes (COMPLETADA)
**Specs Asociados:**
- [`spec/04-mantenimientos/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/04-mantenimientos/SPEC.md)
- [`spec/06-reservas-viajes/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/06-reservas-viajes/SPEC.md)

### Tareas:
1. [x] **Módulo de Reserva de Viajes (`spec/06`):**
   - Backend: Esquema `ReservaViaje` y endpoints para crear, listar, reasignar y cancelar reservas, validando que la UT esté en estado `DISPONIBLE` o `VIAJANDO` (nunca `EN_MANTENIMIENTO` ni `INACTIVA`).
   - Web (`/reservas-viajes`): Listado de reservas y formulario con mapa interactivo de Google Maps que permite elegir **Origen** y **Destino** (combinando Puntos Frecuentes o selección directa en mapa), trazando la ruta y calculando automáticamente los **kilómetros sugeridos por Google Maps** (`kmSugeridosGoogle`).
2. [x] **Módulo de Mantenimientos (`spec/04`):**
   - Backend: Esquemas `CatalogoTareaMantenimiento` y `Mantenimiento`. Endpoints para abrir mantenimiento en estado `BORRADOR` (cambiando la UT a `EN_MANTENIMIENTO`), actualizar tareas del checklist base + tareas manuales, gestionar reservas pendientes afectadas (cancelar o reasignar) y finalizar el mantenimiento registrando `observacionesPersonal` y pasando la UT a `DISPONIBLE` o `INACTIVA`.
   - Web (`/mantenimientos`): Vista de mantenimientos en borrador e historial, formulario con checklist base + adición dinámica de tareas manuales, alerta de reservas pendientes y modal de cierre de mantenimiento con selección del estado final de la UT.

---

## Fase 4: Telemetría Backend, Visor de Unidades de Transporte y Dashboard (COMPLETADA)
**Specs Asociados:**
- [`spec/07-visor-tracking/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/07-visor-tracking/SPEC.md)
- [`spec/08-dashboard/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/08-dashboard/SPEC.md)

### Tareas:
1. [x] **Endpoints de Ciclo de Viaje y Tracking (`spec/07`):**
   - Backend: Esquema `PuntoTrackingViaje` con índice de idempotencia `idPuntoCliente`.
   - Endpoints `/api/v1/viajes/:viajeId/iniciar`, `/api/v1/viajes/:viajeId/tracking/batch`, `/api/v1/viajes/:viajeId/finalizar` (con cálculo Haversine, suma al odómetro y detección >10%).
   - Endpoints `/api/v1/visor/activos`, `/api/v1/visor/viajes`, `/api/v1/visor/viajes/:id/tracking`, `/api/v1/visor/viajes/:id/justificacion`.
2. [x] **Visor Web e Historial de Viajes (`spec/07`):**
   - Web (`/visor`): Seguimiento en tiempo real con polling de 30s, comparador de rutas y registro de justificaciones de desvíos.
3. [x] **Dashboard y KPIs (`spec/08`):**
   - Backend: Endpoint `GET /api/v1/dashboard/resumen`.
   - Web (`/dashboard`): 4 KPIs en vivo (`UTs Disponibles`, `UTs Viajando`, `UTs en Mantenimiento`, `UTs Inactivas`), resumen de viajes y alertas de exceso de kilometraje.

---

## Fase 5: Aplicación Móvil Android para Conductores (COMPLETADA)
**Specs Asociados:**
- [`spec/09-app-movil-conductor/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/09-app-movil-conductor/SPEC.md)
- [`spec/01-autenticacion/SPEC.md`](file:///h:/Repos/GestionUnidadesTransporte/spec/01-autenticacion/SPEC.md)

### Tareas:
1. [x] **Proyecto Base Android (`apps/mobile`):**
   - Configurado proyecto Gradle Kotlin (`minSdk = 34`, Android 14+), Jetpack Compose (Material 3), Hilt, Retrofit + OkHttp (con interceptor JWT Bearer), Room Database y Google Maps Compose SDK. Compilación y empaquetado exitoso de `app-debug.apk`.
2. [x] **Pantalla de Ingreso y Reservas del Día (`LoginReservasScreen` + `LoginReservasViewModel`):**
   - Ingreso por `cédula` y `placa` de la UT, autenticación passwordless emitiendo JWT, búsqueda de reservas del día actual (sin bloquear por hora de inicio) y botón **"Iniciar Viaje"** (o "Continuar Viaje en Curso").
3. [x] **Servicio en Segundo Plano y Sincronización Offline-First (`TrackingForegroundService` + Room):**
   - Permisos de ubicación en primer y segundo plano (`FOREGROUND_SERVICE_LOCATION`, `POST_NOTIFICATIONS`, `ACCESS_BACKGROUND_LOCATION`).
   - Captura continua GPS (`lat`, `lng`) y velocidad (`km/h`) cada 10s / 15m guardándolas en Room (`puntos_tracking_locales`).
   - Sincronizador en lotes cada **5 minutos** hacia `/api/v1/viajes/:id/tracking/batch` más detector de conectividad (`ConnectivityManager.NetworkCallback`); si no encuentra conexión con la API, mantiene intactos los puntos locales en Room y espera a restablecer conexión con el API para vaciar los lotes en orden cronológico sin pérdida de datos.
4. [x] **Pantalla de Viaje Activo (`ViajeActivoScreen` + `ViajeActivoViewModel`):**
   - Componente de **Velocímetro en tiempo real (`km/h`)** en Jetpack Compose (`SpeedometerGauge`) con cuadrante animado, agujas y lectura digital.
   - Componente `TripMapView` (`GoogleMap` Compose) mostrando posición actual de la UT con marcador vehicular, marcadores de Origen/Destino y polilínea de alto contraste de la ruta real recorrida.
   - Indicador visual `SyncStatusBadge` con conteo de puntos pendientes locales y estado de conexión con el API.
   - Botón **"Terminar Viaje"** con confirmación, vaciado de puntos pendientes hacia `/api/v1/viajes/:id/finalizar`, detención del `ForegroundService` y diálogo resumen con kilometraje real vs. sugerido y alerta de desviación.

### Entregable y Verificación de Fase 5:
- [x] Compilación y generación exitosa del paquete Android nativo: `apps/mobile/app/build/outputs/apk/debug/app-debug.apk` listo para despliegue en emuladores y dispositivos Android 14+ (API 34+).
- [x] Integración de contratos REST API compartidos con backend NestJS (`POST /auth/conductor/login`, `GET /viajes/hoy`, `POST /viajes/:id/iniciar`, `POST /viajes/:id/tracking/batch`, `POST /viajes/:id/finalizar`).
- [x] Garantía Offline-First: retención local en Room y espera pasiva/activa por conexión al API para transmitir todos los lotes sin pérdida de telemetría.
