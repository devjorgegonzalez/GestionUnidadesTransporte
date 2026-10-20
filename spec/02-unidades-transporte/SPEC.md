# SPEC 02: Módulo de Unidades de Transporte (UT)

## 1. Objetivo
Permitir el registro, consulta, edición y control de estado de las Unidades de Transporte (UT) desde la aplicación Web, garantizando la integridad de las reglas de transición de estado frente a viajes activos y mantenimientos en curso.

## 2. Modelo de Datos (`UnidadTransporte`)
Colección: `unidades_transporte`

| Campo | Tipo | Requerido | Único | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | `ObjectId` | Sí | Sí | Identificador único |
| `placa` | `string` | Sí | Sí | Placa normalizada en mayúsculas (ej. `ABC-123`) |
| `marca` | `string` | Sí | No | Marca del vehículo (ej. `Toyota`, `Ford`) |
| `modelo` | `string` | Sí | No | Modelo del vehículo (ej. `Hilux`, `Transit`) |
| `anio` | `number` | Sí | No | Año de fabricación (ej. `1990` - `año actual + 1`) |
| `tipo` | `enum` | Sí | No | `CAMION`, `SEDAN`, `CAMIONETA_SUV`, `CAMIONETA_PICKUP`, `VAN`, `MOTO` |
| `capacidadPersonas` | `number` | Sí | No | Entero positivo (`>= 1`) |
| `kilometraje` | `number` | Sí | No | Kilometraje acumulado actual (`>= 0`, permite decimales de precisión 2) |
| `estado` | `enum` | Sí | No | `DISPONIBLE`, `VIAJANDO`, `EN_MANTENIMIENTO`, `INACTIVA` |
| `createdAt` | `Date` | Sí | No | Fecha de registro |
| `updatedAt` | `Date` | Sí | No | Fecha de última modificación |

**Índices:**
- `{ placa: 1 }` (Único)
- `{ estado: 1 }`

## 3. Reglas de Negocio
1. **Normalización de Placa:** Al crear o editar una UT, la `placa` se convierte a mayúsculas y se eliminan espacios al inicio/final. No pueden existir dos UTs con la misma placa (`409 Conflict`).
2. **Estados Iniciales Permitidos al Crear:** Al registrar una nueva UT manualmente, el usuario solo puede elegir entre `DISPONIBLE` o `INACTIVA` (por defecto `DISPONIBLE`). Los estados `VIAJANDO` y `EN_MANTENIMIENTO` son activados exclusivamente por los módulos de Viajes y Mantenimientos respectivamente.
3. **Restricción Estricta de Cambio de Estado:**
   - Si la UT tiene estado `VIAJANDO` (tiene un viaje activo) o `EN_MANTENIMIENTO` (tiene un mantenimiento en estado borrador/en curso), **no se permite cambiar su estado** desde el formulario de edición de UT (`400 Bad Request` en el backend y selector de estado deshabilitado con tooltip explicativo en la Web).
   - Si la UT está en `DISPONIBLE` y pasa manualmente a `INACTIVA`, el backend verifica si tiene reservas futuras en estado `PROGRAMADA`. Si las tiene, retorna las reservas afectadas para que el administrador confirme su cancelación o reasignación antes de inactivar.
4. **Actualización de Kilometraje:**
   - Se define un valor inicial al registrar la UT.
   - Al editar manualmente una UT, el kilometraje no puede ser menor al kilometraje actual registrado (salvo corrección administrativa explícita).
   - Al finalizar cada viaje desde la app móvil, el kilometraje de la UT se incrementa automáticamente sumando la distancia real calculada por el tracking GPS.

## 4. Contratos de API (Backend NestJS)

| Método | Ruta | Rol | Descripción |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/unidades-transporte` | `ADMIN` | Lista UTs con filtros opcionales (`search`, `estado`, `tipo`, `page`, `limit`). |
| `GET` | `/api/v1/unidades-transporte/disponibles-reserva` | `ADMIN` | Retorna UTs elegibles para programar una reserva (estados `DISPONIBLE` y `VIAJANDO`). |
| `GET` | `/api/v1/unidades-transporte/:id` | `ADMIN` | Obtiene el detalle de una UT junto con resumen de último viaje y último mantenimiento. |
| `POST` | `/api/v1/unidades-transporte` | `ADMIN` | Registra una nueva UT. |
| `PATCH` | `/api/v1/unidades-transporte/:id` | `ADMIN` | Actualiza datos de una UT aplicando la regla de bloqueo de cambio de estado si está `VIAJANDO` o `EN_MANTENIMIENTO`. |

## 5. Especificación UI Web (`apps/web`)
- **Ruta `/unidades-transporte`:**
  - **Tabla de Datos (`@tanstack/react-table`):**
    - Columnas: Placa, Marca / Modelo, Año, Tipo (con icono descriptivo), Capacidad, Kilometraje actual (`km`), Estado (`Badge` con código de color semántico: Verde = `DISPONIBLE`, Azul = `VIAJANDO`, Ámbar = `EN_MANTENIMIENTO`, Gris/Rojo = `INACTIVA`), Acciones (Editar, Ver Historial, Enviar a Mantenimiento).
    - Barra de herramientas con búsqueda por placa/marca/modelo y filtros rápidos por `estado` y `tipo`.
  - **Modal / Drawer de Creación y Edición (`shadcn/ui Dialog`):**
    - Campos validados con `zod`: Placa, Marca, Modelo, Año, Tipo (`Select`), Capacidad de Personas, Kilometraje, Estado (`Select`).
    - Si la UT está `VIAJANDO` o `EN_MANTENIMIENTO`, el campo `estado` aparece bloqueado (`disabled`) mostrando un mensaje informativo: *"El estado no puede modificarse manualmente mientras la unidad tiene un viaje activo o está en mantenimiento"*.

## 6. Criterios de Aceptación
- [ ] No se permite duplicar una placa existente.
- [ ] El backend rechaza con `400 Bad Request` cualquier intento de cambiar el estado de una UT que esté `VIAJANDO` o `EN_MANTENIMIENTO` desde el endpoint de edición de UT.
- [ ] La tabla en Next.js filtra, pagina y ordena las UTs utilizando TanStack Table.
