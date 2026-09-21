<?php

header('Content-Type: application/json');

require_once("../clases/Conexion_Class.php");
require_once("../clases/Ciudadano_Class.php");
require_once("../clases/Usuarios_Class.php");

$Nombre = $_POST["Nombre"] ?? null;
$Apellido = $_POST["Apellido"] ?? null;
$Dni = $_POST["Dni"] ?? null;
$Gmail = $_POST["Gmail"] ?? null;
$Contrasena = $_POST["Contrasena"] ?? null;
$Confirmar_Contrasena = $_POST["Contrasena2"] ?? null;
$localidad = $_POST["localidad"] ?? null;
$telefono = $_POST["telefono"] ?? null;
$direccion = $_POST["direccion"] ?? null;
$codigo_postal = $_POST["codigo_postal"] ?? null;

function validar_datos($Contrasena,$Confirmar_Contrasena,$Dni,$Gmail) : bool
{
    
    $error = "";
    
    if(strlen($Contrasena) < 8){
        $error .= 'La contraseña tiene que tener 8 o mas caracteres';
    }

    if($Contrasena != $Confirmar_Contrasena){
        $error .= 'La contraseña tiene que ser la misma';
    }

    $resultado_gmail = Usuarios_Class::gmail_duplicado($Gmail);

    if($resultado_gmail){
        $error .= 'Ya Hay un Usuario con este gmail';
    }

    if(strlen($Dni) > 8 ){
        $error .= 'El Dni no puede tener mas de 8 o 7 dijitos';
    } else if (strlen($Dni) < 7){
        $error .= 'el dni no puede tener menos de 7 o 8 dijitos';
    }

    $resultado_dni = Ciudadanos_Class::dni_duplicado($Dni);

    if($resultado_dni){
        $error .= 'El DNI ya esta registrado';
    }

    if($error == ""){
        return true;
    }
    
    echo json_encode([
        "ok" => false,
        "mensaje" => $error
    ]);
    
    return false;
}

function logica_register($Nombre,$Apellido,$Dni,$Gmail,$Contrasena,$localidad,$telefono,$codigo_postal,$direccion){

    $Ciudadano = new Ciudadanos_Class($Nombre,$Apellido,$Dni,$telefono,$localidad,$codigo_postal,$direccion);

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
    logica_register($Nombre,$Apellido,$Dni,$Gmail,$Contrasena,$localidad,$telefono,$codigo_postal,$direccion);
} 
?>