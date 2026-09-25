# Municipio Incidencias

Sistema web para registrar y gestionar incidencias municipales. El proyecto
permite que los ciudadanos informen problemas de la vía pública y que los
administradores hagan el seguimiento de cada incidencia.

## Funcionalidades principales

- Registro de ciudadanos.
- Inicio de sesión con Gmail y contraseña.
- Autenticación mediante tokens JWT.
- Creación de incidencias con tipo, detalles y ubicación.
- Consulta de incidencias registradas.
- Modificación de incidencias propias.
- Cambio de estado de incidencias por administradores.
- Eliminación de incidencias por administradores.

## Tecnologías

- **Backend:** PHP.
- **Base de datos:** MySQL/MariaDB.
- **Frontend:** HTML, CSS y JavaScript.
- **Servidor local recomendado:** XAMPP con Apache y MySQL.
- **Autenticación:** JSON Web Tokens (JWT).

## Requisitos

- XAMPP u otro servidor compatible con PHP.
- Apache habilitado.
- MySQL o MariaDB habilitado.
- PHP compatible con las características utilizadas por el proyecto (USO OBLIGATORIO DE PHP 8.5 ).
- Navegador web moderno.

## Instalación local

1. Clona o copia el proyecto dentro de la carpeta pública de Apache. En
   XAMPP, normalmente:

   ```text
   C:\xampp\htdocs\Municipio_indicencias
   ```

2. Inicia **Apache** y **MySQL** desde el panel de control de XAMPP.
3. Abre phpMyAdmin y ejecuta el archivo:

   ```text
   database/municipio_indicencias_db.sql
   ```

   Esto crea la base de datos `municipio_indicencias_db` y sus tablas.
4. Verifica la conexión en
   [`api/clases/Conexion_Class.php`](api/clases/Conexion_Class.php). La
   configuración predeterminada utiliza:

   ```text
   Host: localhost:3306
   Usuario: root
   Contraseña: vacía
   Base de datos: municipio_indicencias_db
   ```

5. Asegúrate de que exista el archivo `key.txt` en la raíz del proyecto, ya
   que se utiliza para firmar y verificar los tokens JWT. No publiques este
   archivo ni compartas su contenido.
6. Accede desde el navegador a:

   ```text
   http://localhost/Municipio_indicencias/Frontend/
   ```

## Estructura del proyecto

```text
Municipio_indicencias/
├── api/
│   ├── augh/          # Registro e inicio de sesión
│   ├── CRUB/          # Crear, listar, modificar y borrar incidencias
│   ├── clases/        # Conexión y lógica de negocio
│   ├── middleware/    # Validación de autenticación
│   └── libreria/      # Implementación JWT
├── database/          # Script de creación de la base de datos
├── Frontend/          # Interfaz web y llamadas a la API
├── API_DOCUMENTACION.md
└── CASOS_DE_USO_CRUB.md
```

## Uso básico

1. Registra un usuario desde la pantalla de registro.
2. Inicia sesión para obtener un token JWT.
3. Crea una incidencia indicando el tipo, los detalles y la ubicación.
4. Consulta el listado de incidencias.
5. Modifica únicamente las incidencias creadas por tu usuario.
6. Si tienes rol `admin`, también puedes cambiar estados y eliminar
   incidencias.

Las operaciones protegidas envían el token mediante:

```http
Authorization: Bearer <TOKEN>
```

## Documentación adicional

- [Documentación de la API](API_DOCUMENTACION.md): endpoints, parámetros,
  respuestas y autenticación.
- [Casos de uso del CRUB](CASOS_DE_USO_CRUB.md): actores, precondiciones,
  flujos principales, alternativas y permisos.

## Notas

- La API recibe los datos mediante solicitudes `POST` y campos de formulario.
- El token JWT tiene una vigencia configurada de tres días.
- El rol predeterminado para los usuarios nuevos es `usuario`.
- Los nombres de algunos archivos de autenticación conservan la convención
  original del proyecto (`augh`, `Sing_in` y `Sing_Up`).

## Seguridad

- Utiliza una clave privada fuerte en `key.txt`.
- No subas credenciales ni claves privadas al repositorio.
- Cambia la configuración predeterminada de MySQL antes de usar el sistema en
  un entorno real.
- Valida y protege el acceso al servidor y a la base de datos en producción.

## Integrantes 6to 3ra

- Byron Bocanegra
- Thiago Diaz
- Ivan Acosta
- Thiago Toranzo
