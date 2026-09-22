<?php

header('Content-Type: application/json');

require_once("../clases/Conexion_Class.php");
require_once("../clases/incidentes_Class.php");
require_once("../middleware/middleware_auth.php");

$tipo_de_incidentes = $_POST["tipo_incidente"] ?? null;
$detalles = $_POST["detalles"] ?? null;
$ubicacion = $_POST["ubicacion"] ?? null;

if($tipo_de_incidentes === null || $detalles === null || $ubicacion === null){
    echo json_encode([
        "ok" => false,
        "mensaje" => "datos vacios"
    ]);
    exit;  
}

$incidente_nuevo = new incidentes_class($tipo_de_incidentes,$detalles,$ubicacion,$ID_USUARIO);

$id_indidente = $incidente_nuevo->guardar_datos();

echo json_encode([
    "ok" => true,
    "id_indidente" => $id_indidente,
    "mensaje" => "incidencia creada con exito"
]);
exit;
?>