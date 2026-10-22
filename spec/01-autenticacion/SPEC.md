# SPEC 01: Autenticación y Control de Acceso (Web y Móvil)

## 1. Objetivo
Proveer autenticación basada en **JWT Bearer Token** tanto para los usuarios de la aplicación Web (**Administrador** y **Gestor**) como para el **Conductor** en la aplicación móvil Android (quien ingresa únicamente con su cédula de identidad y la placa de la Unidad de Transporte).

### 1.1 Matriz de Roles y Permisos en Plataforma Web
| Funcionalidad / Módulo | Rol `ADMIN` | Rol `GESTOR` | Rol `CONDUCTOR` (Móvil) |
| :--- | :---: | :---: | :---: |
| Dashboard Operativo | ✅ Acceso total | ✅ Acceso total | ❌ Sin acceso |
| Unidades de Transporte (CRUD) | ✅ Acceso total | ✅ Acceso total | ❌ Solo lectura vía login móvil |
| Conductores (CRUD) | ✅ Acceso total | ✅ Acceso total | ❌ Solo consulta de perfil |
| Puntos Frecuentes (CRUD) | ✅ Acceso total | ✅ Acceso total | ❌ Sin acceso |
| Reservas de Viajes (CRUD) | ✅ Acceso total | ✅ Acceso total | ❌ Consulta reservas asignadas |
| Mantenimientos (CRUD) | ✅ Acceso total | ✅ Acceso total | ❌ Sin acceso |
| Visor y Auditoría de Telemetría GPS | ✅ Acceso total | ✅ Acceso total | ❌ Envío de telemetría |
| **Administración de Usuarios (`/usuarios`)** | **✅ Acceso exclusivo** | **❌ Acceso denegado (403)** | **❌ Sin acceso** |

## 2. Modelo de Datos (`UsuarioAdmin`)
Colección: `usuarios_admin`
| Campo | Tipo | Requerido | Único | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | `ObjectId` | Sí | Sí | Identificador único |
| `nombre` | `string` | Sí | No | Nombre del usuario administrativo |
| `email` | `string` | Sí | Sí | Correo electrónico en minúsculas |
| `passwordHash` | `string` | Sí | No | Contraseña encriptada con `bcrypt` |
| `rol` | `string` | Sí | No | `'ADMIN'` (acceso total) o `'GESTOR'` (acceso operativo sin gestión de usuarios) |
| `activo` | `boolean` | Sí | No | Por defecto `true` |
| `createdAt` | `Date` | Sí | No | Fecha de creación |
| `updatedAt` | `Date` | Sí | No | Fecha de actualización |

## 3. Flujos de Autenticación y Reglas de Negocio

### 3.1 Login Administrativo Web (Admin y Gestor)
1. El usuario ingresa `email` y `password` en `/login`.
2. El backend verifica que el correo exista, esté `activo: true` y que el hash coincida.
3. Emite un `accessToken` JWT con expiración de `8h` y payload con el rol asignado (`'ADMIN'` o `'GESTOR'`):
   ```json
   {
     "sub": "userObjectId",
     "email": "usuario@empresa.com",
     "nombre": "Nombre del Usuario",
     "rol": "ADMIN" // o "GESTOR"
   }
   ```
4. El portal web detecta el rol:
   - Si es `ADMIN`: Muestra en el menú lateral el módulo de **Usuarios** y otorga permisos de gestión de cuentas.
   - Si es `GESTOR`: Oculta el módulo de **Usuarios** y rechaza cualquier acceso a `/usuarios`.

### 3.2 Administración de Usuarios (Exclusivo `ADMIN`)
1. Solo usuarios con rol `ADMIN` pueden listar, crear, editar y activar/desactivar usuarios en `/api/v1/usuarios`.
2. Un usuario `GESTOR` recibe `403 Forbidden` si intenta invocar cualquier endpoint de usuarios.
3. No se permite que un administrador se desactive o se degrade de rol a sí mismo, ni desactivar al último administrador activo del sistema.

### 3.2 Login Conductor (App Móvil)
1. El conductor ingresa en la pantalla inicial de la app Android:
   - `cedula`: Cédula de identidad del conductor.
   - `placa`: Placa de la Unidad de Transporte (exactamente 7 caracteres alfanuméricos en mayúsculas `^[A-Z0-9]{7}$`, sin espacios ni guiones, ej. `ABC1001`).
2. El backend valida:
   - Que exista un conductor registrado con esa `cedula` y esté activo.
   - Que exista una Unidad de Transporte registrada con esa `placa` y no esté `INACTIVA` ni `EN_MANTENIMIENTO`.
3. Emite un `accessToken` JWT con expiración de `24h` y payload:
   ```json
   {
     "sub": "conductorObjectId",
     "rol": "CONDUCTOR",
     "cedula": "12345678",
     "nombreCompleto": "Juan Pérez",
     "utId": "utObjectId",
     "placa": "ABC1001"
   }
   ```
4. Además del token, el endpoint devuelve los datos básicos del conductor, de la UT y la lista de reservas disponibles para ese día (en estado `PROGRAMADA` o `EN_CURSO`) asociadas a ese binomio `conductor + UT`.

## 4. Contratos de API (Backend NestJS)

### 4.1 Autenticación
| Método | Ruta | Auth | Roles Permitidos | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/v1/auth/admin/login` | Público | - | Autentica al Administrador o Gestor Web con `email` y `password`. |
| `POST` | `/api/v1/auth/conductor/login` | Público | - | Autentica al Conductor Móvil con `cedula` y `placa`, devolviendo JWT + reservas del día. |
| `GET` | `/api/v1/auth/me` | Bearer JWT | `ADMIN`, `GESTOR`, `CONDUCTOR` | Retorna el perfil de la sesión activa. |

### 4.2 Administración de Usuarios (`/api/v1/usuarios`)
| Método | Ruta | Auth | Roles Permitidos | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/v1/usuarios` | Bearer JWT | `ADMIN` | Lista usuarios registrados con filtros por rol, estado o búsqueda. |
| `GET` | `/api/v1/usuarios/:id` | Bearer JWT | `ADMIN` | Obtiene el detalle de un usuario. |
| `POST` | `/api/v1/usuarios` | Bearer JWT | `ADMIN` | Crea un nuevo usuario asignando rol `ADMIN` o `GESTOR`. |
| `PATCH` | `/api/v1/usuarios/:id` | Bearer JWT | `ADMIN` | Actualiza datos, contraseña opcional, rol o estado del usuario. |
| `DELETE` | `/api/v1/usuarios/:id` | Bearer JWT | `ADMIN` | Elimina o desactiva un usuario (con protección contra auto-eliminación). |

## 5. Especificación UI Web (`apps/web`)
- **Ruta `/login`:**
  - Formulario con `shadcn/ui` (`Card`, `Input`, `Label`, `Button`, `Alert`).
  - Validación con `zod` + `react-hook-form`.
  - Al iniciar sesión correctamente, almacena el token y redirige a `/dashboard`.
- **Protección de Rutas:**
  - Middleware / Guard en Next.js que redirige a `/login` si no existe sesión válida.
  - Botón de **"Cerrar Sesión"** en el sidebar/header del layout administrativo.

## 6. Guards y Decoradores en Backend
- `JwtAuthGuard`: Valida la firma y vigencia del Bearer Token en todas las rutas protegidas.
- `RolesGuard` + `@Roles('ADMIN' | 'CONDUCTOR')`: Restringe endpoints exclusivos de administración web frente a los endpoints operativos de la app móvil.

## 7. Criterios de Aceptación
- [ ] El usuario admin creado por el seed puede iniciar sesión en la Web y obtener su JWT.
- [ ] Un conductor con cédula registrada y placa de UT válida recibe su JWT y las reservas del día sin necesidad de contraseña.
- [ ] Peticiones sin token o con rol insuficiente reciben `401 Unauthorized` o `403 Forbidden`.
