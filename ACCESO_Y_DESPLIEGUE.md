# Guía de Acceso, Datos de Demostración y Verificación del Despliegue

Este documento contiene las URLs de los servicios, credenciales de acceso administrativo y de conductores, datos del seed pre-cargado y escenarios de prueba del sistema integral para la **Gestión de Unidades de Transporte (UT)**.

---

## 1. Servicios Desplegados en Docker (Rango de Puertos 10101 - 10109)

Todos los servicios se encuentran orquestados y activos mediante `docker compose`:

| Servicio | Contenedor | Puerto Host / URL | Descripción |
| :--- | :--- | :--- | :--- |
| **Aplicación Web** | `gestion_ut_web` | [http://localhost:10101](http://localhost:10101) | Next.js App Router + TailwindCSS + shadcn/ui |
| **Backend REST API** | `gestion_ut_backend` | [http://localhost:10102/api/v1](http://localhost:10102/api/v1) | NestJS + Mongoose + JWT + ValidationPipe |
| **Documentación Swagger** | `gestion_ut_backend` | [http://localhost:10102/api/docs](http://localhost:10102/api/docs) | Catálogo interactivo OpenAPI de todos los endpoints |
| **Base de Datos MongoDB** | `gestion_ut_mongodb` | `mongodb://localhost:10103/gestion_ut` | Mongo 7 compatible con Azure CosmosDB |

- **Google Maps API Key:** Configurada mediante variables de entorno en `.env` / `local.properties` (no expuesta en código fuente ni repositorios).

Comandos de gestión:
```bash
# Ver estado de los contenedores
docker compose ps

# Ver logs del backend
docker compose logs backend -f

# Reiniciar todos los servicios
docker compose restart
```

---

## 2. Credenciales de Acceso

### 2.1 Administrador Web (Panel Administrativo)
- **URL de Ingreso:** [http://localhost:10101/login](http://localhost:10101/login)
- **Correo Electrónico:** `admin@empresa.com`
- **Contraseña:** `Admin123*`
- **Rol:** `ADMIN`
- **Permisos:** Acceso completo al Dashboard, Unidades de Transporte, Conductores, Puntos Frecuentes, Mantenimientos, Reservas de Viajes y Visor de Telemetría GPS.

---

### 2.2 Conductores (App Móvil Android — Login Passwordless)
El ingreso de los conductores en la aplicación móvil no requiere contraseña; se autentica mediante la combinación de su **Cédula de Identidad** y la **Placa de la UT**:

| Conductor | Cédula | Placa Asignada | Modelo de la UT | Estado / Escenario Pre-cargado |
| :--- | :--- | :--- | :--- | :--- |
| **Carlos Pérez** | `19876543` | `ABC-101` | Toyota Dyna (Camión) | **Reserva PROGRAMADA para hoy**: Lista para pulsar *"Iniciar Viaje"* en la app móvil. |
| **Manuel Gómez** | `18234567` | `VAN-202` | Ford Transit (Van) | **Viaje EN_CURSO con telemetría activa**: En ruta hacia Charallave con puntos GPS en vivo. |
| **Roberto Díaz** | `20456789` | `SED-505` | Toyota Corolla (Sedán) | **Historial**: Viaje finalizado con alerta de exceso de kilometraje (>10%). |
| **Luis Rodríguez** | `17890123` | `SUV-303` | Toyota Fortuner (SUV) | Disponible para nuevas asignaciones. |

---

## 3. Catálogos y Datos del Seed Inicial

### 3.1 Unidades de Transporte (UT) Pre-cargadas
| Placa | Tipo | Marca / Modelo | Año | Capacidad | Odómetro | Estado Inicial | Reglas de Bloqueo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ABC-101`** | `CAMION` | Toyota Dyna 4.0 | 2021 | 3 pers. | 45,000 km | `DISPONIBLE` | Permite asignación de viajes. |
| **`VAN-202`** | `VAN` | Ford Transit | 2022 | 12 pers. | 62,300 km | `VIAJANDO` | **Bloqueo activo**: No se puede cambiar estado manualmente desde el CRUD. |
| **`SUV-303`** | `CAMIONETA_SUV` | Toyota Fortuner 4x4 | 2023 | 7 pers. | 28,100 km | `DISPONIBLE` | Lista para nuevas reservas. |
| **`PCK-404`** | `CAMIONETA_PICKUP` | Toyota Hilux 4x4 | 2020 | 5 pers. | 89,400 km | `EN_MANTENIMIENTO` | **Bloqueo activo**: Bloqueada por orden en taller. |
| **`SED-505`** | `SEDAN` | Toyota Corolla GLi | 2019 | 5 pers. | 115,000 km | `DISPONIBLE` | Historial disponible en Visor. |
| **`MOT-606`** | `MOTO` | Yamaha YBR 125 | 2022 | 2 pers. | 12,000 km | `INACTIVA` | Unidad fuera de servicio operativo. |

---

### 3.2 Puntos Frecuentes Pre-registrados
1. **Planta Principal Los Cortijos:** Av. Principal Los Cortijos de Lourdes, Caracas (`lat: 10.4851, lng: -66.8234`)
2. **Almacén Central La Yaguara:** Zona Industrial La Yaguara, Calle 3, Caracas (`lat: 10.4806, lng: -66.9617`)
3. **Cliente Siderúrgica Charallave:** Carretera Nacional Charallave - Ocumare (`lat: 10.2450, lng: -66.8620`)
4. **Taller Mecánico Catia:** Av. Sucre, Catia, Caracas (`lat: 10.5150, lng: -66.9380`)
5. **Torre Empresarial El Rosal:** Av. Francisco de Miranda, Chacao (`lat: 10.4905, lng: -66.8655`)

---

### 3.3 Catálogo Base de Tareas de Mantenimiento
1. `CAMBIO_ACEITE`: Cambio de aceite y filtro de motor
2. `CAMBIO_BUJIAS`: Cambio de bujías
3. `LIMPIEZA_INYECTORES`: Limpieza de inyectores
4. `REVISION_FRENOS`: Revisión y ajuste de sistema de frenos
5. `REVISION_NEUMATICOS`: Revisión de neumáticos y presión de aire
6. `ALINEACION_BALANCEO`: Alineación y balanceo
7. `CAMBIO_FILTROS`: Cambio de filtros de aire y combustible
8. `REVISION_BATERIA`: Revisión de batería y sistema eléctrico
9. `REVISION_SUSPENSION`: Revisión de suspensión y amortiguadores
10. `REVISION_FLUIDOS`: Revisión de niveles de fluidos (refrigerante, liga de frenos, transmisión)

---

## 4. Escenarios de Prueba Sugeridos

### Escenario A: Panel Administrativo y Dashboard Web
1. Ingrese a [http://localhost:10101/login](http://localhost:10101/login) con `admin@empresa.com` y `Admin123*`.
2. En el **Dashboard** (`/dashboard`):
   - Observe los KPIs en tiempo real: **3 Disponibles**, **1 Viajando**, **1 En Mantenimiento**, **1 Inactiva**.
   - Observe la tabla de viajes del día con la reserva programada de Carlos Pérez (`ABC-101`).
   - Observe la alerta de exceso de kilometraje del viaje finalizado con desvío vial.
3. En **Unidades de Transporte** (`/unidades-transporte`):
   - Intente editar el estado de la UT `VAN-202` (viajando) o `PCK-404` (en mantenimiento) y compruebe que el sistema bloquea el cambio manual de estado respetando la regla del negocio.
4. En **Mantenimientos** (`/mantenimientos`):
   - Revise la orden de mantenimiento en estado `BORRADOR` de la UT `PCK-404`.
   - Puede finalizarla registrando las observaciones del técnico y seleccionando si pasa a `DISPONIBLE` o `INACTIVA`.
5. En **Reservas de Viajes** (`/reservas-viajes`):
   - Programe una nueva reserva seleccionando Origen y Destino desde la lista de Puntos Frecuentes o directamente en el mapa de Google Maps, observando el cálculo de kilómetros sugeridos.
6. En **Visor de Telemetría** (`/visor`):
   - En la pestaña *"Unidades Activas"* observe el movimiento en tiempo real de la UT `VAN-202` con velocidad actual y ruta trazada.
   - En la pestaña *"Historial de Viajes"* consulte el viaje finalizado y revise o registre la justificación por desviación de kilometraje.

---

### Escenario B: Aplicación Móvil Android para Conductores
- **Archivo APK Compilado:** [`apps/mobile/app/build/outputs/apk/debug/app-debug.apk`](file:///h:/Repos/GestionUnidadesTransporte/apps/mobile/app/build/outputs/apk/debug/app-debug.apk) (62.8 MB).
- **Compatibilidad:** Android 14+ (API 34+).
- **URL Base por defecto:** `http://10.0.2.2:10102/api/v1/` (dirección estándar del host desde el Emulador de Android Studio).

**Pasos de prueba:**
1. Instale y abra la app en el emulador o dispositivo Android 14+.
2. En la pantalla de identificación ingrese:
   - **Cédula:** `19876543`
   - **Placa:** `ABC-101`
3. Pulse **"Buscar Reservas de Hoy"**:
   - Se presentará la tarjeta de la reserva hacia el *Almacén Central La Yaguara* (16.5 km sugeridos).
4. Pulse **"Iniciar Viaje"**:
   - Se activará el `TrackingForegroundService` con notificación persistente en el sistema.
   - Navegará a la pantalla de viaje activo con el **Velocímetro en Jetpack Compose** en tiempo real y el mapa interactivo.
   - Minimice la app o abra otra aplicación; el servicio continuará registrando puntos en segundo plano localmente en Room.
   - Los puntos se subirán en lote cada 5 minutos hacia el backend. Si no hay conexión o se simula modo avión, los puntos se conservan en Room y el badge indicará *"Esperando conexión con el API..."*.
5. Pulse **"Terminar Viaje"**:
   - Confirme en el diálogo. La app enviará todos los puntos acumulados pendientes a `POST /api/v1/viajes/:id/finalizar`.
   - El backend sumará los kilómetros reales recorridos al odómetro de la UT `ABC-101` y la liberará a estado `DISPONIBLE`.
   - Se mostrará el diálogo resumen con los kilómetros reales calculados mediante Haversine vs. sugeridos por Google Maps.
