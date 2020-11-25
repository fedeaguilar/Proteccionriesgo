<?php
error_reporting(0);
//error_reporting(E_ALL);
//ini_set('display_errors', '1'); 


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: authorization, auth, Origin, Content-Type, X-Auth-Token");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Credentials:true');
header('Content-type: application/json'); 


/*
$usuario= $_SERVER["PHP_AUTH_USER"];
$password= $_SERVER['PHP_AUTH_PW'];
        
       //echo $_SERVER["HTTP_AUTH"]."<br />"; 
                     
        if (isset($_SERVER["HTTP_AUTHORIZATION"]) && 0 === stripos($_SERVER["HTTP_AUTHORIZATION"], 'Basic ')) {
        		$exploded = explode(':', base64_decode(substr($_SERVER["HTTP_AUTHORIZATION"], 6)), 2);
        		if (2 == \count($exploded)) {
        			list($un, $pw) = $exploded;
        		}		
        	}

echo $usuario . "<br />";
echo $password . "<br />";

echo $un . "<br />";
echo $pw . "<br />";

print_r($_SERVER);


exit();

*/
require_once('config.php');

function autoloadFunction($class)
{
	//Ends with the string "Controller" ?
    //echo $class . "</br>";
    if (preg_match('/Controller$/', $class))	
        require("controllers/" . $class . ".php");
    else
        require("models/" . $class . ".php");
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

