<?php
error_reporting(0);    
class RouterController extends Controller
{
	/**
	 * @var Controller The inner controller instance
	 */
	protected $controller;

	/**
	 * Parses the URL address using slashes and returns params as array
	 * @param string $url The URL address to be parsed
	 * @return array The URL parameters
	 */
	private function parseUrl($url)
	{
		// Parses URL parts into an associative array
		 $parsedUrl = parse_url($url);
        
		// Removes the leading slash
		$parsedUrl["path"] = ltrim($parsedUrl["path"], "/");
		// Removes white-spaces around the address
		$parsedUrl["path"] = trim($parsedUrl["path"]);
		// Splits the address by slashes
		$explodedUrl = explode("/", $parsedUrl["path"]);
		return $explodedUrl;
	}

	/**
	 * Converts dashed controller name from URL into a CamelCase class name
	 * @param string $text The controller name using dashes like article-list
	 * @return string The class name of the controller like ArticleList
	 */
	private function dashesToCamel($text)
	{
		$text = str_replace('-', ' ', $text);
		$text = ucwords($text);
		$text = str_replace(' ', '', $text);
		return $text;
	}

	/**
	 * Parses the URL address and creates appropriate controller
	 * @param array $params The URL address as an array of a single element
	 */
	public function process($params)
	{
	   
	 	$parsedUrl = $this->parseUrl($params[0]);
		
		
        $un= $_SERVER["PHP_AUTH_USER"];
        $pw= $_SERVER['PHP_AUTH_PW'];
	
        
       //echo $_SERVER["HTTP_AUTH"]."<br />"; 
                     
        if (isset($_SERVER["HTTP_AUTHORIZATION"]) && 0 === stripos($_SERVER["HTTP_AUTHORIZATION"], 'Basic ')) {
        		$exploded = explode(':', base64_decode(substr($_SERVER["HTTP_AUTHORIZATION"], 6)), 2);
        		if (2 == \count($exploded)) {
        			list($un, $pw) = $exploded;
        		}		
        	}
        /*echo $un ."<br />";
        echo $pw ."<br />";  
        echo $_SERVER["HTTP_AUTHORIZATION"]."<br />";
        
        $_SERVER["HTTP_Username"]."<br /> tipo";
        $_SERVER["HTTP_Password"]."<br /> tipo";
        
        print_R($exploded);  
            
        print_r($_SERVER);
        exit();    
        */    
            if ($un==='PDRAPP' and $pw==='P1jiu7ncRjnjdkS'){
             //echo "hola";           
            }else{
               echo $this->errorloginbasic();
               //echo $ip=$this->getRealIP();	   
        	   exit();
            }
            if (!isset($un)|| !isset($pw)){
               echo $this->errorloginbasic();
                //echo $ip=$this->getRealIP();
               exit();
        	}
 
        
        
        
        
        $controllerClass = $this->dashesToCamel(array_shift($parsedUrl)) . 'Controller';
		
		if (file_exists('controllers/' . $controllerClass . '.php'))
        {
        $this->controller = new $controllerClass;  
        }
		$this->controller->process($parsedUrl);
         
        
	}
    
  public function errorloginbasic(){
       header('HTTP/1.0 401 Unauthorized');
                $error=array(
                            "type"=> "http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html",
                            "title"=> "Unauthorized",
                            "status"=> 401,
                            "detail"=>"Unauthorized");
      echo(json_encode($error)); 
    } 
     
}