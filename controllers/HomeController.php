<?php
//session_destroy();
class HomeController extends Controller
{
	public function process($params)
	{
	   
        $this->data['title'] = "";
		$this->data['content'] = "";
        
        if(!$_SESSION['data_user']){
		  $this->view = 'login/login';
		}else{
		  $this->view = 'home';
          $this->data['user']=$_SESSION['data_user'];
		}
    
    }

    
}