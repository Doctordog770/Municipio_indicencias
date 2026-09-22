<?php

header('Content-Type: application/json');

require_once("../clases/Conexion_Class.php");
require_once("../clases/incidentes_Class.php");
require_once("../middleware/middleware_auth.php");

$id_incidente = $_POST["id_incidente"] ?? null;
$tipo_de_incidente = $_POST["tipo_de_incidente"] ?? null;
$detalles = $_POST["detalles"] ?? null;
$ubicacion = $_POST["ubicacion"] ?? null;

if($id_incidente === null || $tipo_de_incidente === null || $detalles === null || $ubicacion === null){
    echo json_encode([
        "ok" => false,
        "mensaje" => "datos vacios"
    ]);
    exit; 
}

$resultado = incidentes_class::Modificar_incidente_user($id_incidente,$tipo_de_incidente,$detalles,$ubicacion,$ID_USUARIO);

if($resultado == 0){
    echo json_encode([
        "ok" => false,
        "mensaje" => "no se encontró esa incidencia o no te pertenece"
    ]);
    exit;
} 

echo json_encode([
    "ok" => true,
    "mensaje" => "incidencia modificada con exito!"
]);
exit;
?>