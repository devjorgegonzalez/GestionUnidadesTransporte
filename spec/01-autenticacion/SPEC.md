# SPEC 01: Autenticación y Control de Acceso (Web y Móvil)

## 1. Objetivo
Proveer autenticación basada en **JWT Bearer Token** tanto para el usuario **Administrador** en la aplicación Web como para el **Conductor** en la aplicación móvil Android (quien ingresa únicamente con su cédula de identidad y la placa de la Unidad de Transporte).

## 2. Modelo de Datos (`UsuarioAdmin`)
Colección: `usuarios_admin`
| Campo | Tipo | Requerido | Único | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | `ObjectId` | Sí | Sí | Identificador único |
| `nombre` | `string` | Sí | No | Nombre del administrador |
| `email` | `string` | Sí | Sí | Correo electrónico en minúsculas |
| `passwordHash` | `string` | Sí | No | Contraseña encriptada con `bcrypt` |
| `rol` | `string` | Sí | No | Valor fijo `'ADMIN'` |
| `activo` | `boolean` | Sí | No | Por defecto `true` |
| `createdAt` | `Date` | Sí | No | Fecha de creación |
| `updatedAt` | `Date` | Sí | No | Fecha de actualización |

## 3. Flujos de Autenticación y Reglas de Negocio

### 3.1 Login Administrador (Web)
1. El usuario ingresa `email` y `password` en `/login`.
2. El backend verifica que el correo exista, esté `activo: true` y que el hash coincida.
3. Emite un `accessToken` JWT con expiración de `8h` y payload:
   ```json
   {
     "sub": "adminObjectId",
     "email": "admin@empresa.com",
     "nombre": "Administrador",
     "rol": "ADMIN"
   }
   ```

### 3.2 Login Conductor (App Móvil)
1. El conductor ingresa en la pantalla inicial de la app Android:
   - `cedula`: Cédula de identidad del conductor.
   - `placa`: Placa de la Unidad de Transporte (se normaliza a mayúsculas y sin espacios extra).
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
     "placa": "ABC-123"
   }
   ```
4. Además del token, el endpoint devuelve los datos básicos del conductor, de la UT y la lista de reservas disponibles para ese día (en estado `PROGRAMADA` o `EN_CURSO`) asociadas a ese binomio `conductor + UT`.

## 4. Contratos de API (Backend NestJS)

| Método | Ruta | Auth | Descripción |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/auth/admin/login` | Público | Autentica al Administrador Web con `email` y `password`. |
| `POST` | `/api/v1/auth/conductor/login` | Público | Autentica al Conductor Móvil con `cedula` y `placa`, devolviendo JWT + reservas del día. |
| `GET` | `/api/v1/auth/me` | Bearer JWT | Retorna el perfil de la sesión activa (`ADMIN` o `CONDUCTOR`). |

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
