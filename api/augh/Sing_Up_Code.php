<?php

include("../../Frontend/Sing Up/Singup.html");

$Nombre = $_POST["Nombre"] ?? null;
$Apellido = $_POST["Apellido"] ?? null;
$Dni = $_POST["Dni"] ?? null;
$Gmail = $_POST["Gmail"] ?? null;
$Contraseña = $_POST["Contraseña"] ?? null;
$Confirmar_Contraseña = $_POST["Contraseña2"] ?? null;
$rol = "usuario";

if(isset($_POST["Enviar"])){
    trim($Contraseña);
    trim($Confirmar_Contraseña);
    if(strlen($Contraseña) >= 30)
    {
        if($Contraseña == $Confirmar_Contraseña)
        {
            include_once('../config/db.php');

            $contraseña = password_hash($contraseña);

            

        }
        else
        {
            echo '<p class="error_form">Las Contraseña no coinciden</p>';
        }
    }
    else 
    {
       echo '<p class="error_form"> La contraseña tiene que tener 30 o mas caracteres </p>';
    }
}





?>