<?php

class Ciudadanos {
    private string $Nombre {
        set => trim($value);
        get => $this->Nombre;
    }
    private string $Apellido {
        set => trim($value);
        get => $this->Apellido;
    }
    
    private string $dni {
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

    function __construct($Nombre,$Apellido,$dni,$telefono,$localidad){
        $this->Nombre = $Nombre;
        $this->Apellido = $Apellido;
        $this->dni = $dni;
        $this->telefono = $telefono;
        $this->localidad = $localidad;
    }

    public function guardar(){ 
        
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("INSERT INTO Ciudadanos(NOMBRE,APELLIDO,DNI,TELEFONO,LOCALIDAD) VALUES (?,?,?,?,?)");

        $consulta->bind_param('sssss', $this->Nombre,$this->Apellido,$this->dni,$this->telefono,$this->localidad);

        $consulta->execute();

        $id = $consulta->insert_id;

        return $id;
    }

    

}



?>