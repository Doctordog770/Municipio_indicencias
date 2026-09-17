<?php

header('Content-Type: application/json');

$Nombre = $_POST["Nombre"] ?? null;
$Apellido = $_POST["Apellido"] ?? null;
$Dni = $_POST["Dni"] ?? null;
$Gmail = $_POST["Gmail"] ?? null;
$Contraseña = $_POST["Contraseña"] ?? null;
$Confirmar_Contraseña = $_POST["Contraseña2"] ?? null;

$Contraseña = trim($Contraseña);
$Confirmar_Contraseña = trim($Confirmar_Contraseña);

if (strlen($Contraseña) >= 15) {

    if ($Contraseña == $Confirmar_Contraseña) {

        include_once('../config/db.php');

        $Contraseña = password_hash($Contraseña, PASSWORD_DEFAULT);

        $consulta = $conexion->prepare("SELECT COUNT(*) AS TOTAL FROM Usuarios WHERE GMAIL = ?");
        $consulta->bind_param('s', $Gmail);
        $consulta->execute();
        $resultado = $consulta->get_result();
        $fila = $resultado->fetch_assoc();

        if ($fila['TOTAL'] > 0) {
            echo json_encode([
                "ok" => false,
                "mensaje" => "este gmail lo esta usando otra cuenta"
            ]);
            exit;
        }

        // Acá todavía falta el INSERT real a la base de datos.
        // Cuando lo hagas, el echo de éxito de abajo tiene que ir
        // DESPUÉS de que el insert haya salido bien.

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





