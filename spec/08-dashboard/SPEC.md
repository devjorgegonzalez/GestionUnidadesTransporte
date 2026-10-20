# SPEC 08: Módulo de Dashboard y KPIs Operativos

## 1. Objetivo
Ofrecer al administrador una vista ejecutiva y operativa inmediata del estado de la flota mediante los **KPIs principales de Unidades de Transporte** (`Disponibles`, `Viajando`, `En Mantenimiento`, `Inactivas`), junto con el resumen de actividad del día y alertas operativas (viajes con desviación de kilometraje pendientes de justificación y mantenimientos en curso).

## 2. Indicadores (KPIs) y Datos Agregados
El endpoint de Dashboard consolida en tiempo real:
1. **KPIs Primarios de Flota (Tarjetas Superiores):**
   - **UTs Disponibles:** Total de unidades con `estado === 'DISPONIBLE'`.
   - **UTs Viajando:** Total de unidades con `estado === 'VIAJANDO'`.
   - **UTs en Mantenimiento:** Total de unidades con `estado === 'EN_MANTENIMIENTO'`.
   - **UTs Inactivas:** Total de unidades con `estado === 'INACTIVA'`.
   - **Total de Flota:** Suma total de UTs registradas y distribución porcentual.
2. **Resumen Operativo del Día:**
   - Cantidad de reservas programadas para hoy (`PROGRAMADA`), viajes en curso (`EN_CURSO`) y viajes completados hoy (`FINALIZADO`).
   - Lista rápida de los últimos 5 viajes activos o recientes con acceso directo al **Visor de Tracking**.
3. **Alertas de Control de Flota:**
   - **Viajes con Exceso de Kilometraje (>10%) sin Justificación:** Lista de viajes finalizados donde `excedeUmbralKm === true` y `justificacionExcesoKm` está vacío, con enlace directo para revisar el recorrido y registrar la justificación.
   - **Mantenimientos en Borrador (En Curso):** Lista de UTs actualmente en taller con fecha de ingreso y acceso rápido al formulario para finalizar su mantenimiento cuando regresen.

## 3. Contratos de API (Backend NestJS)

| Método | Ruta | Rol | Descripción |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/dashboard/resumen` | `ADMIN` | Retorna en una sola respuesta los 4 KPIs de estado de UTs, el resumen de viajes del día, los viajes con exceso de km sin justificar y los mantenimientos activos en borrador. |

## 4. Especificación UI Web (`apps/web`)
- **Ruta `/dashboard` (Página principal post-login):**
  - **Fila Superior de 4 Tarjetas KPI (`shadcn/ui Card`):**
    1. **UTs Disponibles** (Icono vehículo verde, conteo grande, clic filtra `/unidades-transporte?estado=DISPONIBLE`).
    2. **UTs Viajando** (Icono ruta/radar azul animado, conteo grande, clic lleva a `/visor`).
    3. **UTs en Mantenimiento** (Icono llave inglesa ámbar, conteo grande, clic lleva a `/mantenimientos?estado=BORRADOR`).
    4. **UTs Inactivas** (Icono alerta gris/rojo, conteo grande, clic filtra `/unidades-transporte?estado=INACTIVA`).
  - **Sección Central (Grid 2 Columnas):**
    - **Columna Izquierda:** Tabla/Lista rápida de **Viajes del Día (En Curso y Próximos)** con botón *"Ver en Visor"*.
    - **Columna Derecha:** Panel de **Alertas de Desviación de Kilometraje** (viajes que superaron lo sugerido por Google Maps y requieren justificación) + **Unidades en Taller (Mantenimientos en Borrador)**.

## 5. Criterios de Aceptación
- [ ] El Dashboard muestra con exactitud los 4 KPIs requeridos: UTs disponibles, UTs en mantenimiento, UTs inactivas y UTs viajando.
- [ ] Los KPIs se actualizan inmediatamente tras iniciar/terminar un viaje desde la app móvil o al abrir/finalizar un mantenimiento en la Web.
