<?php

require_once("../clases/Conexion_Class.php");
require_once("../middleware/middleware_auth.php");

$ID_CIUDADANO = null;

$conexion = Conexion_Class::get_conexion();

$consulta = $conexion->prepare("SELECT ID_CIUDADANO FROM usuarios WHERE ID_USUARIO = ?");

$consulta->bind_param("i", $ID_USUARIO);

$consulta->execute();

$resultado = $consulta->get_result()->fetch_assoc();

$consulta->close();

$nombre = null;
$apellido = null;

$consulta = $conexion->prepare("SELECT NOMBRE, APELLIDO FROM ciudadanos WHERE ID_CIUDADANO = ?");

$consulta->bind_param("i", $resultado["ID_CIUDADANO"]);

$consulta->execute();

$resultado = $consulta->get_result()->fetch_assoc();

$consulta->close();

echo json_encode([
    "ok" => true,
    "NOMBRE" => $resultado["NOMBRE"],
    "APELLIDO" => $resultado["APELLIDO"]
]);

