<?php

/**
 * A base controller for ICT.social MVC
 * Class Controller
 */
abstract class Controller
{

    /**
     * @var array An array which indexes will be accessible as variables in template
     */
    protected $data = array();
    protected $data_saldo = array();
    /**
     * @var string A template name without the extension
     */
    protected $view = "";
    /**
     * @var array The HTML head
     */
	protected $head = array('title' => '', 'description' => '');

    /**
     * Protects any variable by converting HTML special characters to entities
     * @param mixed $x The variable to be protected
     * @return mixed The protected variable
     */
    private function protect($x = null)
    {
        if (!isset($x))
            return null;
        elseif (is_string($x))
            return htmlspecialchars($x, ENT_QUOTES);
        elseif (is_array($x))
        {
            foreach($x as $k => $v)
            {
                $x[$k] = $this->protect($v);
            }
            return $x;
        }
        else
            return $x;
    }

    /**
     * Renders the view
     */
    public function renderView()
    {
        if ($this->view)
        {
            extract($this->protect($this->data));
            extract($this->data, EXTR_PREFIX_ALL, "");
            require_once("views/" . $this->view . ".phtml");
        }
        else
        {
            //require_once('controllers/api/api.php');
        }
    }

    /**
     * @param string $url Redirects to a given URL
     */
	public function redirect($url)
	{
		header("Location: /$url");
		header("Connection: close");
        // exit;
	}

    /**
     * Renders the header of the view
     */
    public function renderHeaderView($header)
    {
        if ($header)
        {
            extract($this->protect($this->data));
            extract($this->data, EXTR_PREFIX_ALL, "");
            require("views/" . $header . ".phtml");
        }
    }

    /**
     * Renders the header of the view
     */
    public function renderFooterView($footer)
    {
        if ($footer)
        {
            extract($this->protect($this->data));
            extract($this->data, EXTR_PREFIX_ALL, "");
            require("views/" . $footer . ".phtml");
        }
    }

    /**
     * Avoid the corrupt data
     * 
     */
    private function filtered($data)
    {
        $data = trim($data); // Elimina espacios antes y después de los data
        $data = stripslashes($data); // Elimina backslashes \
        $data = htmlspecialchars($data); // Traduce caracteres especiales en entidades HTML
        return $data;
    }

    private function validRequired($value)
    {
        $value = trim($value);
        if(strlen($value) == 0){
           return false;
        }else{
           return true;
        }
     }

    private function validInteger($value, $options=null)
    {
        if(filter_var($value, FILTER_VALIDATE_INT, $options) === FALSE){
           return false;
        }else{
           return true;
        }
    }

    private function validEmail($value)
    {
        if(filter_var($value, FILTER_VALIDATE_EMAIL) === FALSE){
           return false;
        }else{
           return true;
        }
    }

    private function valid_date($date){ //echo $date."<br/>";
        $values = explode('-', $date); //print_r($values); echo "<br/>";
        if(count($values) == 3 && checkdate($values[1], $values[2], $values[0])){
            return true;
        }
        return false;
    }

    /**
     * The main controller method
     * @param array $params URL parameters
     */
    abstract function process($params);
}
