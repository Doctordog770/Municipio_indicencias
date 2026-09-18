<?php

class Conexion_Class{
    private string $DB_HOST{
        get => $this->DB_HOST;
    }

    private string $DB_USER{
        get => $this->DB_USER;
    }

    private string $DB_PASSWORD{
        get => $this->DB_PASSWORD;
    }

    private string $DB_NAME{
        get => $this->DB_NAME;
    }

    private static ?mysqli $conexion = null;

    private function __construct(){
        $this->DB_HOST="localhost:3306";
        $this->DB_USER="root";
        $this->DB_PASSWORD="";
        $this->DB_NAME="municipio_indicencias_db";
    }

    public static function get_conexion(): ?mysqli
    {
        if(is_null(self::$conexion)){
            
            self::$conexion = new mysqli(self::$DB_HOST,self::$DB_USER,self::$DB_PASSWORD,self::$DB_NAME);

            if(self::$conexion->connect_errno){
                echo json_encode([
                    "ok" => false,
                    "mensaje" => "error al conectarse con la base de datos"
                ]);
                exit;
            }
        } 

        return self::$conexion;
    }  
}
?>