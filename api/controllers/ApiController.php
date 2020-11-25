<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: authorization, auth, Origin, Content-Type, X-Auth-Token");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Credentials:true');
header('Content-type: application/json'); 


class ApiController extends Controller
{  

	public function process($params)
	{
       switch ($params[0]) {
         case 'login':
			  if($_SERVER['REQUEST_METHOD']=='POST'){
     			  $body=json_decode(file_get_contents('php://input'), true);  
                  $respuesta=$this->login($body);
                  echo $respuesta;
                  exit();
                }elseif($_SERVER['REQUEST_METHOD']=='GET'){
                  $body=json_decode($_GET['rafa'], true);  
                  $respuesta=$this->login($body);
                  echo $respuesta;
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
    $token=$this->token();
    
    
    if(!$user || !$pass || !$device){
      $header="HTTP/1.0 401 Unauthorized";
      $code=401;   
      $error="Faltan Parametros";  
      $this->errorloginbasic($header,$code,$error);   
    }else{
      $usuario=new ApiManager;
      $data=$usuario->login($user,$pass,$ip,$device,$token);
      $datauser = array_merge($data,array("Token"=>$token));  
    }
    
    if(!$datauser){
      $header="HTTP/1.0 401 Unauthorized";
      $code=401;   
      $error="Usuario Invalido";  
      $this->errorloginbasic($header,$code,$error);   
    }
    else if(strcmp($pass, $datauser['clave']) === 0){
      $data=$this->ConstruyeRespuesta($datauser); 
      return(json_encode($data));
       
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
                                      "Foto"=>base64_encode($datauser['foto']),
                                      "Token"=>$datauser['Token']
                                      ),
                    "Objetivos"=>[array(
                                       "Id"=>$datauser['objetivo'],
                                       "Nombre"=>$datauser['nombre_objetivo'],
                                       "Cliente"=>$datauser['cliente']
                                      )]
                    );
       return $array; 
       }    
        
    private function status($data){
    
        $legajo=$data['userData']['Legajo'];
        $token=$data['userData']['Token'];
        $DeviceId=$data['userData']['DeviceId'];
        $idobjetivo=$data['userData']['IdObjetivo'];
        $actionData=$data['actionData'];
        $consulta=json_encode($actionData);
        
        
        if(!$legajo | !$token | !$DeviceId | !$idobjetivo){
            
            $header="HTTP/1.0 404 Not Found"; 
            $code=404;  
            $error="Faltan Parametros";  
            $this->errorloginbasic($header,$code,$error);
                    
        }
        else{
            $rondas = new ApiManager;
            $guardaronda = $rondas->GuardaPeticion($legajo,$token,$actionData,$DeviceId,$idobjetivo);
            $resultado=json_encode($guardaronda);
            $idtarea=$guardaronda['id'];
            
            $status = new ApiManager;
            $info=$status->SaveStatus($legajo,$token,$consulta,$DeviceId,$resultado,$idtarea);  
            
            
          
            $status_login = new ApiManager;
            $info_login=$status_login->Status_Login($token,$DeviceId);  
         
            if(!$info_login){
              $header="HTTP/1.0 401 Unauthorized"; 
              $code=401;  
              $error="Token Caducado";  
              $this->errorloginbasic($header,$code,$error);  
            }

            $array=array(
                        "Status"=>"ok",
                        "Info"=>json_decode($guardaronda['data']),
                        "IdTarea"=>$guardaronda['id']
                       
                    );
            
           echo json_encode($array);

        }
    }
    
//////////////////////FUNCIONES///////////////////////////////////    
//CAPTURA IP 
    private function getRealIP() {

        if (!empty($_SERVER['HTTP_CLIENT_IP']))
            return $_SERVER['HTTP_CLIENT_IP'];
           
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
       
        return $_SERVER['REMOTE_ADDR'];
        } 
            
//GENERA TOKEN     
     private function token(){
        $token = openssl_random_pseudo_bytes(16);
        $token = bin2hex($token);
        return $token;
    }

}






