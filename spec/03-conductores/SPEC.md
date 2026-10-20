# SPEC 03: Módulo de Conductores

## 1. Objetivo
Permitir el registro, consulta, edición y gestión de estado de los conductores a quienes se les asignan las Unidades de Transporte, utilizando su cédula de identidad como identificador único operativo para la aplicación móvil.

## 2. Modelo de Datos (`Conductor`)
Colección: `conductores`

| Campo | Tipo | Requerido | Único | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | `ObjectId` | Sí | Sí | Identificador único |
| `nombre` | `string` | Sí | No | Nombre(s) del conductor |
| `apellido` | `string` | Sí | No | Apellido(s) del conductor |
| `cedula` | `string` | Sí | Sí | Cédula de identidad (normalizada sin puntos ni espacios) |
| `telefono` | `string` | Sí | No | Teléfono de contacto |
| `activo` | `boolean` | Sí | No | Estado operativo del conductor (por defecto `true`) |
| `createdAt` | `Date` | Sí | No | Fecha de registro |
| `updatedAt` | `Date` | Sí | No | Fecha de actualización |

**Índices:**
- `{ cedula: 1 }` (Único)
- `{ apellido: 1, nombre: 1 }`

## 3. Reglas de Negocio
1. **Unicidad de Cédula:** La `cedula` se almacena normalizada (sin espacios ni caracteres especiales innecesarios). No pueden registrarse dos conductores con la misma cédula (`409 Conflict`).
2. **Desactivación Segura (Soft Disable):** En lugar de eliminar físicamente conductores que ya tienen historial de viajes, se utiliza el campo `activo: boolean`. Un conductor con `activo: false` no puede ser seleccionado para nuevas reservas ni iniciar sesión en la app móvil. No se puede desactivar un conductor si tiene un viaje en estado `EN_CURSO`.

## 4. Contratos de API (Backend NestJS)

| Método | Ruta | Rol | Descripción |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/conductores` | `ADMIN` | Lista conductores paginados con búsqueda por nombre, apellido o cédula y filtro `activo`. |
| `GET` | `/api/v1/conductores/activos` | `ADMIN` | Lista todos los conductores con `activo: true` para selectores de Reserva de Viajes. |
| `GET` | `/api/v1/conductores/:id` | `ADMIN` | Obtiene detalle del conductor y sus últimos viajes realizados/programados. |
| `POST` | `/api/v1/conductores` | `ADMIN` | Registra un nuevo conductor (`nombre`, `apellido`, `cedula`, `telefono`). |
| `PATCH` | `/api/v1/conductores/:id` | `ADMIN` | Edita datos de contacto, identificación o estado `activo` del conductor. |

## 5. Especificación UI Web (`apps/web`)
- **Ruta `/conductores`:**
  - **Tabla de Datos (`@tanstack/react-table`):**
    - Columnas: Cédula de Identidad, Nombre Completo (`nombre + apellido`), Teléfono de Contacto, Estado (`Activo` / `Inactivo`), Acciones (Editar, Activar/Desactivar).
    - Buscador instantáneo por cédula, nombre o apellido.
  - **Modal de Registro / Edición (`shadcn/ui Dialog`):**
    - Formulario con campos requeridos: `nombre`, `apellido`, `cedula`, `telefono` y switch de `activo` (en edición).

## 6. Criterios de Aceptación
- [ ] El sistema impide registrar dos conductores con la misma cédula.
- [ ] Los conductores activos aparecen disponibles en el selector del módulo de Reserva de Viajes.
- [ ] La cédula registrada permite al conductor autenticarse en la App Móvil junto con la placa de la UT asignada.
