# GEMINI.md — Guía Maestra y Reglas del Proyecto (SDD)

## 1. Descripción General del Proyecto
Sistema integral para la **Gestión de Unidades de Transporte (UT)** de una empresa de servicios de instalación de equipos industriales. Reemplaza el control manual en hojas de cálculo (Excel) por una plataforma centralizada compuesta por una **Aplicación Web Administrativa**, una **Aplicación Móvil Android para Conductores** y un **Backend API REST compartido**.

## 2. Glosario de Dominio
- **Unidad de Transporte (UT):** Vehículo utilizado para el transporte de equipos industriales o personal. Tipos permitidos: `CAMION`, `SEDAN`, `CAMIONETA_SUV`, `CAMIONETA_PICKUP`, `VAN`, `MOTO`.
- **Conductor:** Persona registrada en el sistema a la cual se le asigna una UT para realizar un viaje.
- **Punto Frecuente:** Ubicación geográfica pre-registrada (nombre, dirección, latitud, longitud) reutilizable como punto de origen o destino al programar reservas de viajes.
- **Reserva de Viaje / Viaje:** Asignación programada de una UT y un Conductor para una fecha/hora de inicio con un punto de origen y un punto de destino, que calcula la distancia sugerida con Google Maps y registra el recorrido real mediante telemetría GPS desde la app móvil.
- **Mantenimiento:** Orden de trabajo sobre una UT que incluye un checklist base de tareas preventivas/correctivas más tareas adicionales manuales, bloqueando la disponibilidad de la UT mientras está activa.

## 3. Metodología SDD (Spec-Driven Development)
Este proyecto se desarrolla estrictamente bajo **Spec-Driven Development (SDD)**:
1. **Fuente de la Verdad:** Toda funcionalidad está definida en su especificación correspondiente dentro de la carpeta `spec/<modulo>/SPEC.md`.
2. **Trazabilidad:** Ningún endpoint, pantalla web o pantalla móvil debe implementarse fuera de lo estipulado en su `SPEC.md`. Si un requerimiento cambia, primero se actualiza el `SPEC.md` y el `PLAN.md`.
3. **Aislamiento Modular:** Cada módulo especifica su modelo de datos, reglas de negocio, contratos de API (REST + Swagger), interfaz Web y/o interfaz Móvil y criterios de aceptación.
4. **Control de Ejecución:** No se debe generar código de aplicación fuera de las fases autorizadas del `PLAN.md`.

## 4. Estructura del Monorepo
```text
GestionUnidadesTransporte/
├── GEMINI.md                                  # Reglas de arquitectura, dominio y SDD
├── PLAN.md                                    # Plan de implementación por fases basado en specs
├── docker-compose.yml                         # Orquestación local (mongodb, backend, web)
├── spec/                                      # Especificaciones modulares SDD
│   ├── 00-arquitectura-general/SPEC.md
│   ├── 01-autenticacion/SPEC.md
│   ├── 02-unidades-transporte/SPEC.md
│   ├── 03-conductores/SPEC.md
│   ├── 04-mantenimientos/SPEC.md
│   ├── 05-puntos-frecuentes/SPEC.md
│   ├── 06-reservas-viajes/SPEC.md
│   ├── 07-visor-tracking/SPEC.md
│   ├── 08-dashboard/SPEC.md
│   └── 09-app-movil-conductor/SPEC.md
└── apps/                                      # (A crearse en fases de implementación)
    ├── backend/                               # NestJS + Mongoose + Swagger + JWT
    ├── web/                                   # Next.js (App Router) + shadcn/ui + TanStack Table + TailwindCSS
    └── mobile/                                # Android Nativo (API 34 / Android 14+) + Kotlin + Jetpack Compose + MVVM
```

## 5. Stack Tecnológico y Convenciones Técnicas

### 5.1 Backend (`apps/backend`)
- **Framework:** NestJS (TypeScript estricto).
- **Documentación API:** `@nestjs/swagger` expuesto en `/api/docs`.
- **Seguridad y Autenticación:** `@nestjs/jwt` y `passport-jwt` con esquema `Bearer <token>`.
  - **Admin Web:** Login mediante `email` y `password` (hash con `bcrypt`).
  - **Conductor Móvil:** Login sin contraseña mediante `cedula` del conductor y `placa` de la UT, emitiendo un JWT con claims `{ sub: conductorId, rol: 'CONDUCTOR', cedula, utId, placa }`.
- **Validación:** `class-validator` y `class-transformer` con `ValidationPipe` global (`whitelist: true`, `forbidNonWhitelisted: true`).

### 5.2 Base de Datos (`Azure CosmosDB para MongoDB`)
- **ODM:** `@nestjs/mongoose` (Mongoose).
- **Compatibilidad CosmosDB:**
  - Uso de cadena de conexión compatible con el wire protocol de MongoDB (`retryWrites=false` en CosmosDB RU/vCore).
  - Índices simples y compuestos explícitos compatibles con CosmosDB.
  - Coordenadas geográficas almacenadas como `{ lat: number, lng: number }` y dirección formateada para evitar restricciones de índices geoespaciales especiales no requeridos.
- **Seed Inicial Automático:** Al iniciar el backend, un servicio de seed idempotente garantiza la existencia del usuario Administrador por defecto y del catálogo de ítems del checklist base de mantenimiento.

### 5.3 Frontend Web (`apps/web`)
- **Framework:** Next.js (App Router, TypeScript).
- **UI & Estilos:** TailwindCSS + componentes `shadcn/ui`.
- **Tablas de Datos:** `@tanstack/react-table` con paginación, búsqueda, ordenamiento y filtros por estado.
- **Mapas:** `@vis.gl/react-google-maps` o `@react-google-maps/api` consumiendo Google Maps JavaScript API y Routes/Directions API.

### 5.4 App Móvil (`apps/mobile`)
- **Plataforma:** Android nativo, `minSdk = 34` (Android 14+).
- **Lenguaje y UI:** Kotlin + Jetpack Compose (Material 3).
- **Arquitectura:** MVVM (`UI Compose` -> `ViewModel` + `StateFlow` -> `Repository` -> `Room DAO` / `Retrofit API`).
- **Inyección de Dependencias:** Hilt (`Dagger-Hilt`).
- **Tracking en Segundo Plano y Offline-First:**
  - `ForegroundService` con tipo `location` (`FOREGROUND_SERVICE_LOCATION`) y notificación persistente para que Android 14+ mantenga la captura activa aunque el conductor cambie de aplicación o bloquee la pantalla.
  - Captura GPS local mediante `FusedLocationProviderClient` cada **10 segundos** (o desplazamiento mínimo de 15 metros), almacenando coordenadas (`lat`, `lng`), velocidad (`km/h`) y `timestamp` en base de datos local **Room (SQLite)** con flag `sincronizado = false`.
  - Sincronización en lote (**batch upload**) hacia el backend cada **5 minutos** mediante un `CoroutineWorker` / temporizador del servicio, y vaciado inmediato (`flush`) al presionar **"Terminar viaje"**. Si la app no encuentra conexión con la API (sin internet o API no disponible), los puntos permanecen almacenados localmente en Room y la app esperará a tener conexión efectiva con la API para enviar todos los registros acumulados sin pérdida de datos.

### 5.5 Ambiente de Prueba (`Docker`)
- Orquestado mediante `docker-compose.yml` en la raíz del proyecto. **Regla de puertos:** Todos los contenedores deben quedar expuestos hacia el host dentro del rango **`10101 - 10109`**:
  1. `web` (Next.js): Puerto expuesto `10101` (`10101:3000` o `http://localhost:10101`).
  2. `backend` (NestJS API REST + Swagger): Puerto expuesto `10102` (`10102:4000` o `http://localhost:10102`), con Swagger expuesto en `http://localhost:10102/api/docs`.
  3. `mongodb` (Mongo 7 emulando CosmosDB MongoDB API): Puerto expuesto `10103` (`10103:27017` o `mongodb://localhost:10103/gestion_ut`).
  4. Puertos `10104 - 10109` reservados para servicios o herramientas auxiliares en caso de requerirse.

## 6. Invariantes y Reglas de Negocio Globales
1. **Estados de la UT:** `DISPONIBLE`, `VIAJANDO`, `EN_MANTENIMIENTO`, `INACTIVA`.
2. **Bloqueo de Cambio Manual de Estado de UT:** El estado de una UT **no puede cambiarse manualmente** desde el CRUD de Unidades de Transporte si su estado actual es `VIAJANDO` (tiene un viaje activo) o `EN_MANTENIMIENTO` (tiene una orden de mantenimiento en borrador/activa).
3. **Ciclo de Vida de Mantenimiento:**
   - Al crear un registro de mantenimiento sobre una UT, el formulario queda en estado `BORRADOR` (en curso) y cambia automáticamente la UT a `EN_MANTENIMIENTO`.
   - Si la UT tenía reservas pendientes (`PROGRAMADA`), el sistema alerta al administrador mostrándolas y permitiéndole reasignar otra UT o cancelar dichas reservas.
   - Al finalizar el mantenimiento y registrar las observaciones del personal técnico, el administrador debe elegir explícitamente si la UT pasa a estado `DISPONIBLE` o `INACTIVA`.
4. **Reglas de Reserva de Viajes:**
   - Solo se pueden asignar UTs cuyo estado actual sea `DISPONIBLE` o `VIAJANDO` (nunca `EN_MANTENIMIENTO` ni `INACTIVA`).
   - Se solicita Fecha y Hora de inicio, Conductor, UT, Punto de Origen y Punto de Destino (seleccionables desde Puntos Frecuentes o directamente en el mapa de Google Maps).
   - Se permite más de una reserva en el mismo día para una misma UT sin bloquear por hora de llegada.
5. **Flujo del Conductor en App Móvil:**
   - Ingresa `cédula` y `placa`. El sistema busca las reservas en estado `PROGRAMADA` (o `EN_CURSO` si retoma sesión) correspondientes a la fecha actual del día (sin bloquear por la hora exacta de inicio).
   - Al pulsar **"Iniciar viaje"**, la reserva pasa a `EN_CURSO` y la UT pasa a `VIAJANDO`.
   - Al pulsar **"Terminar viaje"**, la app envía los puntos GPS pendientes, el backend calcula la distancia total real recorrida (fórmula de Haversine sobre la secuencia de puntos GPS), suma dicha distancia al `kilometraje` acumulado de la UT, marca el viaje como `FINALIZADO` y devuelve la UT al estado `DISPONIBLE`.
6. **Control de Desviación de Kilometraje:**
   - En el Visor / Historial de Viajes Web se compara el **Kilometraje Sugerido por Google Maps** vs. el **Kilometraje Real GPS**. Si el kilometraje real supera en más de un **10%** al sugerido, el sistema marca el viaje con alerta de desviación y permite al Administrador registrar la justificación/observación del conductor.
