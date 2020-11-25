<?php
//session_destroy();
class RondaController extends Controller
{

    public function process($params)
    {
        switch ($params[0]) {
            case 'puntoscontrolCliente':
                $this->getPuntosContorlCliente($_POST);
                exit();
                break;
            case 'objetivosRondaCliente':
                $this->getObjetivosRondaCliente($_POST);
                exit();
                break;
            case 'guardoronda':
                $this->guardoRonda($_POST);
                exit();
                break;
            case 'rondacliente':
                $this->rondasCliente($_POST);
                exit();
                break;
            case 'editarronda':
                $this->editarRonda($_POST);
                exit();
                break;
            case 'eliminarRonda':
                $this->eliminarRonda($_POST);
                exit();
                break;
            case 'itemsRonda':
                $this->itemsRonda($_POST);
                exit();
                break;
            case 'objetivosModal':
                $this->objetivosModal($_POST);
                exit();
                break;
            case 'guardoItemRondaActualizada':
                $this->guardoItemRondaActualizada($_POST);
                exit();
                break;
            case 'eliminoItemRondaModal':
                $this->eliminoItemRondaModal($_POST);
                exit();
                break;
            case 'newItemRondaActualizada':
                $this->newItemRondaActualizada($_POST);
                exit();
                break;
            case 'objetivosClienteAdminRonda':
                $this->objetivosClienteAdminRonda($_POST);
                exit();
                break;



            case 'nuevaronda':
                $this->view = 'ronda/nuevaronda';
                break;
            default:
                $this->data['title'] = "";
                $this->data['content'] = "";

                $this->view = 'ronda/configuracion';
        }
        //Obtengo los clientes para el option de Clientes
        $clientes = $this->getClientes();

        $this->data['cliente'] = $clientes;
    }
    /************* COMIENZAN LOS SCRIPTS *************/

    //OBTENGO LOS CLIENTES PARA LAS RONDAS 

    public function getClientes()
    {

        $cli = new RondaManager;

        $clientes = $cli->getClientes();

        return $clientes;
    }

    //LISTO LOS PUNTOS DE CONTROL SEGUN EL CLIENTE

    public function getPuntosContorlCliente($data)
    {

        $idCliente = $data['id_cliente'];
        $objetivoCliente = $data['objetivoCliente'];

        $puntoCliente = new RondaManager;

        $result = $puntoCliente->getPuntosControlCliente($idCliente, $objetivoCliente);

        echo json_encode($result);
    }



    public function guardoRonda($data)
    {
        $cargarRondas = new RondaManager;

        $datos = $cargarRondas->cargaRonda($data);

        echo json_encode($datos);
    }


    public function rondasCliente($data)
    {

        $idClienteRonda = $data['id'];
        $idObjetivoCliente = $data['objetivo'];
        $filtro = $data['filtro'];
        $orden = $data['orden'];

        $ronda = new RondaManager;

        $rondasCliente = $ronda->getRondas($idClienteRonda,$idObjetivoCliente,$filtro,$orden);

        echo json_encode($rondasCliente);
    }

    public function editarRonda($data)
    {

        $idRonda = $data['idRonda'];
        $nombreRonda = $data['nombreRonda'];
        $estadoRonda = $data['estadoRonda'];

        $upadteRonda = new RondaManager;

        $rondaUpdate = $upadteRonda->updateRonda($idRonda, $nombreRonda, $estadoRonda);

        echo json_encode($rondaUpdate);
    }

    public function eliminarRonda($data)
    {

        $idRonda = $data['idRonda'];

        $deleteRonda = new RondaManager;

        $rondaDelete = $deleteRonda->deleteRonda($idRonda);

        echo json_encode($rondaDelete);
    }

    public function itemsRonda($data)
    {

        $idRonda = $data['idRonda'];

        $listItemRonda = new RondaManager;

        $listarRondaItems = $listItemRonda->listarItemsRonda($idRonda);

        echo json_encode($listarRondaItems);
    }

    public function getObjetivosRondaCliente($data)
    {

        $idClienteRonda = $data['id_cliente'];

        $selectObjetivos = new RondaManager;

        $selectObjetivosCliente = $selectObjetivos->listarObjetivosCliente($idClienteRonda);

        echo json_encode($selectObjetivosCliente);
    }

    public function objetivosModal($data)
    {
        $idClienteModal = $data['id'];

        $objetivosCliente = new RondaManager;

        $objetivosClienteModal = $objetivosCliente->listarObjetivosCliente($idClienteModal);

        echo json_encode($objetivosClienteModal);
    }

    public function guardoItemRondaActualizada($data)
    {

        $cargarItemsRondasModificada = new RondaManager;

        $datos = $cargarItemsRondasModificada->updateItemsRondasModificada($data);

        echo json_encode($datos);
    }

    public function eliminoItemRondaModal($data)
    {
        $idItemRonda = $data['idItemRonda'];

        $deleteItemRonda = new RondaManager;

        $eliminaItem = $deleteItemRonda->eliminoItemRondaModal($idItemRonda);

        echo json_encode($eliminaItem);
    }

    public function newItemRondaActualizada($data)
    {

        $idRondaNewItem = $data['idRondaNewItem'];
        $selectNewPuntosControlId = $data['selectNewPuntosControlId'];
        $ordenNewItem = $data['ordenNewItem'];
        $tiempoNewItem = $data['tiempoNewItem'];
        $qrCheckNewItem = $data['qrCheckNewItem'];
        $nfcCheckNewItem = $data['nfcCheckNewItem'];
        $llegueCheckNewItem = $data['llegueCheckNewItem'];

        $newItemRonda = new RondaManager;

        $nuevoItemRonda = $newItemRonda->newItemRondaActualizada($idRondaNewItem, $selectNewPuntosControlId, $ordenNewItem, $tiempoNewItem, $qrCheckNewItem, $nfcCheckNewItem, $llegueCheckNewItem);

        echo json_encode($nuevoItemRonda);
    }

    public function objetivosClienteAdminRonda($data)
    {
        $idObjetivoAdminRonda = $data['idClienteRonda'];

        $objetivosAdminRonda = new RondaManager;

        $rondaAdminObjetivos = $objetivosAdminRonda -> objetivosClienteAdminRonda($idObjetivoAdminRonda);

        echo json_encode($rondaAdminObjetivos);

    }
}
