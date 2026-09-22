<?php

require_once("../clases/Conexion_Class.php");
require_once("../clases/incidentes_Class.php");
require_once("../middleware/middleware_auth.php");

$tipo_de_indicedentes = $_POST["tipo_incidente"] ?? null;
$detalles = $_POST["detalles"] ?? null;
$ubicacion = $_POST["ubicacion"] ?? null;

if($tipo_de_indicedentes === null || $detalles === null || $ubicacion === null){
    echo json_encode([
        "ok" => false,
        "mensaje" => "datos vacios"
    ]);
    exit;  
}

$incidente_nuevo = new incidentes_class($tipo_de_indicedentes,$detalles,$ubicacion,$ID_USUARIO);

$incidente_nuevo->guardar_datos();

echo json_encode([
    "ok" => true,
    "mensaje" => "incidencia creada con exito"
]);



?>