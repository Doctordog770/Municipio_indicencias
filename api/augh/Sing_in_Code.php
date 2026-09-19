<?php

require_once("../clases/Conexion_Class.php");
require_once("../clases/Usuarios_Class.php");
require_once("../clases/JWT_Class.php");

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
    $token = JWT_Class::generar($respuesta["ID_USUARIO"],$respuesta["ROL"]);
    echo json_encode([
        "ok" => true,
        "GMAIL" => $respuesta["GMAIL"],
        "ROL" => $respuesta["ROL"],
        "ID_USUARIO" => $respuesta["ID_USUARIO"],
        "TOKEN" => $token,
        "mensaje" => "login con exito!"
    ]);
    exit;
}
?>