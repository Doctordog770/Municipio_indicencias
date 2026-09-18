<?php

header('Content-Type: application/json');

require_once("../clases/Ciudadano_Class.php");
require_once("../clases/Conexion_Class.php");
require_once("../clases/Usuarios_Class.php");

$Nombre = $_POST["Nombre"] ?? null;
$Apellido = $_POST["Apellido"] ?? null;
$Dni = $_POST["Dni"] ?? null;
$Gmail = $_POST["Gmail"] ?? null;
$Contraseña = $_POST["Contraseña"] ?? null;
$Confirmar_Contraseña = $_POST["Contraseña2"] ?? null;
$localidad = $_POST["localidad"] ?? null;
$telefono = $_POST["telefono"] ?? null;

function validar_datos($Contraseña,$Confirmar_Contraseña,$Dni,$Gmail){
    if(strlen($Contraseña) >= 8){
        if($Contraseña == $Confirmar_Contraseña){
            if(strlen($Dni)=== 7 or strlen($Dni)=== 8){
                $resultado = Usuarios_Class::gmail_duplicado($Gmail);
                if($resultado){
                    echo json_encode([
                    "ok" => false,
                    "mensaje" => "ya hay una cuenta registrada con este gmail"
                ]);
                exit; 
                }
                return true;
            } else {
                echo json_encode([
                    "ok" => false,
                    "mensaje" => "el dni tiene que tener 7 o 8 numeros"
                ]);
                exit;
            }
        } else {
            echo json_encode([
                "ok" => false,
                "mensaje" => "las contraseñas tiene que ser iguales"
            ]);
            exit;
        }
    } 
    else 
    {
        echo json_encode([
            "ok" => false,
            "mensaje" => "la contraseña tiene que tener mas de 8 caracteres"
            ]);
        exit;
    }
}

function logica_register($Nombre,$Apellido,$Dni,$Gmail,$Contraseña,$localidad,$telefono){

    $Ciudadano = new Ciudadanos_Class($Nombre,$Apellido,$Dni,$telefono,$localidad);

    $id = $Ciudadano->guardar_datos();

    $Contraseña = password_hash($Contraseña,PASSWORD_DEFAULT);

    $Usuario = new Usuarios_Class($Gmail,$Contraseña,$id);

    $Usuario->guardar_datos();

    echo json_encode([
            "ok" => true,
            "mensaje" => "cuenta creada con exito"
            ]);
    exit;
}

$estado = validar_datos($Contraseña,$Confirmar_Contraseña,$Dni,$Gmail);

if($estado){
    logica_register($Nombre,$Apellido,$Dni,$Gmail,$Contraseña,$localidad,$telefono);
}


?>





