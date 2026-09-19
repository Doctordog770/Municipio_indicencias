<?php

require_once("../clases/JWT_Class.php");

$token = JWT_Class::generar(1, "usuario");

echo "Token generado:\n";
echo $token . "\n\n";

$resultado = JWT_Class::verificar($token);

echo "Resultado de verificar:\n";
echo json_encode($resultado);

?>