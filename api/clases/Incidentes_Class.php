<?php

class incidentes_class{

    private string $tipo_incidentes{
        set => $value;
        get => $this->tipo_incidentes;
    }

    private string $detalles {
        set => $value;
        get => $this->detalles;
    }

    private string $ubicacion{
        set => $value;
        get => $this->ubicacion;
    }

    private int $id_usuario{
        set => $value;
        get => $this->id_usuario;
    }


    public function __construct($tipo_incidentes,$detalles,$ubicacion,$id_usuario)
    {
       $this->tipo_incidentes = $tipo_incidentes;
       $this->detalles = $detalles;
       $this->ubicacion = $ubicacion;
       $this->id_usuario = $id_usuario;
    }

    static public function Obtener_Incidentes() : array
    {
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("SELECT Incidentes.*, Ciudadanos.NOMBRE, Ciudadanos.APELLIDO
            FROM Incidentes
            INNER JOIN Usuarios ON Incidentes.ID_USUARIO = Usuarios.ID_USUARIO
            INNER JOIN Ciudadanos ON Usuarios.ID_CIUDADANO = Ciudadanos.ID_CIUDADANO");

        $consulta->execute();

        $resultado = $consulta->get_result();

        $array_tabla = $resultado->fetch_all(MYSQLI_ASSOC);

        return $array_tabla;
    }

    public function guardar_datos()
    {
        $conexion = Conexion_Class::get_conexion(); 

        $consulta = $conexion->prepare("INSERT INTO Incidentes(TIPO_INCIDENTE,DETALLES,UBICACION,ID_USUARIO) VALUES(?,?,?,?)");

        $tipo_incidente = $this->tipo_incidentes;
        $detalles = $this->detalles;
        $ubicacion = $this->ubicacion;
        $id_usuario = $this->id_usuario;

        $consulta->bind_param('sssi', $tipo_incidente, $detalles, $ubicacion, $id_usuario);

        $consulta->execute();

        $id = $consulta->insert_id;

        return $id;
    }

    static public function Modificar_incidente_user($id_incidente,$tipo_incidente, $detalles, $ubicacion, $id_usuario) : int
    {
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("UPDATE Incidentes SET TIPO_INCIDENTE = ?, DETALLES = ?, UBICACION = ? WHERE ID_INCIDENTE = ? AND ID_USUARIO = ?");
        
        $consulta->bind_param('sssii', $tipo_incidente, $detalles, $ubicacion, $id_incidente , $id_usuario );

        $consulta->execute();

        $resultado = $consulta->affected_rows;

        return $resultado;
    }
    static public function Actualizar_Estado($id_incidente,$nuevo_estado) : int
    {
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("UPDATE Incidentes SET ESTADO = ? WHERE ID_INCIDENTE = ?");

        $consulta->bind_param('si', $nuevo_estado, $id_incidente);

        $consulta->execute();

        $resultado = $consulta->affected_rows;

        return $resultado;
    }

    static function Eliminar_Incidente($id_incidente) : int
    {
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("DELETE FROM Incidentes WHERE ID_INCIDENTE = ?");

        $consulta->bind_param('i', $id_incidente );

        $consulta->execute();

        $resultado = $consulta->affected_rows;

        return $resultado;
    }
}

?>