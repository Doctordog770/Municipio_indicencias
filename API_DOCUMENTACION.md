# Documentación de la API

Esta API permite registrar usuarios, iniciar sesión y gestionar incidencias del sistema municipal. La aplicación usa PHP y JWT para autenticación, y todos los endpoints reciben datos en `FormData`/`application/x-www-form-urlencoded` desde el frontend.

## Base URL

Usa la URL del proyecto en tu servidor local, por ejemplo:

- `http://localhost/Municipio_indicencias/api/...`
- o la ruta equivalente según tu configuración de Apache/XAMPP.

## Formato de respuesta

La API responde en JSON con la siguiente estructura general:

```json
{
  "ok": true,
  "mensaje": "Descripción del resultado",
  "...": "campos adicionales según el endpoint"
}
```

En errores, normalmente se devuelve:

```json
{
  "ok": false,
  "mensaje": "texto del error"
}
```

## Autenticación

La API usa JWT en el header `Authorization`:

```http
Authorization: Bearer <token>
```

El token se obtiene en el login y luego se envía automáticamente por el frontend con `fetch_endpoints()`.

### Middleware de autenticación

Los endpoints protegidos incluyen `api/middleware/middleware_auth.php` que valida el token. Si no se envía o es inválido, responde con:

```json
{
  "ok": false,
  "mensaje": "no se envió ningún token"
}
```

o:

```json
{
  "ok": false,
  "mensaje": "el token expiro, iniciá sesión de nuevo"
}
```

## Endpoints

### 1) Login

- Endpoint: `POST /api/augh/Sing_in_Code.php`
- Descripción: inicia sesión de un usuario y devuelve un JWT.

#### Body

```json
{
  "gmail": "usuario@email.com",
  "contrasena": "miPassword123"
}
```

#### Respuesta exitosa

```json
{
  "ok": true,
  "GMAIL": "usuario@email.com",
  "ROL": "admin",
  "ID_USUARIO": 1,
  "TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "mensaje": "login con exito!"
}
```

#### Errores posibles

- Gmail no registrado
- Contraseña incorrecta
- Datos vacíos

---

### 2) Registro de usuario

- Endpoint: `POST /api/augh/Sing_Up_Code.php`
- Descripción: crea una cuenta de ciudadano y su usuario asociado.

#### Body

```json
{
  "Nombre": "María",
  "Apellido": "González",
  "Dni": "12345678",
  "Gmail": "maria@gmail.com",
  "Contrasena": "password123",
  "Contrasena2": "password123",
  "localidad": "Córdoba",
  "telefono": "3511234567",
  "direccion": "Av. San Martín 123",
  "codigo_postal": "5000"
}
```

#### Validaciones

- La contraseña debe tener al menos 8 caracteres.
- La contraseña y la confirmación deben coincidir.
- El Gmail no puede estar duplicado.
- El DNI debe tener entre 7 y 8 dígitos.
- El DNI no puede estar duplicado.

#### Respuesta exitosa

```json
{
  "ok": true,
  "mensaje": "cuenta creada con exito"
}
```

---

### 3) Listar incidencias

- Endpoint: `POST /api/CRUB/Listar_incidencias_code.php`
- Descripción: devuelve todas las incidencias registradas.
- Requiere autenticación: sí.

#### Body

No requiere campos, pero puede enviarse vacío.

#### Respuesta exitosa

```json
{
  "ok": true,
  "lista_incidentes": [
    {
      "ID_INCIDENTE": 1,
      "TIPO_INCIDENTE": "Bache",
      "DETALLES": "Hay un bache grande en la esquina.",
      "UBICACION": "Calle 9 y 10",
      "ID_USUARIO": 2,
      "ESTADO": "pendiente"
    }
  ],
  "mensaje": "incidentes tabla completa!"
}
```

---

### 4) Crear incidencia

- Endpoint: `POST /api/CRUB/Crear_incidencia_code.php`
- Descripción: crea una nueva incidencia asociada al usuario autenticado.
- Requiere autenticación: sí.

#### Body

```json
{
  "tipo_incidente": "Bache",
  "detalles": "Hay un bache grande en la esquina.",
  "ubicacion": "Calle 123 y Av. Siempre Viva"
}
```

#### Respuesta exitosa

```json
{
  "ok": true,
  "id_indidente": 15,
  "mensaje": "incidencia creada con exito"
}
```

---

### 5) Modificar incidencia

- Endpoint: `POST /api/CRUB/Modificar_incidencia_code.php`
- Descripción: modifica una incidencia solo si pertenece al usuario autenticado.
- Requiere autenticación: sí.

#### Body

```json
{
  "id_incidente": 15,
  "tipo_de_incidente": "Iluminación",
  "detalles": "Falta la luminaria del sector.",
  "ubicacion": "Av. Central 500"
}
```

#### Respuesta exitosa

```json
{
  "ok": true,
  "mensaje": "incidencia modificada con exito!"
}
```

#### Errores posibles

- Datos incompletos
- La incidencia no existe o no pertenece al usuario

---

### 6) Eliminar incidencia

- Endpoint: `POST /api/CRUB/Eliminar_code.php`
- Descripción: elimina una incidencia. Solo administradores pueden usar este endpoint.
- Requiere autenticación: sí.
- Permisos: `admin`

#### Body

```json
{
  "id_incidente": 15
}
```

#### Respuesta exitosa

```json
{
  "ok": true,
  "mensaje": "incidente borrar con exito!"
}
```

#### Error de permisos

```json
{
  "ok": false,
  "mensaje": "no tienes permisos"
}
```

---

### 7) Cambiar estado de incidencia

- Endpoint: `POST /api/CRUB/Cambiar_estado_code.php`
- Descripción: actualiza el estado de una incidencia. Solo administradores pueden usarlo.
- Requiere autenticación: sí.
- Permisos: `admin`

#### Body

```json
{
  "id_incidente": 15,
  "estado": "en_proceso"
}
```

#### Respuesta exitosa

```json
{
  "ok": true,
  "mensaje": "estado de incidente modificado con exito"
}
```

#### Error de permisos

```json
{
  "ok": false,
  "mensaje": "no tienes permisos"
}
```

---

## Roles

La API utiliza el campo `ROL` dentro del JWT y de la tabla `Usuarios`:

- `admin`: puede ver y modificar estados, y eliminar incidencias.
- usuarios normales: pueden crear, listar y modificar solo sus propias incidencias.

## Observaciones de implementación

- Todos los endpoints usan `$_POST`, por lo que el cliente debe enviar `FormData` o un formulario con `method="POST"`.
- El token se valida con Firebase JWT usando una clave guardada en `key.txt` en la raíz del proyecto.
- Los nombres de los archivos tienen inconsistencias (`Sing_in`/`Sing_Up`), pero los endpoints funcionales son los descritos arriba.

## Ejemplo completo de flujo

1. `POST /api/augh/Sing_in_Code.php` con gmail + contraseña
2. Recibir `TOKEN` y `ID_USUARIO`
3. Guardar el token en `localStorage`
4. Enviar el siguiente header en cada request protegida:

```http
Authorization: Bearer <TOKEN>
```

5. Llamar a `POST /api/CRUB/Crear_incidencia_code.php` o `POST /api/CRUB/Listar_incidencias_code.php`

## Código del frontend que usa la API

El frontend usa este patrón general:

```javascript
const data = new FormData(formulario);
const token = localStorage.getItem('token');
const headers = token ? { 'Authorization': 'Bearer ' + token } : {};

const respuesta = await fetch(path, {
  method: 'POST',
  headers: headers,
  body: data
});
```

Esto confirma que los endpoints están destinados a recibir datos por formulario y no por JSON puro.
