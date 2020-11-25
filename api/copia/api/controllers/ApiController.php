<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

class ApiController extends Controller
{  

	public function process($params)
	{
       switch ($params[0]) {
	       case 'login':
			  if($_SERVER['REQUEST_METHOD']=='POST'){
     			  $body=json_decode(file_get_contents('php://input'), true);  
                  $this->login($body);
                  //exit();
                }elseif($_SERVER['REQUEST_METHOD']=='GET'){
                  $body=json_decode($_GET['rafa'], true);  
                  $this->login($body);
                  exit();
                }
				break;
            case 'status':
                 if($_SERVER['REQUEST_METHOD']=='POST'){
     			  $body=json_decode(file_get_contents('php://input'), true);  
                  $this->status($body);
                  exit();
                  }
            break;
            default:
               $header="HTTP/1.0 401 Unauthorized";
               $code=401;   
               $this->errorloginbasic($header,$code, "Unauthorized"); exit();	   
        }
    }
    
   private function errorloginbasic($header,$code, $tipoerror){
       header($header);
                $error=array(
                            "type"=> "http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html",
                            "title"=>$tipoerror,
                            "status"=> $code,
                            "detail"=>$tipoerror);
       echo(json_encode($error));
       exit(); 
    }
   private function login($data){
    $user=$data['User'];
    $pass=$data['Pass'];
    $device=$data['Device'];
    $ip=$this->getRealIP();
   
    
    
    if(!$user || !$pass || !$device){
      $header="HTTP/1.0 401 Unauthorized";
      $code=401;   
      $error="Faltan Parametros";  
      $this->errorloginbasic($header,$code,$error);   
    }else{
      $usuario=new ApiManager;
      $datauser=$usuario->login($user,$pass,$ip,$device);  
    }
    if(!$datauser){
      $header="HTTP/1.0 401 Unauthorized";
      $code=401;   
      $error="Usuario Invalido";  
      $this->errorloginbasic($header,$code,$error);   
    }
    else if(strcmp($pass, $datauser['clave']) === 0){
      $data=$this->ConstruyeRespuesta($datauser); 
      echo(json_encode($data));
       
    }else{
      $header="HTTP/1.0 401 Unauthorized"; 
      $code=401;  
      $error="El Nombre o Clave no Coinciden";  
      $this->errorloginbasic($header,$code,$error);
    }
   
   }     

  private function ConstruyeRespuesta($datauser){
        $array=array(
                    "Status"=>"OK",
                    "InfoUser"=>array(
                                      "Legajo"=>$datauser['legajo'],
                                      "NombreApellido"=>ucwords(strtolower($datauser['nombre'])) ." ". ucwords(strtolower($datauser['apellido'])) ,
                                      "Foto"=>base64_encode($datauser['foto'])
                                      ),
                    "Objetivos"=>[array(
                                       "Id"=>$datauser['legajo'],
                                       "Nombre"=>$datauser['nombre_objetivo'],
                                       "Cliente"=>$datauser['cliente']
                                      )]
                    );
       return $array; 
       }    

    private function getRealIP() {

        if (!empty($_SERVER['HTTP_CLIENT_IP']))
            return $_SERVER['HTTP_CLIENT_IP'];
           
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
       
        return $_SERVER['REMOTE_ADDR'];
        } 
        
    private function status($data){
        //print_r($data);
        $token = openssl_random_pseudo_bytes(64);
        //Convert the binary data into hexadecimal representation.
        $token = bin2hex($token);
         
        //Print it out for example purposes.
        echo $token;
        
        //echo(json_encode($data));
    }

}






