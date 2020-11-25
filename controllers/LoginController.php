<?php

class LoginController extends Controller
{
	public function process($params)
	{
	   
       	switch ($params[0]) {
            case 'getlogin':
                $this->getlogin($_POST);exit();
                break;
        	default:
            	// Setting template variables
        		$this->data['title'] = "";
        		$this->data['content'] = "";
        
        		// Setting the template
        		$this->view = 'login/login';
                }
 
    
    }
   

  public function getlogin($data) {
   $user=$data['usuario'];
   $pass=$data['pass'];

   $new = new LoginManager;
   
   $info = $new->getUsuario($user,$pass);

    echo $info;  
   
  }  
  
    
}