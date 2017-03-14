<?php

include_once '../../../../../librerias/claseGenerica.php';

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);

switch ($action) {
    case 'getPedidos':
        getPedidos();
        break;
    case 'procesarPedidos':
        procesarPedidos();
        break;
}

function getPedidos() {
    $cadena = $_POST['cadena'];
    $filtro = $_POST['filtro'];
    $fechaInicial = $_POST['fechaInicial'];
    $fechaFinal = $_POST['fechaFinal'];

    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        $condicion = "";
        $pieces = explode(" ", $cadena);

        switch ($filtro) {
            case "T":
                $condicion = "";
                break;
            case "C":
                for ($i = 0; $i < count($pieces); $i++) {
                    $condicion .= " and nombre_cliente like '%$pieces[$i]%' ";
                }
                break;
            case "V":
                for ($i = 0; $i < count($pieces); $i++) {
                    $condicion .= " and nombre_vendedor like '%$pieces[$i]%' ";
                }
                break;
            case "R":
                for ($i = 0; $i < count($pieces); $i++) {
                    $condicion .= " and nombre_ruta like '%$pieces[$i]%' ";
                }
                break;
            case "F":
                $fechaInicial = substr($fechaInicial, 6, 4) . substr($fechaInicial, 3, 2) . substr($fechaInicial, 0, 2);
                $fechaFinal = substr($fechaFinal, 6, 4) . substr($fechaFinal, 3, 2) . substr($fechaFinal, 0, 2);

                $condicion .= " and cast(convert(char(10), fecha, 112) as datetime) between '$fechaInicial' and '$fechaFinal' ";

                break;
        }

        $query = "select *, convert(char(10), fecha, 103) + ' ' + convert(char(5), fecha, 108) as fecha_caracter,
                  convert(char(10), fecha_pedido, 103) + ' ' + convert(char(5), fecha_pedido, 108) as fecha_pedido_caracter,
                  CAST(0 AS BIT) AS sel 
                  from tb_pedido_cabecera 
                  where id > 0 
                  " . $condicion . " 
                   and estado = 'P' 
                   order by id ";

        //echo $query;
        
        $result = $objetoBaseDatos->queryJson($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            echo $result;
        }
    }
}

function procesarPedidos() {
    $datosStore = $_POST['datosStorePedidos'];

    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
        return;
    }

    $objetoBaseDatosInterfaz = new claseBaseDatos();
    $objetoBaseDatosInterfaz->conectarseInterfaz();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatosInterfaz->getErrorConexionJson();
        return;
    }

    $error = 'N';
    $errorTraspaso = 'N';

    $objetoBaseDatos->autocommit(false);
    $objetoBaseDatosInterfaz->autocommit(false);

    $records = json_decode(stripslashes($datosStore));

    foreach ($records as $record) {
        $id = $record->id;

        $query = "
                    EXEC SP_PROCESAR_PEDIDO
                    @id = '$id',    
                    @OPERACION = 'QC'
                ";
        
        $resultCabecera = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getError()) {
            $error = 'S';
            $result = $resultCabecera;
            break;
        }

        $query = "
                    EXEC SP_PROCESAR_PEDIDO
                    @id = '$id',    
                    @OPERACION = 'QD'
                ";
        
        $resultDetalle = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getError()) {
            $error = 'S';
            $result = $resultDetalle;
            break;
        }

        $errorTraspaso = traspasoPedido($objetoBaseDatosInterfaz, $resultCabecera, $resultDetalle);

        if ($errorTraspaso == 'N') {
            $query = "
                    EXEC SP_PROCESAR_PEDIDO
                    @id = '$id',    
                    @OPERACION = 'UPD'
                ";

            $result = $objetoBaseDatos->exec($query, "Se realizo la transaccion correctamente");

            if ($objetoBaseDatos->getError()) {
                $error = 'S';
                break;
            }
        }
    }

    if ($error == 'S' || $errorTraspaso == 'S') {        
        if ($error == 'S') {
            echo $objetoBaseDatos->getErrorJson($query);
            $objetoBaseDatos->rollback();
        }

        if ($errorTraspaso == 'S') {
            $objetoBaseDatosInterfaz->rollback();
        }
    } else {                
        $objetoBaseDatos->commit();
        $objetoBaseDatosInterfaz->commit();
        echo $result;
    }
}

function traspasoPedido($objetoBaseDatosInterfaz, $resultCabecera, $resultDetalle) {        
    $error = 'N';

    $empresa = 1;
    $bodega = 1;
    $clavedocum = 'PEDI';
    $tipodocum = 'PE';
    $id = $resultCabecera[0]['id'];
    $cliente = $resultCabecera[0]['codigo_cliente'];
    $vendedor = $resultCabecera[0]['codigo_vendedor'];
    $forma = '';
    $retiro = '';
    $plazo = 0;
    $status = 'A';
    $impreso = 'N';
    $observacion = trim($resultCabecera[0]['observacion']);
    $totalgravado = trim($resultCabecera[0]['subtotal']);
    $totalnogravado = 0;
    $totdscto = 0;
    $totimp = trim($resultCabecera[0]['iva']);
    $total = trim($resultCabecera[0]['total']);
    $rutas = trim($resultCabecera[0]['codigo_ruta']);
    $codaltrut = '';
    $nomruta = trim($resultCabecera[0]['nombre_ruta']);
    $transporte = '';

    $query = "select isnull(MAX(nrodoc), 0) as nrodoc
              from transcab
              where clavedocum = 'PEDI'
              and tipodocum = 'PE'
            ";

    $result = $objetoBaseDatosInterfaz->query($query);

    if ($objetoBaseDatosInterfaz->getError()) {
        echo $objetoBaseDatosInterfaz->getErrorJson($query);
        return 'S';
    }

    $nrodoc = $result[0]['nrodoc'] + 1;

    $query = "
            insert into dbo.tmptranscab(empresa, bodega, clavedocum, tipodocum, nrodoc, fecha, fechac,
            cliente, vendedor, forma, retiro, plazo,
            subtotalccc, totimpc, totimpcccc, totdsctoc, totalc,
            status, impreso, observacion,
            totalgravadoc, totalnogravadoc, nrodocnew, nrodochis,
            totalgravado, totalnogravado, totdscto, totimp, total,
            empresa_apl, bodega_apl, clavedocum_apl, tipodocum_apl, nrodoc_apl,
            rutas, codaltrut, nomruta, transporte,
            archiva, visita, idpedidoweb)
            values('$empresa', '$bodega', '$clavedocum', '$tipodocum', '$nrodoc', convert(char(10), getdate(), 103), getdate(),
            '$cliente', '$vendedor', '$forma', '$retiro', '$plazo',
            null, null, null, null, null,
            '$status', '$impreso', '$observacion',
            null, null, null, null,
            '$totalgravado', '$totalnogravado', '$totdscto', '$totimp', '$total',
            null, null, null, null, null,
            '$rutas', '$codaltrut', '$nomruta', '$transporte',
            null, null, '$id')
            ";

    $result = $objetoBaseDatosInterfaz->exec($query, 'Se ingreso el Registro correctamente ...');

    if ($objetoBaseDatosInterfaz->getError()) {
        echo $objetoBaseDatosInterfaz->getErrorJson($query);
        return 'S';
    }

    foreach ($resultDetalle as $key => $value) {                
        $articulo = $value['codigo_producto'];
        $preclist = $value['precio'];
        $cantidad = $value['cantidad'];
        $impreng = $value['subtotal'];
        $totdto = 0;
        $totimp = 0; //adicionar campo iva
        $totreng = $value['total'];
        $imptoactual = 14;
        $porcdscto = 0;
        $contrato = 0;
        $preccost = 0;
        
        //echo $nrodoc . "<br>";

        $query = "
            insert into dbo.tmptransdet(empresa, bodega, clavedocum, tipodocum, nrodoc, fecha, 
            cliente, vendedor, articulo,
            preciolstc, cantidadc, preclistac, impsubc, totsubcc, totimpcc, totimpccc, totdsctoc, nrodochis,
            preclist, cantidad, impreng, totdto, totimp, totreng, imptoactual, 
            listas, porcdscto, status, fechac, contrato, impreso, archiva, preccost)
            values('$empresa', '$bodega', '$clavedocum', '$tipodocum', '$nrodoc', convert(char(10), getdate(), 103),
            '$cliente', '$vendedor', '$articulo',
            null, null, null, null, null, null, null, null, null,
            '$preclist', '$cantidad', '$impreng', '$totdto', '$totimp', '$totreng', '$imptoactual',
            null, '$porcdscto', '$status', getdate(), '$contrato', null, null, '$preccost')
                ";
                
        $result = $objetoBaseDatosInterfaz->exec($query, 'Se ingreso el Registro correctamente ...');

        if ($objetoBaseDatosInterfaz->getError()) {
            echo $objetoBaseDatosInterfaz->getErrorJson($query);
            return 'S';
            //break;
        }
    }

    if ($error == 'N') {
        $query = "
            EXEC SpProcesaPedidosWeb
            @nrodoc = '$nrodoc'
            ";
        
        //echo $query;
        
        $result = $objetoBaseDatosInterfaz->exec($query, 'Se ingreso el Registro correctamente ...');

        if ($objetoBaseDatosInterfaz->getError()) {
            echo $objetoBaseDatosInterfaz->getErrorJson($query);
            return 'S';
            //break;
        }
    }

    if ($error == 'N') {
        return 'N';
    }
}
