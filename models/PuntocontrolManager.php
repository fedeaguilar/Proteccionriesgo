<?php

class PuntocontrolManager extends Db
{

    //DAMOS DE ALTA UN NUEVO CONTROL

    public function cargaControl($idCliente, $nombre, $idObjetivo, $objetivo, $fecha)
    {
        $query_control = "INSERT INTO puntoscontrol (id_cliente,nombre,id_objetivo,objetivo,fecha) VALUES ('" . $idCliente . "', '" . $nombre . "', '" . $idObjetivo . "', '" . $objetivo . "', '" . $fecha . "')";

        return Db::insert($query_control);
    }


    //OBTENEMOS LOS CLIENTES     

    public function getClientes()
    {
        $query = "SELECT codigo, nombre FROM clientes ORDER BY nombre ASC";

        return Db::queryAll($query);
    }


    //OBTENEMOS LOS OBJETIVOS SEGUN EL CLIENTE SELECCIONADO 

    public function listarObjetivos($idCliente)
    {
        $query = "SELECT LTRIM(RTRIM(obj.nombre)) AS 'nombre_objetivo', obj.codigo AS 'codigo_objetivo' FROM dbo.clientes_por_objetivo AS cli
            LEFT JOIN objetivos obj ON obj.codigo = cli.objetivo
            INNER JOIN clientes c ON c.codigo = cli.cliente
            WHERE cli.cliente = $idCliente";

        return Db::queryAll($query);
    }

    //ELIMINAMOS UN CONTROL 

    public function eliminarControl($idcambiarEstado)
    {
        $query = "UPDATE puntoscontrol SET estado = '0' WHERE id = :id";

        return Db::update($query, $idcambiarEstado);
    }

    //ACTUALIZAMOS UN CONTROL

    public function actualizarControl($arrayModificar)
    {
        $query = "UPDATE puntoscontrol SET nombre = :nombre, id_objetivo = :id_objetivo, objetivo = :objetivo WHERE id = :id";

        return Db::update($query, $arrayModificar);
    }


    //TRAEMOS LOS PUNTOS DE CONTROL 

    public function getControlCliente($idCliente, $idobjetivo)
    {
        $query = "SELECT * FROM puntoscontrol WHERE id_cliente = $idCliente AND id_objetivo = $idobjetivo AND estado = 1";

        return Db::queryAll($query);
    }


    //PREGUNTAMOS SI UN PUNTO DE CONTROL ESTA ASIGNADO A UNA RONDA
    public function controlset($idPuntoControl)
    {
        $query = "SELECT count(*) FROM item_ronda WHERE id_puntocontrol = $idPuntoControl";

        return Db::querySingle($query);
    }

}
