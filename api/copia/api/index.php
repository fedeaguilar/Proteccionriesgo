<?php
error_reporting(0);
//error_reporting(E_ALL);
//ini_set('display_errors', '1'); 


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: auth, Origin, Content-Type, X-Auth-Token");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Credentials:true');
header('Content-type: application/json'); 


foreach (getallheaders() as $nombre => $valor) {
    //echo "$nombre: $valor\n";
	file_put_contents('./log2.log', "$nombre: $valor\n", FILE_APPEND);
}
?>