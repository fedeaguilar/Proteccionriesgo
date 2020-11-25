<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1'); 
class ApiManager
{
	/**
	 * @return boolean
	 */
    public function login($user,$pass,$ip,$dispo,$token){
     $array=array($user, $pass, $ip, $dispo,$token);
     $query="exec app_data_login @user=?,@pass=?,@ip=?,@dispo=?,@token=?";   
     
     return Db::queryOne($query,$array);   
    }
    
public function SaveStatus($legajo,$token,$actionData,$DeviceId,$resultado,$idtarea){
     $array=array($legajo,$token,$actionData,$DeviceId,$resultado,$idtarea);
     $query="exec app_status_save 
                        @legajo=?,
			@token=?,
			@consulta=?,
			@deviceid=?,
			@respuesta=?,
			@idtarea=?";   
     return Db::queryAll($query, $array);   
    }

    public function GuardaPeticion($legajo,$token,$actionData,$DeviceId,$idobjetivo){
        
      foreach($actionData['contenido'] as $fila =>$valor){
          foreach($actionData['contenido'][$fila] as $f => $v){     
            if($f==="ronda"){
               $this->GuardaRonda($actionData['contenido'][$fila]['ronda']);    //echo "Si";
             }else{
                $accion['action']=$f;
                foreach($v as $fila3 => $valor3){
                   $data[]= $fila3;
                   $data2[]= $valor3;   
                    }
                }  
            }
          array_unshift($data, 'NombreAccion'); 
          $filas=implode(",",$data);
          
          array_unshift($data2, $f); 
          $val=implode("','",$data2); 
          $valores = "'".$val."'";
          $array=array($filas,$valores);
          $query1="exec app_guarda_action ?,?";   
          Db::query($query1, $array);
           
          unset($data);
          unset($data2);
        
       }
       
    $tarea = $this->BuscaTarea($idobjetivo);   
    return $tarea;  
    }
  public function GuardaRonda($ronda){
        //print_r($ronda['puntoDeControl']);
        $array=array($ronda['status'],$ronda['idRonda'],$ronda['time']);
        $query1="exec app_guarda_ronda ?,?,?";   
        $idronda=Db::insert($query1, $array);
        
        foreach($ronda['puntoDeControl'] as $fila =>$valor){
            $array2=array($idronda, $valor['id'],$valor['orden'],$valor['scan'],$valor['timeout'],$valor['tiempoRonda'],$valor['imgPuesto'],$valor['location']['latitud'],$valor['location']['longitud']);
            $query2="exec app_guarda_ronda_items ?,?,?,?,?,?,?,?,?";   
            $id= Db::insert($query2, $array2);
            //print_R($array2);
        }
  }
  
  public function BuscaTarea($idobjetivo) {
     $array=array($idobjetivo);
     $query="exec app_buscatareas @idobjetivo=? ";   
     return Db::queryOne($query,$array); 
  }


  public function Status_Login($token,$DeviceId) {
   $array=array($token,$DeviceId);
   $query="exec app_statuslogin @token=?, @deviceid=?";   
   return  Db::querySingle($query,$array); 
    }

}



