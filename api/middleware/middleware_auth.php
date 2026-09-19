<?php


require_once("../clases/JWT_class.php");

$datos = getallheaders();

$authorization = $datos["Authorization"] ?? null;

if($authorization === null){
    http_response_code(401);
    echo json_encode([
        "ok" => false,
        "mensaje" => "no se envió ningún token",
    ]);
    exit;
}

$new_authorization = str_replace("Bearer ", "", $authorization);

$respuesta = JWT_Class::verificar($new_authorization);

if(!$respuesta["ok"]){
    echo json_encode([
        "ok" => false,
        "mensaje" => $respuesta["mensaje"],
    ]);
    exit;
}

$ID_USUARIO = $respuesta["ID_USUARIO"];
$ROL = $respuesta["ROL"];

?>