<?php

header('Content-Type: application/json');

$Nombre = $_POST["Nombre"] ?? null;
$Apellido = $_POST["Apellido"] ?? null;
$Dni = $_POST["Dni"] ?? null;
$Gmail = $_POST["Gmail"] ?? null;
$Contraseña = $_POST["Contraseña"] ?? null;
$Confirmar_Contraseña = $_POST["Contraseña2"] ?? null;
$localidad = $_POST["localidad"] ?? null;

$Contraseña = trim($Contraseña);
$Confirmar_Contraseña = trim($Confirmar_Contraseña);

if (strlen($Contraseña) >= 15) {

    if ($Contraseña == $Confirmar_Contraseña) {

        include_once('../config/db.php');

        $Contraseña = password_hash($Contraseña, PASSWORD_DEFAULT);

        $consulta = $conexion->prepare("SELECT COUNT(*) AS TOTAL FROM Ciudadanos WHERE DNI  = ? ");
        $consulta->bind_param('s', $Dni);
        $consulta->execute();
        $resultado = $consulta->get_result();
        $fila = $resultado->fetch_assoc();

        if ($fila['TOTAL'] > 0) {
            echo json_encode([
                "ok" => false,
                "mensaje" => "este dni ya esta en nuestra base de datos"
            ]);
            exit;
        } 
        else 
        {
            $consulta->close();

            $consulta = $conexion->prepare("SELECT COUNT(*) AS TOTAL Usuarios WHERE GMAIL = ?");

            $consulta->bind_param('s', $Gmail);

            $consulta->execute();

            $resultado = $consulta->get_result();

            $fila = $resultado->fetch_assoc();

            
        }





        

        echo json_encode([
            "ok" => true,
            "mensaje" => "Usuario registrado correctamente"
        ]);
        exit;

    } else {
        echo json_encode([
            "ok" => false,
            "mensaje" => "Las contraseñas no coinciden"
        ]);
        exit;
    }

} else {
    echo json_encode([
        "ok" => false,
        "mensaje" => "La contraseña tiene que tener 15 o mas caracteres"
    ]);
    exit;
}

?>





