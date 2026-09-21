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

        $consulta = $conexion->prepare("SELECT * FROM Incidentes");

        $consulta->execute();

        $resultado = $consulta->get_result();

        $array_tabla = $resultado->fetch_all(MYSQLI_ASSOC);

        return $array_tabla;
  
    }

    public function guardar_datos()
    {
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("INSERT INTO Incidentes(TIPO_INCIDENTE,DETALLES,UBICACION,ID_USUARIO) VALUES(?,?,?,?,?)");

        $tipo_incidente = $this->tipo_incidentes;
        $detalles = $this->detalles;
        $ubicacion = $this->ubicacion;
        $id_usuario = $this->id_usuario;

        $consulta->bind_param('sssi', $tipo_incidente, $detalles, $ubicacion, $id_usuario);

        $consulta->execute();

        $id = $consulta->insert_id;

        return $id;
    }

    public function updateIncidente()
    {

    }

    public function deleteIncidente()
    {

    }
}

?>