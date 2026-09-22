<?php

header('Content-Type: application/json');

require_once("../clases/Conexion_Class.php");
require_once("../clases/incidentes_Class.php");
require_once("../middleware/middleware_auth.php");

$id_incidente = $_POST["id_incidente"] ?? null;

if($ROL !== "admin"){
    http_response_code(403);
    echo json_encode([
        "ok" => false,
        "mensaje" => "no tienes permisos"
    ]);
    exit;
}

if($id_incidente === null){
    echo json_encode([
        "ok" => false,
        "mensaje" => "datos vacios"
    ]);
    exit;
}

$resultado = incidentes_class::Eliminar_Incidente($id_incidente);

if($resultado == 0){
    echo json_encode([
        "ok" => false,
        "mensaje" => "incidente no encontrado"
    ]);
    exit;
}

echo json_encode([
    "ok" => true,
    "mensaje" => "incidente borrar con exito!"
]);
exit;
?>