<?php
error_reporting(0);
//error_reporting(E_ALL);
//ini_set('display_errors', '1');
// !! This file has to be in the webhosting's root folder! Otherwise the web won't work !!


session_start();
//unset($_SESSION['usuario']);
 
// !! This file has to be in the webhosting's root folder! Otherwise the web won't work !!


require_once('config.php');


 
// Setting internal encoding for string functions
mb_internal_encoding("UTF-8");

// Callback for autoloading controllers and models
function autoloadFunction($class)
{
	//Ends with the string "Controller" ?
    //echo $class . "</br>";
    if (preg_match('/Controller$/', $class))	
        require("controllers/" . $class . ".php");
    else
        require("models/" . $class . ".php");
}

                       function codificar($dato) {
                            $resultado = $dato;
                            $arrayLetras = array('F', 'I', 'R', 'S', 'T','C','L','I');
                            $limite = count($arrayLetras) - 1;
                            $num = mt_rand(0, $limite);
                            for ($i = 1; $i <= $num; $i++) {
                                $resultado = base64_encode($resultado);
                            }
                            $resultado = $resultado . '+' . $arrayLetras[$num];
                            $resultado = base64_encode($resultado);
                            return $resultado;
                        }
                        function decodificar($dato) {
                            $resultado = base64_decode($dato);
                            list($resultado, $letra) = explode('+', $resultado);
                            $arrayLetras = array('F', 'I', 'R', 'S', 'T','C','L','I');
                            for ($i = 0; $i < count($arrayLetras); $i++) {
                                if ($arrayLetras[$i] == $letra) {
                                    for ($j = 1; $j <= $i; $j++) {
                                        $resultado = base64_decode($resultado);
                                    }
                                    break;
                                }
                            }
                            return $resultado;
                        }
                        
                        
// Registers the callback
spl_autoload_register("autoloadFunction");

// Connects to the database
try {
	Db::connect("201.216.246.69, 4000", "pdr", "SEGURIDAD9021", "Proteccion_riesgos_prueba");
	//Db::connect(HOST, USER, PASSWORD, DB);	
} catch (Exception $e) {
	echo $e->getMessage();
}


// Creating the router and processing parameters from the user's URL
$router = new RouterController();
$router->process(array($_SERVER['REQUEST_URI']));

// Rendering the view
$router->renderView();