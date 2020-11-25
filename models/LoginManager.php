<?php

class LoginManager{


    public function getUsuario($usuario, $password){
        $query="SELECT count(*) FROM usuarios WHERE nombre='".$usuario."' AND password='". $password ."'";
                                    
        return Db::querySingle($query);
        
        }
    
    
    }
?>  