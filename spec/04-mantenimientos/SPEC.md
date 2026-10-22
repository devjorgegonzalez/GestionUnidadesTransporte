# SPEC 04: Módulo de Mantenimientos

## 1. Objetivo
Gestionar el ciclo completo de mantenimiento de las Unidades de Transporte (UT): apertura del mantenimiento con un checklist base predefinido más tareas manuales adicionales (dejando el formulario en estado **Borrador** y cambiando la UT a **En Mantenimiento**), gestión de reservas pendientes afectadas, y cierre del mantenimiento registrando las observaciones del personal técnico y definiendo si la UT queda **Disponible** o **Inactiva**.

## 2. Modelos de Datos

### 2.1 Catálogo Base de Checklist (`CatalogoTareaMantenimiento`)
Colección: `catalogo_tareas_mantenimiento` (poblado mediante Seed inicial)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `_id` | `ObjectId` | Sí | Identificador único |
| `codigo` | `string` | Sí | Código único (ej. `CAMBIO_ACEITE`) |
| `nombre` | `string` | Sí | Nombre de la tarea (ej. `Cambio de aceite y filtro`) |
| `orden` | `number` | Sí | Orden de visualización en el formulario |
| `activo` | `boolean` | Sí | `true` por defecto |

**Tareas del Seed Inicial:**
1. Cambio de aceite y filtro de motor
2. Cambio de bujías
3. Limpieza de inyectores
4. Revisión y ajuste de sistema de frenos
5. Revisión de neumáticos y presión de aire
6. Alineación y balanceo
7. Cambio de filtros de aire y combustible
8. Revisión de batería y sistema eléctrico
9. Revisión de suspensión y amortiguadores
10. Revisión de niveles de fluidos (refrigerante, liga de frenos, transmisión)

### 2.2 Registro de Mantenimiento (`Mantenimiento`)
Colección: `mantenimientos`
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `_id` | `ObjectId` | Sí | Identificador único |
| `utId` | `ObjectId` | Sí | Referencia a `UnidadTransporte` |
| `placaUt` | `string` | Sí | Snapshot de la placa de la UT (exactamente 7 caracteres alfanuméricos en mayúsculas, ej. `ABC1001`) |
| `kilometrajeRegistro` | `number` | Sí | Kilometraje de la UT al momento de abrir el mantenimiento |
| `estado` | `enum` | Sí | `BORRADOR` (mantenimiento en curso), `FINALIZADO` |
| `tareasChecklist` | `Array<ItemTarea>` | Sí | Lista de tareas base marcadas (`{ nombre: string, seleccionada: boolean, esManual: false }`) |
| `tareasManuales` | `Array<ItemTarea>` | No | Tareas adicionales agregadas manualmente (`{ nombre: string, seleccionada: true, esManual: true }`) |
| `observacionesPersonal` | `string` | No | Observaciones del personal de mantenimiento (requerido al finalizar) |
| `estadoFinalUt` | `enum` | No | `DISPONIBLE` o `INACTIVA` (definido al finalizar el mantenimiento) |
| `fechaApertura` | `Date` | Sí | Fecha/hora en que la UT entró a mantenimiento |
| `fechaCierre` | `Date` | No | Fecha/hora en que se dio por terminado el mantenimiento |
| `createdAt` | `Date` | Sí | Timestamp de creación |
| `updatedAt` | `Date` | Sí | Timestamp de actualización |

**Índices:**
- `{ utId: 1, estado: 1 }`
- `{ estado: 1, fechaApertura: -1 }`

## 3. Reglas de Negocio
1. **Elegibilidad de UT para Mantenimiento:**
   - No se puede abrir un mantenimiento a una UT que esté actualmente `VIAJANDO` (`400 Bad Request`: debe finalizar el viaje activo primero) ni a una que ya tenga un mantenimiento en estado `BORRADOR` (`EN_MANTENIMIENTO`).
2. **Apertura (Estado Borrador):**
   - Al seleccionar la UT, el sistema precarga automáticamente su `kilometraje` actual y el checklist base de tareas.
   - El usuario selecciona las tareas del checklist base a realizar y puede agregar múltiples tareas adicionales de forma manual.
   - Al guardar la apertura, el registro de mantenimiento queda en estado `BORRADOR` y el estado de la UT cambia atómicamente a `EN_MANTENIMIENTO`.
3. **Gestión de Reservas Pendientes Afectadas:**
   - Al momento de la apertura del mantenimiento (y también si al cerrar el mantenimiento la UT queda `INACTIVA`), el sistema busca automáticamente todas las reservas de la unidad en estado `PROGRAMADA`.
   - Dichas reservas son **canceladas automáticamente** (`CANCELADA`) registrando la justificación correspondiente, garantizando que no queden reservas activas en una unidad que no puede operar y evitando intentos de despacho desde la app móvil. El sistema informa al administrador la cantidad de reservas canceladas.
4. **Edición de Borrador:**
   - Mientras el mantenimiento está en estado `BORRADOR`, el usuario puede actualizar las tareas seleccionadas del checklist o agregar/quitar tareas manuales.
5. **Finalización del Mantenimiento:**
   - Cuando la UT vuelve del taller, el usuario abre el mantenimiento en estado `BORRADOR`, registra las **observaciones realizadas por el personal de mantenimiento** (`observacionesPersonal`) y selecciona obligatoriamente el estado en que quedará la UT: **`DISPONIBLE`** o **`INACTIVA`**.
   - Al confirmar, el mantenimiento pasa a estado `FINALIZADO` (registrando `fechaCierre`) y la UT actualiza su estado al seleccionado (`DISPONIBLE` o `INACTIVA`).

## 4. Contratos de API (Backend NestJS)

| Método | Ruta | Rol | Descripción |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/mantenimientos/catalogo-checklist` | `ADMIN` | Retorna los ítems del checklist base predeterminado. |
| `GET` | `/api/v1/mantenimientos` | `ADMIN` | Lista mantenimientos con filtros por `estado` (`BORRADOR`, `FINALIZADO`), `utId` o `placa`. |
| `GET` | `/api/v1/mantenimientos/:id` | `ADMIN` | Obtiene el detalle completo de un mantenimiento. |
| `POST` | `/api/v1/mantenimientos` | `ADMIN` | Crea un mantenimiento en `BORRADOR` y cambia la UT a `EN_MANTENIMIENTO`. |
| `PATCH` | `/api/v1/mantenimientos/:id/borrador` | `ADMIN` | Actualiza checklist y tareas manuales de un mantenimiento en `BORRADOR`. |
| `POST` | `/api/v1/mantenimientos/:id/finalizar` | `ADMIN` | Registra `observacionesPersonal`, cierra el mantenimiento (`FINALIZADO`) y cambia la UT a `DISPONIBLE` o `INACTIVA`. |

## 5. Especificación UI Web (`apps/web`)
- **Ruta `/mantenimientos`:**
  - Pestañas o filtro rápido: **En Curso (Borradores)** vs. **Historial Finalizados**.
  - Tabla (`@tanstack/react-table`) con Placa UT, Kilometraje registrado, Cantidad de tareas, Estado (`BORRADOR` / `FINALIZADO`), Fecha de apertura, Fecha de cierre, Estado resultante de UT y Acciones.
- **Formulario de Nuevo Mantenimiento / Edición de Borrador:**
  - Selector de UT (muestra placa, marca/modelo, kilometraje actual y estado).
  - Si la UT seleccionada tiene reservas `PROGRAMADA`, despliega un bloque de alerta interactivo para cancelarlas o reasignarlas a otra UT.
  - Lista de `Checkbox` con el checklist base predeterminado.
  - Sección dinámica **"Otras tareas de mantenimiento"** con input + botón *"Agregar tarea"* para añadir tareas personalizadas.
  - Botón **"Guardar en Borrador y Enviar UT a Mantenimiento"**.
- **Modal / Vista de Finalización de Mantenimiento:**
  - Resumen de las tareas realizadas (permitiendo marcar/ajustar si se agregó algo en el taller).
  - `Textarea` requerido: **Observaciones del personal de mantenimiento**.
  - `RadioGroup` / `Select` requerido: **Estado final de la UT** (`Disponible` o `Inactiva`).
  - Botón **"Dar por Terminado el Mantenimiento"**.

## 6. Criterios de Aceptación
- [ ] Al crear el mantenimiento, este queda en `BORRADOR` y la UT pasa inmediatamente a `EN_MANTENIMIENTO`.
- [ ] Se pueden marcar tareas del checklist base y agregar tareas manuales libremente.
- [ ] Al finalizar el mantenimiento, se guardan las observaciones del personal de mantenimiento y la UT pasa a `DISPONIBLE` o `INACTIVA` según la selección del usuario.
