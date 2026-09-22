<?php

header('Content-Type: application/json');

require_once("../clases/Conexion_Class.php");
require_once("../clases/incidentes_Class.php");
require_once("../middleware/middleware_auth.php");

$resultado = incidentes_class::Obtener_Incidentes();

echo json_encode([
    "ok" => true,
    "lista_incidentes" => $resultado,
    "mensaje" => "incidentes tabla completa!",
]);
exit;
?>