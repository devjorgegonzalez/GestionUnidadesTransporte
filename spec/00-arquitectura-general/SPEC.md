# SPEC 00: Arquitectura General, Base de Datos y Entorno Docker

## 1. Objetivo
Definir la arquitectura base del sistema, las convenciones del API REST en NestJS, la configuración de persistencia compatible con Azure CosmosDB para MongoDB, la estructura base de la aplicación Web en Next.js y la configuración del entorno de pruebas en Docker.

## 2. Arquitectura del Sistema
El sistema se compone de tres aplicaciones desacopladas que se comunican a través de una API REST asegurada con JWT Bearer Token:
1. **`apps/backend` (NestJS):** Expone endpoints REST bajo el prefijo global `/api/v1` y documentación interactiva OpenAPI/Swagger en `/api/docs`.
2. **`apps/web` (Next.js App Router):** Panel administrativo para gestión de flota, conductores, mantenimientos, puntos frecuentes, reservas de viajes, visor de tracking y dashboard.
3. **`apps/mobile` (Android 14+ / Kotlin / Jetpack Compose):** Aplicación móvil para conductores con soporte de captura GPS en segundo plano (`ForegroundService`) y sincronización offline-first cada 5 minutos.

## 3. Estándares del Backend (NestJS)
- **Prefijo Global:** `/api/v1`
- **Formato de Respuesta Estándar:**
  - Éxito individual/acción: `{ data: T, message?: string }`
  - Éxito paginado: `{ data: T[], meta: { total: number, page: number, limit: number, totalPages: number } }`
  - Error estándar HTTP: `{ statusCode: number, error: string, message: string | string[], timestamp: string, path: string }`
- **Documentación Swagger:** Todos los controladores deben usar `@ApiTags`, `@ApiBearerAuth`, `@ApiOperation` y DTOs anotados con `@ApiProperty`.

## 4. Configuración de Base de Datos (Azure CosmosDB para MongoDB)
- **Driver / ODM:** `@nestjs/mongoose` (`mongoose`).
- **Reglas de Compatibilidad con CosmosDB MongoDB API:**
  - Soportar cadenas de conexión con `retryWrites=false` y `tls=true` en producción, y conexión directa `mongodb://mongodb:27017/gestion_ut` en entorno Docker de prueba.
  - Todos los esquemas deben definir `timestamps: true` (`createdAt`, `updatedAt`).
  - Evitar operadores de agregación no soportados por CosmosDB RU/vCore; priorizar consultas indexadas simples por campos (`placa`, `cedula`, `estado`, `fechaInicio`).

## 5. Variables de Entorno
### 5.1 Backend (`apps/backend/.env`)
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/gestion_ut
JWT_SECRET=super_secret_jwt_key_change_in_prod
JWT_EXPIRES_IN_ADMIN=8h
JWT_EXPIRES_IN_DRIVER=24h
ADMIN_DEFAULT_EMAIL=admin@empresa.com
ADMIN_DEFAULT_PASSWORD=Admin123*
GOOGLE_MAPS_SERVER_API_KEY=your_google_maps_api_key
CORS_ORIGIN=http://localhost:10101
```

### 5.2 Frontend Web (`apps/web/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:10102/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 6. Orquestación Docker (`docker-compose.yml`)
El ambiente de prueba se levanta con un único comando (`docker compose up --build`).
**Regla de Exposición de Puertos:** Todos los puertos expuestos en el host deben ubicarse estrictamente en el rango **`10101 - 10109`**:
- **`web`:** Build multi-stage de `apps/web`, puerto expuesto `10101:3000` (`http://localhost:10101`), dependiente de `backend`.
- **`backend`:** Build multi-stage de `apps/backend`, puerto expuesto `10102:4000` (`http://localhost:10102`, Swagger en `http://localhost:10102/api/docs`), dependiente del healthcheck de `mongodb`. Ejecuta el seed inicial al arrancar.
- **`mongodb`:** Imagen `mongo:7`, puerto expuesto `10103:27017`, volumen persistente `mongodb_data` y healthcheck.
- **Rango `10104 - 10109`:** Reservado para servicios o contenedores de soporte adicionales según necesidad.

## 7. Criterios de Aceptación
- [ ] `docker compose up --build` levanta los 3 servicios sin errores de compilación ni conexión.
- [ ] Los contenedores se exponen al host exclusivamente dentro del rango de puertos `10101 - 10109`.
- [ ] Swagger UI está disponible en `http://localhost:10102/api/docs` con soporte de botón `Authorize` (Bearer JWT).
- [ ] La aplicación web está disponible en `http://localhost:10101/login` y se comunica con el backend en `http://localhost:10102/api/v1`.
- [ ] El seed inicial crea el usuario administrador por defecto y el catálogo base de checklist de mantenimiento si la base de datos está vacía.
