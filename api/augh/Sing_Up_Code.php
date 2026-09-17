<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$Nombre = $_POST["Nombre"] ?? null;
$Apellido = $_POST["Apellido"] ?? null;
$Dni = $_POST["Dni"] ?? null;
$Gmail = $_POST["Gmail"] ?? null;
$Contraseña = $_POST["Contraseña"] ?? null;
$Confirmar_Contraseña = $_POST["Contraseña2"] ?? null;

if(isset($_POST["Enviar"])){
    $Contraseña = trim($Contraseña);
    $Confirmar_Contraseña = trim($Confirmar_Contraseña);
    if(strlen($Contraseña) >= 30)
    {
        if($Contraseña == $Confirmar_Contraseña)
        { 
            include_once('../config/db.php');

            $Contraseña = password_hash($Contraseña, PASSWORD_DEFAULT);

            $consulta = $conexion->prepare("SELECT COUNT(*) AS TOTAL FROM Usuarios WHERE GMAIL = ?");

            $consulta->bind_param('s', $Gmail);

            $consulta->execute();

            $resultado = $consulta->get_result();

            $fila = $resultado->fetch_assoc();

            if($fila['TOTAL'] > 0){
                    echo json_encode([
                        "ok" => false,
                        "mensaje" => "esta gmail lo esta usando otra cuenta"
                    ]);
            }

            if($fila['TOTAL'] == 0){

                return 0;
                
                #$consulta->close();

                #$consulta = $conexion->prepare("INSERT INTO Usuarios() ");
            }

            
            echo json_encode([
                "ok" => true,
                "mensaje" => "Usuario registrado correctamente"
            ]);
        }
        else
        {
            echo json_encode([
                "ok" => false,
                "mensaje" => "Las contraseñas no coinciden"
            ]);
            exit;

        }
    }
    else 
    {
        echo json_encode([
                "ok" => false,
                "mensaje" => "La contraseña tiene que tener 30 o mas caracteres "
            ]);
        exit;
    }
}
else {
    echo json_encode([
            "ok" => false,
            "mensaje" => "No se recibieron los datos del formulario"
        ]);
    exit;
}





?>