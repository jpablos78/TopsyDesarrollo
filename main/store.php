<?php

include_once '../librerias/claseGenerica.php';

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);

switch ($action) {
    case 'listarAll':
        listarAll();
        break;
    case 'listarAll2':
        listarAll2();
        break;
    case 'listarAllF':
        listarAllF();
        break;
    case 'listarAllM':
        listarAllM();
        break;
    case 'guardar':
        guardar();
        break;
    case 'actualizar':
        actualizar();
        break;
    case 'eliminar':
        eliminar();
        break;
    case 'identificarUsuario':
        identificarUsuario();
        break;
}

function actualizar() {
    $records = json_decode(stripslashes($_POST['menu']));
    //echo $records;
    //echo 'fdfdsfsadfxxxx';



    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {

//        $query = "update wp_menu2
//                  set mn_orden = '00000000'";
//        $result = $objetoBaseDatos->exec($query);

        $query = "CALL pwp_menu_opciones('U', '', '', '', '')";

        $result = $objetoBaseDatos->exec($query);
        $error = 'N';

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson($query);
        } else {
            foreach ($records as $record) {
                $mn_codigo = $record->mn_codigo;
                $mn_cod_padre = $record->mn_cod_padre;
                $mn_nombre = $record->text;
                $mn_tipo = ($record->leaf) ? 'O' : 'P';

                if ($record->mn_cod_padre == 0) {
                    $mn_cod_padre = 1;
                }


                $query = "CALL pwp_menu_opciones('UM', '$mn_codigo', '$mn_cod_padre', '$mn_nombre', '$mn_tipo')";
                //echo $query;
                $result = $objetoBaseDatos->exec($query);

                if ($objetoBaseDatos->getError()) {
                    echo $objetoBaseDatos->getErrorJson();
                    $error = 'S';
                    break;
                } else {
                    //echo '{success:true}';
                }

//                if ($record->mn_cod_padre == 0) {
//                    $mn_cod_padre = 1;
//                }
//
//                $query = "select max(cast(mn_orden as unsigned)) as mn_orden
//                          from wp_menu2";
//
//                $result = $objetoBaseDatos->query($query);
//
//
//
//                $mn_orden = $result[0]['mn_orden'] + 10;
//
//                $mn_orden = str_pad($mn_orden, 8, '0', STR_PAD_LEFT);
//
//                echo $mn_orden;
//
//                if ($objetoBaseDatos->getError()) {
//                    echo $objetoBaseDatos->getErrorJson();
//                } else {
//
//                    $query = "select count(*) as contador from wp_menu2 where mn_codigo = '$mn_codigo' ";
//                    $result = $objetoBaseDatos->query($query);
//
//                    $contador = $result[0]['contador'];
//
//                    if ($contador >= 1) {
//
//                        $query = "update wp_menu2
//                          set mn_cod_padre = '$mn_cod_padre',
//                              mn_orden = '$mn_orden'
//                          where mn_codigo = '$mn_codigo'";
//
//                        $result = $objetoBaseDatos->exec($query);
//
//                        if ($objetoBaseDatos->getError()) {
//                            echo $objetoBaseDatos->getErrorJson();
//                        } else {
//                            
//                        }
//                    } else {
//                        $mn_cod_aux = $mn_codigo;
//                        $query = "select count(*) as contador from wp_menu2 where mn_cod_padre = '$mn_cod_padre' ";
//
//                        $result = $objetoBaseDatos->query($query);
//
//                        $contador = $result[0]['contador'];
//
//                        if ($contador >= 1) {
//                            
//                        } else {
//                            $query = "select mn_codigo from wp_menu2 where mn_cod_aux = '$mn_cod_padre' ";
//                            $result = $objetoBaseDatos->query($query);
//
//                            $mn_cod_padre = $result[0]['mn_codigo'];
//                        }
//
//                        echo 'en insert';
//                        $query = "insert into wp_menu2(mn_cod_padre, mn_nombre, mn_tipo, mn_orden, mn_estado, mn_cod_aux)
//                              values('$mn_cod_padre', '$mn_nombre', '$mn_tipo', '$mn_orden', 'A', '$mn_cod_aux')";
//
//                        $result = $objetoBaseDatos->exec($query);
//
//                        echo $query;
//
//                        if ($objetoBaseDatos->getError()) {
//                            echo $objetoBaseDatos->getErrorJson();
//                        } else {
//                            
//                        }
//                    }
//                }
            }

            if ($error == 'N') {
                echo '{success:true}';
            }
        }
    }


//    echo '{success:true}';
}

function adj_tree(&$tree, $item) {
    $i = $item['mn_codigo'];
    $p = $item['mn_cod_padre'];
    $tree[$i] = isset($tree[$i]) ? $item + $tree[$i] : $item;

    $tree[$p]['children'][] = &$tree[$i];
}

function adj_treef(&$treef, $item) {
    $i = $item['mn_codigo'];
    $p = $item['mn_cod_padre'];
    $treef[$i] = isset($treef[$i]) ? $item + $tree[$i] : $item;

    $treef[$p]['children'][] = &$treef[$i];
}

function listarAll() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    $tree = array();

    $us_codigo = isset($_GET['us_codigo']) ? $_GET['us_codigo'] : (isset($_POST['us_codigo']) ? $_POST['us_codigo'] : null);

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        //$query = "select * from wp_menu where mn_cod_padre > 0 and mn_estado = 'A' order by mn_orden ";

        $query = "select *
                  from wp_menu
                  where mn_cod_padre > 0 
                  and mn_estado = 'A'
                  and mn_codigo in(select mn_codigo
                                     from wp_perfil pe inner join wp_permiso pr on
                                     pr.pe_codigo = pe.pe_codigo
                                     and pr.pr_acceso = 'S'
                                     where pe.pe_codigo in(select pe_codigo
                                                           from wp_usuarios
                                                           where us_codigo = '$us_codigo'))
                  order by mn_orden ";

        //$result = $objetoBaseDatos->queryJson($query);
        $result = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson($query);
        } else {

            foreach ($result as $key => $rows) {
//            echo $rows['mn_codigo'];
//            echo $rows['mn_cod_padre'];
                $leaf = true;
                $expanded = false;
                if ($rows['mn_tipo'] == 'P') {
                    $leaf = false;
//                    $expanded = true;
                }

                $arr = array(
                    'mn_codigo' => $rows['mn_codigo'],
                    'mn_cod_padre' => $rows['mn_cod_padre'],
                    'text' => $rows['mn_nombre'],
                    'iconCls' => trim($rows['mn_icono']),
                    'leaf' => $leaf,
                    'expanded' => $expanded,
                    'ruta' => trim($rows['mn_ruta'])
                );

                adj_tree($tree, $arr);
            }

            $nodes = $tree[1];
            $texto = json_encode($nodes);

            //$texto = substr($texto, 100);
            //$texto = substr($texto, 0, strlen($texto) - 1);

            echo $texto;
        }
    }
}

function listarAll2() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    $tree = array();

    $us_codigo = 1; //isset($_GET['us_codigo']) ? $_GET['us_codigo'] : (isset($_POST['us_codigo']) ? $_POST['us_codigo'] : null);

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        //$query = "select * from wp_menu2 where mn_cod_padre > 0 and mn_estado = 'A' order by mn_orden ";

        $query = "select *
                  from wp_menu
                  where mn_cod_padre > 0 
                  and mn_estado = 'A'
                  and mn_codigo in(select mn_codigo
                                     from wp_perfil pe inner join wp_permiso pr on
                                     pr.pe_codigo = pe.pe_codigo
                                     and pr.pr_acceso = 'S'
                                     where pe.pe_codigo in(select pe_codigo
                                                           from wp_usuarios
                                                           where us_codigo = '$us_codigo'))
                  order by mn_orden ";

        //$result = $objetoBaseDatos->queryJson($query);
        $result = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson($query);
        } else {

            foreach ($result as $key => $rows) {
//            echo $rows['mn_codigo'];
//            echo $rows['mn_cod_padre'];
                $leaf = true;
                $expanded = false;
                if ($rows['mn_tipo'] == 'P') {
                    $leaf = false;
//                    $expanded = true;
                }

                $arr = array(
                    'mn_codigo' => $rows['mn_codigo'],
                    'mn_cod_padre' => $rows['mn_cod_padre'],
                    'text' => $rows['mn_nombre'],
                    'iconCls' => trim($rows['mn_icono']),
                    'leaf' => $leaf,
                    'expanded' => $expanded,
                    'ruta' => trim($rows['mn_ruta'])
                );

                adj_tree($tree, $arr);
            }

            $nodes = $tree[1];
            $texto = json_encode($nodes);

            //$texto = substr($texto, 100);
            //$texto = substr($texto, 0, strlen($texto) - 1);

            echo $texto;
        }
    }
}

function listarAllM() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    $tree = array();

    //$us_codigo = 1; //isset($_GET['us_codigo']) ? $_GET['us_codigo'] : (isset($_POST['us_codigo']) ? $_POST['us_codigo'] : null);

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        //$query = "select * from wp_menu2 where mn_cod_padre > 0 and mn_estado = 'A' order by mn_orden ";

        $query = "select * 
                  from wp_menu 
                  where mn_cod_padre > 0 
                  and mn_estado = 'A'                   
                  order by mn_orden ";

        //$result = $objetoBaseDatos->queryJson($query);
        $result = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson($query);
        } else {

            foreach ($result as $key => $rows) {
//            echo $rows['mn_codigo'];
//            echo $rows['mn_cod_padre'];
                $leaf = true;
                $expanded = false;
                if ($rows['mn_tipo'] == 'P') {
                    $leaf = false;
//                    $expanded = true;
                }

                $arr = array(
                    'mn_codigo' => $rows['mn_codigo'],
                    'mn_cod_padre' => $rows['mn_cod_padre'],
                    'text' => $rows['mn_nombre'],
                    'iconCls' => trim($rows['mn_icono']),
                    'leaf' => $leaf,
                    'expanded' => $expanded,
                    'ruta' => trim($rows['mn_ruta'])
                );

                adj_tree($tree, $arr);
            }

            $nodes = $tree[1];
            $texto = json_encode($nodes);

            //$texto = substr($texto, 100);
            //$texto = substr($texto, 0, strlen($texto) - 1);

            echo $texto;
        }
    }
}

////function listarAllM() {
//    $objetoBaseDatos = new claseBaseDatos();
//    $objetoBaseDatos->conectarse();
//
//    $treef = array();
//
//    if ($objetoBaseDatos->getErrorConexionNo()) {
//        echo $objetoBaseDatos->getErrorConexionJson();
//    } else {
//        $query = "select * 
//                  from wp_menu 
//                  where mn_cod_padre > 0 
//                  and mn_estado = 'A'                   
//                  order by mn_orden ";
//
//        //$result = $objetoBaseDatos->queryJson($query);
//        $result = $objetoBaseDatos->query($query);
//
//        if ($objetoBaseDatos->getError()) {
//            echo $objetoBaseDatos->getErrorJson('');
//        } else {
//
//            foreach ($result as $key => $rows) {
////            echo $rows['mn_codigo'];
////            echo $rows['mn_cod_padre'];
//                $leaf = true;
//                $expanded = false;
//                if ($rows['mn_tipo'] == 'P') {
//                    $leaf = false;
////                    $expanded = true;
//                }
//
//                $arr = array(
//                    'mn_codigo' => $rows['mn_codigo'],
//                    'mn_cod_padre' => $rows['mn_cod_padre'],
//                    'text' => $rows['mn_nombre'],
//                    'iconCls' => trim($rows['mn_icono']),
//                    'leaf' => $leaf,
//                    'expanded' => $expanded,
//                    'ruta' => trim($rows['mn_ruta'])
//                );
//
//                //adj_treef($treef, $arr);
//                array_push($treef, $arr);
//            }
//
//            //$nodes = $treef[1];
//            $nodes = $treef;
//            $texto = json_encode($nodes);
//
//            //$texto = substr($texto, 100);
//            //$texto = substr($texto, 0, strlen($texto) - 1);
//
//            echo $texto;
//        }
//    }
//}

function listarAllF() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    $treef = array();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        $query = "select * 
                  from wp_menu 
                  where mn_cod_padre > 0 
                  and mn_estado = 'A' 
                  and mn_codigo in(select mn_codigo from wp_favorito where us_codigo = 1)
                  order by mn_orden ";

        //$result = $objetoBaseDatos->queryJson($query);
        $result = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {

            foreach ($result as $key => $rows) {
//            echo $rows['mn_codigo'];
//            echo $rows['mn_cod_padre'];
                $leaf = true;
                $expanded = false;
                if ($rows['mn_tipo'] == 'P') {
                    $leaf = false;
//                    $expanded = true;
                }

                $arr = array(
                    'mn_codigo' => $rows['mn_codigo'],
                    'mn_cod_padre' => $rows['mn_cod_padre'],
                    'text' => $rows['mn_nombre'],
                    'iconCls' => trim($rows['mn_icono']),
                    'leaf' => $leaf,
                    'expanded' => $expanded,
                    'ruta' => trim($rows['mn_ruta'])
                );

                //adj_treef($treef, $arr);
                array_push($treef, $arr);
            }

            //$nodes = $treef[1];
            $nodes = $treef;
            $texto = json_encode($nodes);

            //$texto = substr($texto, 100);
            //$texto = substr($texto, 0, strlen($texto) - 1);

            echo $texto;
        }
    }
}

function identificarUsuario() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    $us_codigo = $_POST['us_codigo'];

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        $query = "select us_nombres_apellidos, pe_codigo, pe_desc
                  from vw_wp_usuarios
                  where us_codigo = '$us_codigo'";
        
        $result = $objetoBaseDatos->queryJson($query);
        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            echo $result;
        }
    }
}

?>
