# SPEC 05: Módulo de Puntos Frecuentes

## 1. Objetivo
Permitir a los administradores seleccionar ubicaciones en un mapa interactivo de Google Maps y registrarlas como **Puntos Frecuentes**, de modo que puedan ser reutilizadas ágilmente como punto de origen o punto de destino en el módulo de Registro de Reserva de Viajes.

## 2. Modelo de Datos (`PuntoFrecuente`)
Colección: `puntos_frecuentes`

| Campo | Tipo | Requerido | Único | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | `ObjectId` | Sí | Sí | Identificador único |
| `nombre` | `string` | Sí | Sí | Nombre identificador del lugar (ej. `Planta Industrial Norte`, `Almacén Central`) |
| `direccion` | `string` | Sí | No | Dirección formateada obtenida por Geocoding o ingresada/ajustada por el usuario |
| `coordenadas` | `{ lat: number, lng: number }` | Sí | No | Latitud (`-90` a `90`) y Longitud (`-180` a `180`) |
| `descripcion` | `string` | No | No | Referencia o nota opcional del lugar |
| `activo` | `boolean` | Sí | No | `true` por defecto |
| `createdAt` | `Date` | Sí | No | Fecha de creación |
| `updatedAt` | `Date` | Sí | No | Fecha de actualización |

**Índices:**
- `{ nombre: 1 }` (Único)
- `{ activo: 1 }`

## 3. Reglas de Negocio
1. **Selección en Mapa de Google Maps:** El usuario puede hacer clic en cualquier punto del mapa de Google Maps (o buscar una dirección mediante el buscador de Google Places/Geocoder integrado en el mapa) para posicionar el marcador y obtener automáticamente sus coordenadas (`lat`, `lng`) y dirección sugerida.
2. **Reutilización en Reservas:** Todos los puntos frecuentes con `activo: true` se listan en los selectores de **Punto de Origen** y **Punto de Destino** dentro del módulo de Reserva de Viajes.
3. **Desactivación sin Pérdida de Historial:** Si un punto frecuente ya fue utilizado en reservas anteriores y se desea retirar del listado activo, se marca con `activo: false` (o se elimina si no tiene referencias), preservando las coordenadas snapshot en los viajes históricos.

## 4. Contratos de API (Backend NestJS)

| Método | Ruta | Rol | Descripción |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/puntos-frecuentes` | `ADMIN` | Lista puntos frecuentes paginados o filtrados por `search` y `activo`. |
| `GET` | `/api/v1/puntos-frecuentes/activos` | `ADMIN` | Lista todos los puntos frecuentes activos para el selector del módulo de Reservas. |
| `POST` | `/api/v1/puntos-frecuentes` | `ADMIN` | Registra un nuevo punto frecuente (`nombre`, `direccion`, `coordenadas`, `descripcion`). |
| `PATCH` | `/api/v1/puntos-frecuentes/:id` | `ADMIN` | Actualiza datos o coordenadas de un punto frecuente. |
| `DELETE` | `/api/v1/puntos-frecuentes/:id` | `ADMIN` | Desactiva o elimina un punto frecuente. |

## 5. Especificación UI Web (`apps/web`)
- **Ruta `/puntos-frecuentes`:**
  - **Vista Dividida (Split View Desktop / Tabs en Mobile):**
    - **Panel Izquierdo:** Lista/Tabla (`@tanstack/react-table`) de Puntos Frecuentes registrados con buscador, nombre, dirección, coordenadas y botones para centrar en el mapa, editar o desactivar.
    - **Panel Derecho:** Mapa interactivo de **Google Maps**:
      - Muestra marcadores de todos los puntos frecuentes registrados.
      - Al hacer clic en el mapa o usar el cuadro de búsqueda de lugares, coloca un pin arrastrable y abre/completa el formulario con `lat`, `lng` y `direccion` autocompletada mediante Geocoding inverso, permitiendo asignar el `nombre` y guardar el Punto Frecuente.

## 6. Criterios de Aceptación
- [ ] El usuario puede seleccionar un punto haciendo clic en el mapa de Google Maps y guardarlo con un nombre identificativo.
- [ ] Los puntos guardados se visualizan en el mapa y aparecen inmediatamente disponibles en el formulario de Registro de Reserva de Viajes.
