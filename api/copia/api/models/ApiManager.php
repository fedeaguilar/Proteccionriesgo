<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');
//echo "hola";
class ApiManager
{

	/**
	 * @return boolean
	 */
    public function login($user,$pass,$ip,$dispo){
     $array=array($user, $pass, $ip, $dispo);
     $query="exec data_login ?,?,?,?";   
     
     return Db::queryOne($query,$array);   
    }

}



