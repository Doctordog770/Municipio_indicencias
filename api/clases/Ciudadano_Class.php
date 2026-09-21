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

    private int $codigo_postal {
        set => trim($value);
        get => $this->codigo_postal;
    }

    private string $direccion {
        set => trim($value);
        get => $this->direccion;
    }

    public function __construct($Nombre,$Apellido,$dni,$telefono,$localidad,$codigo_postal,$direccion){
        $this->Nombre = $Nombre;
        $this->Apellido = $Apellido;
        $this->dni = $dni;
        $this->telefono = $telefono;
        $this->localidad = $localidad;
        $this->codigo_postal = $codigo_postal;
        $this->direccion = $direccion;
    }

    public function guardar_datos(){ 
        
        $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("INSERT INTO Ciudadanos(NOMBRE,APELLIDO,DNI,TELEFONO,LOCALIDAD,CODIGO_POSTAL,DIRECCION) VALUES (?,?,?,?,?,?,?)");

        $Nombre = $this->Nombre;
        $Apellido = $this->Apellido;
        $dni = $this->dni;
        $telefono = $this->telefono;
        $localidad = $this->localidad;
        $codigo_postal = $this->codigo_postal;
        $direccion = $this->direccion;

        $consulta->bind_param('ssissis', $Nombre,$Apellido,$dni,$telefono,$localidad,$codigo_postal,$direccion);

        $consulta->execute();

        $id = $consulta->insert_id;

        return $id;
    }

    public static function dni_duplicado($Dni) : bool
    {
        
    $conexion = Conexion_Class::get_conexion();

        $consulta = $conexion->prepare("SELECT COUNT(*) AS TOTAL FROM Ciudadanos WHERE DNI = ? ");

        $consulta->bind_param('i', $Dni);

        $consulta->execute();

        $fila = $consulta->get_result();

        $resultado = $fila->fetch_assoc();

        if($resultado["TOTAL"] > 0){
            return true;
        }
        return false;
    }
}
?>