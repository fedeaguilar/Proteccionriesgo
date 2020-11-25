<?php


class sessionController extends Controller
{

    /**
     * @inheritDoc
     */
    public function process($params)
    {
        switch ($params[0]){
            case 'save':
                $this->save($_REQUEST);
                break;
        }
    }

    private function save($data){
        foreach ($data as $clave => $valor){
            $_SESSION[$clave] = $valor;
        }
    }
}