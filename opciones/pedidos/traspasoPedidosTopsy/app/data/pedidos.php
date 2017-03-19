<?php

include_once '../../../../../librerias/claseGenerica.php';

date_default_timezone_set("America/Guayaquil");

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);

switch ($action) {
    case 'getPedidos':
        getPedidos();
        break;
    case 'getPedidoDetalle':
        getPedidoDetalle();
        break;
    case 'procesarPedidos':
        procesarPedidos();
        break;
    case 'eliminarPedido':
        eliminarPedido();
        break;
    case 'generarPedidoCabeceraExcel':
        generarPedidoCabeceraExcel();
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
                  where id >= 1 
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

function getPedidoDetalle() {
    $idPedidoCabecera = $_POST['id_pedido_cabecera'];
    $fechaInicial = $_POST['fechaInicial'];
    $fechaFinal = $_POST['fechaFinal'];

    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        $query = "
                    EXEC SP_PEDIDO_DETALLE
                    @id_pedido_cabecera = '$idPedidoCabecera',    
                    @OPERACION = 'QPD'
                ";

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
    $S_us_codigo = $_POST['S_us_codigo'];

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

        //Si hay un error $errorTraspaso tiene valor de 'S', si no hay error entonces $errorTraspaso toma el valor del nrodoc
        $errorTraspaso = traspasoPedido($objetoBaseDatosInterfaz, $resultCabecera, $resultDetalle);

        if ($errorTraspaso != 'S') {
            $nrodoc = $errorTraspaso;

            $query = "
                    EXEC SP_PROCESAR_PEDIDO
                    @id = '$id', 
                    @nrodoc = '$nrodoc',    
                    @S_US_CODIGO = '$S_us_codigo',     
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
    $deudaCliente = $resultCabecera[0]['deuda_cliente'];
    
    if ($deudaCliente > 0) {
        $status = 'R';
    }

    $observacion = trim(str_replace("'", "''", $observacion));

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
        $totimp = $value['iva'];
        $totreng = $value['total'];
        $imptoactual = $value['porcentaje_iva'];
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
            @nrodoc = '$nrodoc',
            @deuda = '$deudaCliente'     
            ";

        //echo $query;

        $result = $objetoBaseDatosInterfaz->exec($query, 'Se ingreso el Registro correctamente ...');

        if ($objetoBaseDatosInterfaz->getError()) {
            echo $objetoBaseDatosInterfaz->getErrorJson($query);
            return 'S';
            //break;
        }
    }

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

    $nrodoc = $result[0]['nrodoc'];

    if ($error == 'N') {
        return $nrodoc;
    }
}

function eliminarPedido() {
    $id = $_POST['id'];
    $S_us_codigo = $_POST['S_us_codigo'];

    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        $query = "
                    EXEC SP_PEDIDO_CABECERA
                    @id = '$id',
                    @S_US_CODIGO = '$S_us_codigo',
                    @OPERACION = 'DP'
                ";

        //echo $query;

        $result = $objetoBaseDatos->queryJson($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            echo $result;
        }
    }
}

function generarPedidoCabeceraExcel() {
    $filtro = $_POST['filtro'];
    $busqueda = $_POST['busqueda'];
    $fechaInicial = $_POST['fechaInicial'];
    $fechaFinal = $_POST['fechaFinal'];
    $datosStore = $_POST['datosStorePedidos'];

    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
        return;
    }

    //$datosStore = str_replace('\"', '', $datosStore);      
    //$datosStore = str_replace('\u00c1', 'Á', $datosStore);
    //$datosStore = str_replace('\u00c9', 'É', $datosStore);
    //$datosStore = str_replace('\u00cd', 'Í', $datosStore);
    //$datosStore = str_replace('\u00d3', 'Ó', $datosStore);
    //$datosStore = str_replace('\u00da', 'Ú', $datosStore);
    //$datosStore = str_replace('\u00e1', 'á', $datosStore);
    //$datosStore = str_replace('\u00e9', 'é', $datosStore);
    //$datosStore = str_replace('\u00ed', 'í', $datosStore);
    //$datosStore = str_replace('\u00f3', 'ó', $datosStore);
    //$datosStore = str_replace('\u00fa', 'ú', $datosStore);    
    //$datosStore = str_replace('\u00d1', 'Ñ', $datosStore);
    //$datosStore = str_replace('\u00f1', 'ñ', $datosStore);           
    //echo $datosStore;
    $records = json_decode(stripslashes($datosStore));

    $hoy = date("Ymd His");
    $fechaReporte = "Fecha Reporte: " . date("d/m/Y H:i:s");

    $nombreExcel = $hoy . '.xlsx';
    //$filezip = '../../../../../descargas/comisiones/abc.zip';
    //$filezip2 = 'abc.zip';
    //$filezip3 = 'abc.xlsx';    

    $objPHPExcel = new PHPExcel();

    $objPHPExcel->getProperties()->setCreator("JPabloS") // Nombre del autor
            ->setLastModifiedBy("JPabloS") //Ultimo usuario que lo modificó
            ->setTitle("Reporte de Pedidos Topsy") // Titulo
            ->setSubject("Reporte de Pedidos Topsy") //Asunto
            ->setDescription("Reporte de Pedidos Topsy") //Descripción
            ->setKeywords("Reporte de Pedidos Topsy") //Etiquetas
            ->setCategory("Reporte de Pedidos Topsy"); //Categorias

    $tituloReporte = "Reporte en Excel de Pedidos Topsy";

    generarDetalleExcel($objPHPExcel, $records);

    $objPHPExcel->setActiveSheetIndex(0);

    switch ($filtro) {
        case 'TODOS':
            $fechaInicial = "";
            $fechaFinal = "";
            $busqueda = "";
            $filtro = "FILTRO: " . $filtro;
            break;
        case 'CLIENTE':
            $fechaInicial = "";
            $fechaFinal = "";
            $filtro = "FILTRO: " . $filtro . " '%" . $busqueda . "%'";
            break;
        case 'RUTA':
            $fechaInicial = "";
            $fechaFinal = "";
            $filtro = "FILTRO: " . $filtro . " '%" . $busqueda . "%'";
            break;
        case 'VENDEDOR':
            $fechaInicial = "";
            $fechaFinal = "";
            $filtro = "FILTRO: " . $filtro . " '%" . $busqueda . "%'";
            break;
        case 'FECHA':
            $fechaInicial = " FECHA INICIAL: " . $fechaInicial;
            $fechaFinal = " FECHA FINAL: " . $fechaFinal;
            $filtro = "FILTRO: " . $filtro . $fechaInicial . " " . $fechaFinal;
            break;
    }

    $objPHPExcel->getActiveSheet()->setCellValue('B2', 'TOPSY REPORTE EXCEL');

    $objPHPExcel->getActiveSheet()->setCellValue('B4', $filtro);
    $objPHPExcel->getActiveSheet()->setCellValue('B5', $fechaReporte);

    $objPHPExcel->getActiveSheet()->getStyle('B2:B8')->getFont()->setBold(true);

    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('../../../../../descargas/' . $nombreExcel);

    $result = $objetoBaseDatos->getCadenaJson($nombreExcel, true);

    echo $result;
}

function generarDetalleExcel($objPHPExcel, $records) {
    $hoja = 0;
    $titulosColumnas = array('Pedido', 'Fono', 'Cliente', 'Vendedor', 'Ruta',
        'Fecha', 'Fecha Pedido', 'Observacion', 'Total', 'Sel');

    $filaEncabezados = 7; //fila donde estan los encabezados

    $letra = 'A';
    for ($i = 0; $i < count($titulosColumnas); $i++) {
        $letra++;
        $objPHPExcel->setActiveSheetIndex($hoja)
                ->setCellValue($letra . $filaEncabezados, $titulosColumnas[$i]);
    }
    $objPHPExcel->getActiveSheet()
            ->getStyle('B' . $filaEncabezados . ':V' . $filaEncabezados)->getFont()->setBold(true);

    $i = 8; //desde que fila se comienzan a escribir los datos    

    $styleBorderArray = array(
        'borders' => array(
            'allborders' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN
            )
        )
    );

    $styleCenterArray = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
        )
    );

    $sumCheque = array();
    $inicial = $i;
    $numeroPedidos = 0;
    $numeroPedidosSel = 0;

    foreach ($records as $record) {
        $sel = 'N';
        if ($record->sel) {
            $sel = 'S';
            $numeroPedidosSel++;
        }

        $objPHPExcel->setActiveSheetIndex($hoja)
                ->setCellValueExplicit('B' . $i, trim($record->id), PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValueExplicit('C' . $i, trim($record->id_pedido_fono), PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValueExplicit('D' . $i, trim($record->nombre_cliente), PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValueExplicit('E' . $i, trim($record->nombre_vendedor), PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValueExplicit('F' . $i, trim($record->nombre_ruta), PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValueExplicit('G' . $i, trim($record->fecha_caracter), PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValueExplicit('H' . $i, trim($record->fecha_pedido_caracter), PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValueExplicit('I' . $i, trim($record->observacion), PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValue('J' . $i, $record->total)
                ->setCellValueExplicit('K' . $i, trim($sel), PHPExcel_Cell_DataType::TYPE_STRING);
        $i++;
        $numeroPedidos++;
    }

    $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(10);
    $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(12);
    $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(12);
    $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(40);
    $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(40);
    $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(40);
    $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(20);
    $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(20);
    $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(50);
    $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(15);
    $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(10);

    $objPHPExcel->getActiveSheet()->getStyle('B' . $filaEncabezados . ':K' . ($i))->applyFromArray($styleBorderArray);

    $objPHPExcel->getActiveSheet()->getStyle('B' . $filaEncabezados . ':K' . $filaEncabezados)->applyFromArray($styleCenterArray);
    $objPHPExcel->getActiveSheet()->getStyle('B' . $filaEncabezados . ':B' . ($i + 150))->applyFromArray($styleCenterArray);
    $objPHPExcel->getActiveSheet()->getStyle('C1:C' . ($i + 150))->applyFromArray($styleCenterArray);
    $objPHPExcel->getActiveSheet()->getStyle('G1:G' . ($i + 150))->applyFromArray($styleCenterArray);
    $objPHPExcel->getActiveSheet()->getStyle('H1:H' . ($i + 150))->applyFromArray($styleCenterArray);
    $objPHPExcel->getActiveSheet()->getStyle('K1:K' . ($i + 150))->applyFromArray($styleCenterArray);

    $objPHPExcel->getActiveSheet()->setCellValue('D' . $i, 'NUMERO PEDIDOS: ');
    $objPHPExcel->getActiveSheet()->setCellValue('E' . $i, $numeroPedidos);
    $objPHPExcel->getActiveSheet()->setCellValue('F' . $i, 'NUMERO PEDIDOS SEL: ');
    $objPHPExcel->getActiveSheet()->setCellValue('G' . $i, $numeroPedidosSel);
    $objPHPExcel->getActiveSheet()->setCellValue('I' . $i, 'TOTAL SEL: ');
    $objPHPExcel->getActiveSheet()->setCellValue('J' . $i, '=SUMIF(K' . $inicial . ':K' . ($i - 1) . ', "=S", J' . $inicial . ':J' . ($i - 1) . ')');

    //$objPHPExcel->getActiveSheet()->getStyle('B' . $finGlobal)->applyFromArray($styleCenterArray);
    $objPHPExcel->getActiveSheet()->getStyle('B' . $i . ':K' . $i)->getFont()->setBold(true);
    cellColor($objPHPExcel, 'B' . $i . ':K' . $i, 'F28A8C');

    $objPHPExcel->getActiveSheet()->getStyle('J1:J' . ($i + 150))->getNumberFormat()->setFormatCode("$* #,##0.00");
}

function cellColor($objPHPExcel, $cells, $color) {
    $objPHPExcel->getActiveSheet()->getStyle($cells)->getFill()->applyFromArray(array(
        'type' => PHPExcel_Style_Fill::FILL_SOLID,
        'startcolor' => array(
            'rgb' => $color
        )
    ));
}
