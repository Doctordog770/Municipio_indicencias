<?php

define('DB_HOST', 'localhost:3306' );
define('DB_USER', 'root' );
define('DB_PASSWORD', '');
define('DB_NAME', 'municipio_indicencias_db');


$conexion = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);

if($conexion->connect_errno)
{
    die('error al conectarse con la base de datos');
}

?>