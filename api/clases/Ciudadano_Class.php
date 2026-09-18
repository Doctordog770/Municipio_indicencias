<?php

class Ciudadanos_Class {
    private string $Nombre {
        set => trim($value);
        get => $this->Nombre;
    }
    private string $Apellido {
        set => trim($value);
        get => $this->Apellido;
    }
    
    private int $dni {
        set => trim($value);
        get => $this->dni;
    }

    private string $telefono {
        set =>  trim($value);
        get =>  $this->telefono;
    }

    private string $localidad {
        set => trim($value);
        get => $this->localidad;
    }

    public function __construct($Nombre,$Apellido,$dni,$telefono,$localidad){
        $this->Nombre = $Nombre;
        $this->Apellido = $Apellido;
        $this->dni = $dni;
        $this->telefono = $telefono;
        $this->localidad = $localidad;
    }

    public function guardar_datos(){ 
        
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("INSERT INTO Ciudadanos(NOMBRE,APELLIDO,DNI,TELEFONO,LOCALIDAD) VALUES (?,?,?,?,?)");

        $Nombre = $this->Nombre;
        $Apellido = $this->Apellido;
        $dni = $this->dni;
        $telefono = $this->telefono;
        $localidad = $this->localidad;

        $consulta->bind_param('ssiss', $Nombre,$Apellido,$dni,$telefono,$localidad);

        $consulta->execute();

        $id = $consulta->insert_id;

        return $id;
    }

    public static function dni_duplicado(){
        return 0;
    }

    

}



?>