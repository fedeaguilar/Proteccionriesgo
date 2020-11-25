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
    /**
     * @var string A template name without the extension
     */
    //protected $view = "";
    /**
     * @var array The HTML head
     */
	//protected $head = array('title' => '', 'description' => '');

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
    abstract function process($params);
}
