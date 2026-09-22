<?php

header('Content-Type: application/json');

require_once("../clases/Conexion_Class.php");
require_once("../clases/incidentes_Class.php");
require_once("../middleware/middleware_auth.php");

$id_incidente = $_POST["id_incidente"] ?? null;
$estado = $_POST["estado"] ?? null;

if($ROL !== "admin"){
    http_response_code(403);
    echo json_encode([
        "ok" => false,
        "mensaje" => "no tienes permisos"
    ]);
    exit;
}

if($id_incidente === null || $estado === null){
    echo json_encode([
        "ok" => false,
        "mensaje" => "datos vacios"
    ]);
    exit;
}

$respuesta = incidentes_class::Actualizar_Estado($id_incidente,$estado);

if($respuesta == 0){
    echo json_encode([
        "ok" => false,
        "mensaje" => "incidente no encontrado"
    ]);
    exit; 
}

echo json_encode([
    "ok" => true,
    "mensaje" => "estado de incidente modificado con exito"
]);
exit;
?>