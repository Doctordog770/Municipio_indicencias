<?php


class Usuarios_Class{
    private string $Gmail{
        set => trim($value);
        get => $this->Gmail;
    }

    private string $Contraseña{
        set => trim($value);
        get => $this->Contraseña;
    }

    private string $Rol{
        set => $value;
        get => $this->Rol;
    }

    private int $id{
        set => $value;
        get => $this->id;
    }

    public function __construct($Gmail,$Contraseña,$id){
        $this->Gmail = $Gmail;
        $this->Contraseña = $Contraseña;
        $this->id = $id;
    }

    public function guardar_datos(): int
    {
        
        $conexion = Conexion_Class::get_conexion();
        
        $consulta = $conexion->prepare("INSERT INTO Usuarios(GMAIL,CONTRASENA,ID_CIUDADANO) VALUES(?,?,?)");

        $Gmail = $this->Gmail;

        $Contraseña = $this->Contraseña;

        $id = $this->id;

        $consulta->bind_param('ssi',$Gmail,$Contraseña,$id);

        $consulta->execute();

        $id = $consulta->insert_id;

        return $id;
    }

    public static function gmail_duplicado($Gmail): bool
    {
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("SELECT COUNT(*) as TOTAL FROM Usuarios WHERE GMAIL = ?");

        $consulta->bind_param('s', $Gmail);

        $consulta->execute();

        $fila = $consulta->get_result();

        $resultado = $fila->fetch_assoc();

        if($resultado['TOTAL'] > 0){
            return true;
        }
        return false;

    }

    public static function iniciar_sesion($gmail,$Contrasena) : array
    {
        
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("SELECT * FROM Usuarios WHERE GMAIL = ? ");

        $consulta->bind_param('s', $gmail);

        $consulta->execute();

        $resultado = $consulta->get_result();

        $usuario = $resultado->fetch_assoc();

        if(!$usuario)
        {
            return array(
                "ok" => false,
                "mensaje" => "este gmail no lo esta usando ningun usuario"
            );
        }

        if(!password_verify($Contrasena,$usuario['CONTRASENA'])){
            return array(
                "ok" => false,
                "mensaje" => "Contraseña incorrecta"
            );
        }

        return array(
            "ok" => true,
            "GMAIL" => $usuario["GMAIL"],
            "ROL" => $usuario["ROL"],
            "ID_USUARIO" => $usuario["ID_USUARIO"]
        );

    }
}
?>