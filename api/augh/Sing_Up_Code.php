<?php

header('Content-Type: application/json');

require_once("../clases/Ciudadano_Class.php");
require_once("../clases/Conexion_Class.php");
require_once("../clases/Usuarios_Class.php");

$Nombre = $_POST["Nombre"] ?? null;
$Apellido = $_POST["Apellido"] ?? null;
$Dni = $_POST["Dni"] ?? null;
$Gmail = $_POST["Gmail"] ?? null;
$Contrasena = $_POST["Contrasena"] ?? null;
echo json_encode($_POST);
$Confirmar_Contrasena = $_POST["Contrasena2"] ?? null;
$localidad = $_POST["localidad"] ?? null;
$telefono = $_POST["telefono"] ?? null;

function validar_datos($Contrasena,$Confirmar_Contrasena,$Dni,$Gmail){
    if(strlen($Contrasena) >= 8){
        if($Contrasena == $Confirmar_Contrasena){
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

function logica_register($Nombre,$Apellido,$Dni,$Gmail,$Contrasena,$localidad,$telefono){

    $Ciudadano = new Ciudadanos_Class($Nombre,$Apellido,$Dni,$telefono,$localidad);

    $id = $Ciudadano->guardar_datos();

    $Contrasena = password_hash($Contrasena,PASSWORD_DEFAULT);

    $Usuario = new Usuarios_Class($Gmail,$Contrasena,$id);

    $Usuario->guardar_datos();

    echo json_encode([
            "ok" => true,
            "mensaje" => "cuenta creada con exito"
            ]);
    exit;
}

$estado = validar_datos($Contrasena,$Confirmar_Contrasena,$Dni,$Gmail);

if($estado){
    logica_register($Nombre,$Apellido,$Dni,$Gmail,$Contrasena,$localidad,$telefono);
}


?>





