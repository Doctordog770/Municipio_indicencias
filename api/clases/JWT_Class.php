<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

require_once("../libreria/JWT-PHP/JWT.php");
require_once("../libreria/JWT-PHP/Key.php");

class JWT_Class{
    public static function generar($ID_USUARIO,$ROL) : string
    {
        $key = file_get_contents("../../key.txt");
    
        $payload = [
            'iat' => time(),
            'exp' => time() + 259200,
            'ID_USUARIO' => $ID_USUARIO,
            'ROL' => $ROL
        ];
        
        $token = JWT::encode($payload, $key, 'HS256');
        
        return $token;
    }

    public static function verificar($token)
    {
        $key = file_get_contents("../../key.txt");
        $keyObjeto = new Key($key, 'HS256');

        try {
            $payload = JWT::decode($token, $keyObjeto);

            return [
                "ok" => true,
                "ID_USUARIO" => $payload->ID_USUARIO,
                "ROL" => $payload->ROL
            ];

        } catch (ExpiredException $e) {
            return [
                "ok" => false,
                "mensaje" => "el token expiro, iniciá sesión de nuevo"
            ];

        } catch (SignatureInvalidException $e) {
            return [
                "ok" => false,
                "mensaje" => "el token no es válido (firma incorrecta)"
            ];

        } catch (UnexpectedValueException $e) {
            return [
                "ok" => false,
                "mensaje" => "el token tiene un formato inválido"
            ];

        } catch (\Exception $e) {
            return [
                "ok" => false,
                "mensaje" => "ocurrió un error al verificar el token"
            ];
        }
    }
 }

?>