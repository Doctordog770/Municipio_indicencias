<?php

require_once("../clases/Ciudadano_Class.php");
require_once("../clases/Usuarios_Class.php");

$gmail = $_POST["gmail"] ?? null;
$contrasena = $_POST["contrasena"] ?? null;

if($gmail === null || $contrasena === null){
    echo json_encode([
        "ok" => false,
        "mensaje" => "datos vacios"
    ]);
    exit;
}    

$respuesta = Usuarios_Class::iniciar_sesion($gmail,$contrasena);

if(!$respuesta["ok"]){
    echo json_encode([
        "ok" => false,
        "mensaje" => $respuesta["mensaje"]
    ]);
    exit;
} else {
    echo json_encode([
        "ok" => true,
        "gmail" => $respuesta["GMAIL"],
        "rol" => $respuesta["ROL"],
        "id" => $respuesta["ID_USUARIO"]
    ]);
    exit;
}
?>