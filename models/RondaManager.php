<?php

class RondaManager
{

    public function updateItemsRondasModificada($data)
    {
        foreach ($data['idRondaItems'] as $fila) {
            $i[] = $fila;
        }

        $idRondaItems = array_combine($i, $data['idRondaItems']);
        $itemsOrdenronda = array_combine($i, $data['itemsOrdenronda']);
        $itemstiempo = array_combine($i, $data['itemstiempo']);
        $qr = array_combine($i, $data['qrCheck']);
        $nfc = array_combine($i, $data['nfcCheck']);
        $llegue = array_combine($i, $data['llegueCheck']);

        foreach ($idRondaItems as $fila) {
            $query = "UPDATE item_ronda 
                          SET orden = '" . $itemsOrdenronda[$fila] . "',
                          tiempo = '" . $itemstiempo[$fila] . "',  
                          qr = '" . $qr[$fila] . "', 
                          nfc = '" . $nfc[$fila] . "', 
                          llegue = '" . $llegue[$fila] . "' 
                          WHERE id = '" . $fila . "'";
            Db::update($query);
        }
    }


    public function cargaRonda($data)
    {

        $id_cliente = $data['cliente'];
        $nombre_ronda = $data['nombre'];
        $fecha = date("Y-m-d");

        $query_ronda = "INSERT INTO rondas (nombre,id_cliente,fecha) 
                            VALUES ('" . $nombre_ronda . "','" . $id_cliente . "', '" . $fecha . "')";
        $id_ronda = Db::insert($query_ronda);

        foreach ($data['itemsronda'] as $fila) {
            $i[] = $fila;
        }
        $itemsronda = array_combine($i, $data['itemsronda']);
        $itemstiempo = array_combine($i, $data['itemstiempo']);
        $itemscontrol = array_combine($i, $data['itemscontrol']);
        $qr = array_combine($i, $data['qrCheck']);
        $nfc = array_combine($i, $data['nfcCheck']);
        $llegue = array_combine($i, $data['llegueCheck']);

        foreach ($itemsronda as $fila => $valor) {
            $query = "INSERT INTO item_ronda (id_ronda, id_puntocontrol, orden,tiempo,qr,nfc,llegue) 
                        VALUES ('" . $id_ronda . "','" . $itemscontrol[$fila] . "' , '" . $valor . "', '" . $itemstiempo[$fila] . "','" . $qr[$fila] . "','" . $nfc[$fila] . "','" . $llegue[$fila] . "')";

            Db::insert($query);
        }
    }

    public function getObjetivos()
    {
        $query = "SELECT * FROM objetivos";

        return Db::queryAll($query);
    }

    public function getClientes()
    {
        $query = "SELECT * FROM clientes ORDER BY nombre ASC";

        return Db::queryAll($query);
    }

    public function getPuntosControlCliente($idCliente, $objetivoCliente)
    {
        $query = "SELECT * FROM puntoscontrol WHERE id_cliente = $idCliente AND id_objetivo = $objetivoCliente AND estado = '1' ";

        return Db::queryAll($query);
    }


    public function eliminarRonda($idcambiarEstado)
    {
        $query = "UPDATE puntoscontrol SET estado = '0' WHERE id = :id";

        return Db::update($query, $idcambiarEstado);
    }

    public function modificarRonda($arrayModificar)
    {
        $query = "UPDATE puntoscontrol SET nombre = :nombre, objetivo = :objetivo WHERE id = :id";

        return Db::update($query, $arrayModificar);
    }

    public function getRondas($id,$objetivo,$filtro,$orden)
    {
        $query = "select r.*, pc.id_objetivo
                    from puntoscontrol pc
                    inner join item_ronda ir ON ir.id_puntocontrol= pc.id
                    inner join rondas r ON r.id = ir.id_ronda
                    where pc.id_cliente = $id AND pc.id_objetivo = $objetivo
                    group by r.id, r.nombre, r.id_cliente, r.fecha, r.estado, r.activo,pc.id_objetivo ORDER BY $filtro $orden";

        return Db::queryAll($query);
    }

    public function updateRonda($idRonda, $nombreRonda, $estadoRonda)
    {
        $query = "UPDATE rondas SET nombre = '" . $nombreRonda . "', estado = $estadoRonda WHERE id = $idRonda";

        return Db::update($query);
    }

    public function deleteRonda($idRonda)
    {
        $query = "UPDATE rondas SET activo = '0' WHERE id = $idRonda";

        return Db::update($query);
    }

    public function listarItemsRonda($idRonda)
    {
        $query = "SELECT 
                    item_ronda.id_ronda,
                    item_ronda.id,
                    puntoscontrol.id AS puntocontrol_id,
                    puntoscontrol.nombre,
                    item_ronda.orden, 
                    item_ronda.tiempo, 
                    item_ronda.qr, item_ronda.nfc, item_ronda.llegue, puntoscontrol.objetivo, puntoscontrol.id_objetivo
                FROM item_ronda
                    INNER JOIN puntoscontrol ON item_ronda.id_puntocontrol = puntoscontrol.id
                WHERE id_ronda = '" . $idRonda . "' AND item_ronda.estado = '1'";

        return Db::queryAll($query);
    }

    public function listarObjetivosCliente($idCliente)
    {
        $query = "SELECT LTRIM(RTRIM(obj.nombre)) AS 'nombre_objetivo', obj.codigo AS 'codigo_objetivo' FROM dbo.clientes_por_objetivo AS cli
        LEFT JOIN objetivos obj ON obj.codigo = cli.objetivo
        INNER JOIN clientes c ON c.codigo = cli.cliente
        WHERE cli.cliente = $idCliente";

        return Db::queryAll($query);
    }

    public function eliminoItemRondaModal($idItemRonda)
    {
        $query = " UPDATE item_ronda SET estado = 0 WHERE id = '" . $idItemRonda . "'";

        return Db::update($query);
    }

    public function newItemRondaActualizada($idRondaNewItem, $selectNewPuntosControlId, $ordenNewItem, $tiempoNewItem, $qrCheckNewItem, $nfcCheckNewItem, $llegueCheckNewItem)
    {
        $query = "INSERT INTO item_ronda (id_ronda,id_puntocontrol,orden,tiempo,qr,nfc,llegue) 
                VALUES ('" . $idRondaNewItem . "','" . $selectNewPuntosControlId . "','" . $ordenNewItem . "','" . $tiempoNewItem . "','" . $qrCheckNewItem . "','" . $nfcCheckNewItem . "','" . $llegueCheckNewItem . "')";

        return Db::insert($query);
    }

    public function objetivosClienteAdminRonda($idClienteAdminRonda)
    {
        $query = "SELECT LTRIM(RTRIM(obj.nombre)) AS 'nombre_objetivo', obj.codigo AS 'codigo_objetivo' FROM dbo.clientes_por_objetivo AS cli
        LEFT JOIN objetivos obj ON obj.codigo = cli.objetivo
        INNER JOIN clientes c ON c.codigo = cli.cliente
        WHERE cli.cliente = '" . $idClienteAdminRonda . "'";

        return Db::queryAll($query);
    }
}
