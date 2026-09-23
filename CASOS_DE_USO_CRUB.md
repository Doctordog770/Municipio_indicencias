# Casos de uso principales del CRUB

Este documento describe los casos de uso más importantes del módulo CRUB
(Crear, Consultar/Listar, Modificar y Borrar incidencias) del sistema de
incidencias municipales.

## Actores

- **Ciudadano autenticado:** registra incidencias, consulta las incidencias y
  modifica las incidencias que creó.
- **Administrador:** realiza las operaciones del ciudadano y, además, cambia
  estados y elimina incidencias.
- **Sistema:** valida credenciales, tokens JWT, datos recibidos y permisos,
  además de guardar y consultar la información en la base de datos.

## Reglas generales

1. Las operaciones sobre incidencias requieren autenticación mediante un token
   JWT enviado en el header:

   ```http
   Authorization: Bearer <TOKEN>
   ```

2. El token debe ser válido y no estar vencido.
3. El ciudadano solo puede modificar sus propias incidencias.
4. Solo un usuario con rol `admin` puede cambiar estados o eliminar
   incidencias.
5. Las solicitudes se envían mediante `POST` y los datos se reciben como
   campos de formulario.

---

## CU-01: Iniciar sesión

| Campo | Descripción |
|---|---|
| Actor principal | Ciudadano o administrador |
| Objetivo | Obtener acceso al sistema y un token JWT |
| Endpoint | `POST /api/augh/Sing_in_Code.php` |

### Precondiciones

- El usuario debe estar registrado.
- El usuario debe conocer su Gmail y contraseña.

### Flujo principal

1. El actor ingresa su Gmail y contraseña.
2. El sistema verifica que ambos datos hayan sido enviados.
3. El sistema busca el usuario por su Gmail.
4. El sistema compara la contraseña recibida con la contraseña almacenada.
5. El sistema genera un token JWT con el ID del usuario y su rol.
6. El sistema devuelve el token y los datos básicos del usuario.
7. El cliente guarda el token para utilizarlo en las operaciones protegidas.

### Flujo alternativo

- Si falta el Gmail o la contraseña, el sistema informa `datos vacios`.
- Si el Gmail no existe, el sistema informa que no está siendo utilizado por
  ningún usuario.
- Si la contraseña no coincide, el sistema informa `Contraseña incorrecta`.

### Resultado

El actor queda autenticado durante la vigencia del token, actualmente tres
días.

---

## CU-02: Crear una incidencia

| Campo | Descripción |
|---|---|
| Actor principal | Ciudadano autenticado |
| Objetivo | Registrar un problema municipal |
| Endpoint | `POST /api/CRUB/Crear_incidencia_code.php` |

### Precondiciones

- El actor inició sesión.
- El actor dispone de un token JWT válido.

### Datos de entrada

| Campo | Obligatorio | Descripción |
|---|---:|---|
| `tipo_incidente` | Sí | Tipo de problema informado |
| `detalles` | Sí | Descripción del problema |
| `ubicacion` | Sí | Lugar donde ocurre |

### Flujo principal

1. El actor completa el tipo, los detalles y la ubicación.
2. El cliente envía los datos junto con el token JWT.
3. El sistema valida el token y obtiene el ID del usuario.
4. El sistema valida que los tres campos estén presentes.
5. El sistema crea la incidencia y la vincula con el usuario autenticado.
6. El sistema devuelve el identificador de la incidencia creada.

### Flujo alternativo

- Si no se envía el token, el sistema responde con un error de autenticación.
- Si el token no es válido, venció o tiene una firma incorrecta, el sistema
  rechaza la solicitud.
- Si falta un campo obligatorio, el sistema informa `datos vacios`.

### Resultado

La incidencia queda almacenada y disponible para su consulta.

---

## CU-03: Consultar incidencias

| Campo | Descripción |
|---|---|
| Actor principal | Ciudadano autenticado o administrador |
| Objetivo | Consultar las incidencias registradas |
| Endpoint | `POST /api/CRUB/Listar_incidencias_code.php` |

### Precondiciones

- El actor inició sesión.
- El actor dispone de un token JWT válido.

### Flujo principal

1. El actor solicita el listado de incidencias.
2. El cliente envía el token JWT.
3. El sistema valida el token.
4. El sistema consulta la tabla de incidencias.
5. El sistema devuelve la lista completa en el campo
   `lista_incidentes`.

### Flujo alternativo

- Si no se envía un token o el token es inválido, el sistema no devuelve el
  listado y solicita autenticarse nuevamente.

### Resultado

El actor recibe las incidencias registradas con sus datos, estado y usuario
asociado.

---

## CU-04: Modificar una incidencia propia

| Campo | Descripción |
|---|---|
| Actor principal | Ciudadano autenticado |
| Objetivo | Corregir o actualizar los datos de una incidencia propia |
| Endpoint | `POST /api/CRUB/Modificar_incidencia_code.php` |

### Precondiciones

- El actor inició sesión.
- El actor dispone de un token JWT válido.
- La incidencia existe y pertenece al actor.

### Datos de entrada

| Campo | Obligatorio | Descripción |
|---|---:|---|
| `id_incidente` | Sí | Identificador de la incidencia |
| `tipo_de_incidente` | Sí | Nuevo tipo de problema |
| `detalles` | Sí | Nueva descripción |
| `ubicacion` | Sí | Nueva ubicación |

### Flujo principal

1. El actor selecciona una incidencia propia.
2. El actor modifica sus datos.
3. El cliente envía los datos y el token JWT.
4. El sistema valida el token y obtiene el ID del actor.
5. El sistema actualiza la incidencia únicamente cuando el ID de usuario
   coincide con el propietario.
6. El sistema confirma la modificación.

### Flujo alternativo

- Si falta algún dato obligatorio, el sistema informa `datos vacios`.
- Si la incidencia no existe o no pertenece al actor, el sistema informa
  `no se encontró esa incidencia o no te pertenece`.
- Si el token no es válido, el sistema rechaza la solicitud.

### Resultado

La incidencia conserva su identificador y queda actualizada con los nuevos
datos.

---

## CU-05: Cambiar el estado de una incidencia

| Campo | Descripción |
|---|---|
| Actor principal | Administrador |
| Objetivo | Actualizar el estado de atención de una incidencia |
| Endpoint | `POST /api/CRUB/Cambiar_estado_code.php` |

### Precondiciones

- El administrador inició sesión.
- El token JWT es válido.
- El rol incluido en el token es `admin`.

### Datos de entrada

| Campo | Obligatorio | Descripción |
|---|---:|---|
| `id_incidente` | Sí | Identificador de la incidencia |
| `estado` | Sí | Nuevo estado de atención |

### Flujo principal

1. El administrador selecciona una incidencia.
2. El administrador indica el nuevo estado.
3. El cliente envía los datos junto con el token JWT.
4. El sistema valida el token y el rol `admin`.
5. El sistema actualiza el estado de la incidencia.
6. El sistema confirma la operación.

### Flujo alternativo

- Si el actor no tiene rol `admin`, el sistema responde con HTTP `403` y el
  mensaje `no tienes permisos`.
- Si falta el identificador o el estado, el sistema informa `datos vacios`.
- Si la incidencia no existe, el sistema informa `incidente no encontrado`.

### Resultado

La incidencia queda marcada con el nuevo estado para su seguimiento.

---

## CU-06: Eliminar una incidencia

| Campo | Descripción |
|---|---|
| Actor principal | Administrador |
| Objetivo | Quitar una incidencia del sistema |
| Endpoint | `POST /api/CRUB/Eliminar_code.php` |

### Precondiciones

- El administrador inició sesión.
- El token JWT es válido.
- El rol incluido en el token es `admin`.
- La incidencia existe.

### Datos de entrada

| Campo | Obligatorio | Descripción |
|---|---:|---|
| `id_incidente` | Sí | Identificador de la incidencia |

### Flujo principal

1. El administrador selecciona la incidencia que desea eliminar.
2. El cliente envía el identificador y el token JWT.
3. El sistema valida el token y el rol `admin`.
4. El sistema elimina la incidencia.
5. El sistema confirma la eliminación.

### Flujo alternativo

- Si el actor no tiene rol `admin`, el sistema responde con HTTP `403` y el
  mensaje `no tienes permisos`.
- Si falta el identificador, el sistema informa `datos vacios`.
- Si no se encuentra la incidencia, el sistema informa
  `incidente no encontrado`.

### Resultado

La incidencia deja de estar disponible en el sistema.

---

## Resumen de permisos

| Caso de uso | Ciudadano | Administrador |
|---|:---:|:---:|
| Iniciar sesión | Sí | Sí |
| Crear incidencia | Sí | Sí |
| Consultar incidencias | Sí | Sí |
| Modificar incidencia propia | Sí | Sí |
| Cambiar estado | No | Sí |
| Eliminar incidencia | No | Sí |

## Flujo general del módulo

```text
Iniciar sesión
      |
      v
Obtener token JWT
      |
      v
Crear o consultar incidencia
      |
      +--> Modificar incidencia propia
      |
      +--> [Administrador] Cambiar estado
      |
      +--> [Administrador] Eliminar incidencia
```

