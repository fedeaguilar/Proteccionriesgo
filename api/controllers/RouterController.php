<?php
//error_reporting(0);   

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: authorization, auth, Origin, Content-Type, X-Auth-Token");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Credentials:true');
header('Content-type: application/json'); 
 
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
           
           
            if ($un==='PDRAPP' and $pw==='P1jiu7ncRjnjdkS'){
				//echo "hola"; 
				$controllerClass = $this->dashesToCamel(array_shift($parsedUrl)) . 'Controller';
				if (file_exists('controllers/' . $controllerClass . '.php'))
				{
				$this->controller = new $controllerClass;  
				}
				$this->controller->process($parsedUrl);          
            }else{
               echo $this->errorloginbasic();
			   //echo $ip=$this->getRealIP();	
			   //echo "hola";     
        	   exit();
            }
 
        
        
        
        /*
        $controllerClass = $this->dashesToCamel(array_shift($parsedUrl)) . 'Controller';
		
		if (file_exists('controllers/' . $controllerClass . '.php'))
        {
        $this->controller = new $controllerClass;  
        }
		$this->controller->process($parsedUrl);
         */
        
	}
    
  public function errorloginbasic(){
       header('HTTP/1.0 200 OK');
                $error=array(
                            "type"=> "http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html",
                            "title"=> "Usuario o clave erroneas",
                            "status"=> 200,
                            "detail"=>"Usuario o clave erroneas");
      echo(json_encode($error)); 
    } 
     
}