<?php

include_once '../../../librerias/claseGenerica.php';

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);

switch ($action) {
    case 'listarAll':
        listarAll();
        break;
    case 'listarAllF':
        listarAllF();
        break;
    case 'cerrarSesionActual':
        cerrarSesionActual();
        break;
}

//function adj_tree(&$tree, $item) {
//    $i = $item['id'];
//    $p = $item['idMenuPadre'];
//    $tree[$i] = isset($tree[$i]) ? $item + $tree[$i] : $item;
//
//    $tree[$p]['children'][] = &$tree[$i];
//}
//function listarAll() {
//    $objetoBaseDatos = new claseBaseDatos();
//    $objetoBaseDatos->conectarse();
//
//    $tree = array();
//
//    $id = isset($_GET['id']) ? $_GET['id'] : (isset($_POST['id']) ? $_POST['id'] : null);
//
//    if ($objetoBaseDatos->getErrorConexionNo()) {
//        echo $objetoBaseDatos->getErrorConexionJson();
//    } else {
//        //$query = "select * from wp_menu where mn_cod_padre > 0 and mn_estado = 'A' order by mn_orden ";
//
//        $query = "select *, 
//                  (select count(*) from tAdmMenu c where c.idMenuPadre = t.id and c.estado = 'H' and c.id in(select idAdmMenu
//                                                                                      from tAdmPerfil pe inner join tAdmPermiso pr on
//                                                                                      pr.idAdmPerfil = pe.id
//                                                                                      and pr.acceso = 'S'
//                                                                                      where pe.id in(select idAdmPerfil
//                                                                                                     from tAdmUsuario
//                                                                                                     where id = '$id'))) as numeroHijos
//                from tAdmMenu t
//                where t.idMenuPadre > 0  
//                and t.estado = 'H'
//                and t.id in(select idAdmMenu
//                          from tAdmPerfil pe inner join tAdmPermiso pr on
//                          pr.idAdmPerfil = pe.id
//                          and pr.acceso = 'S'
//                          where pe.id in(select idAdmPerfil
//                                         from tAdmUsuario
//                                         where id = '$id'))
//                order by t.orden; ";
//
//        //$result = $objetoBaseDatos->queryJson($query);
//        //echo $query;
//
//        $result = $objetoBaseDatos->query($query);
//
//        if ($objetoBaseDatos->getError()) {
//            echo $objetoBaseDatos->getErrorJson($query);
//        } else {
//
//            foreach ($result as $key => $rows) {
////            echo $rows['mn_codigo'];
////            echo $rows['mn_cod_padre'];
//                $leaf = true;
//                $expanded = false;
//                if ($rows['tipo'] == 'P') {
//                    $leaf = false;
////                    $expanded = true;
//                    if ($rows['numeroHijos'] <= 0) {
//                        $children = "'children' => []";
//                    }
//                }
//
//                $arr = array(
//                    'id' => $rows['id'],
//                    'idMenuPadre' => $rows['idMenuPadre'],
//                    'text' => $rows['nombreOpcion'],
//                    'iconCls' => trim($rows['icono']),
//                    'leaf' => $leaf,
//                    'expanded' => $expanded,
//                    'ruta' => trim($rows['ruta'])
//                );
//
//                if (($rows['tipo'] == 'P') && ($rows['numeroHijos'] <= 0)) {
//                    $arr = $arr + array('children' => array());
//                }
//
//                adj_tree($tree, $arr);
//            }
//
//            $nodes = $tree[1];
//            $texto = json_encode($nodes);
//
//            echo $texto;
//        }
//    }
//}

function adj_tree(&$tree, $item) {
    $i = $item['mn_codigo'];
    $p = $item['mn_cod_padre'];
    $tree[$i] = isset($tree[$i]) ? $item + $tree[$i] : $item;

    $tree[$p]['children'][] = &$tree[$i];
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

//        $query = "select *
//                  from wp_menu
//                  where mn_cod_padre > 0 
//                  and mn_estado = 'A'
//                  and mn_codigo in(select mn_codigo
//                                     from wp_perfil pe inner join wp_permiso pr on
//                                     pr.pe_codigo = pe.pe_codigo
//                                     and pr.pr_acceso = 'S'
//                                     where pe.pe_codigo in(select pe_codigo
//                                                           from wp_usuarios
//                                                           where us_codigo = '$us_codigo'))
//                  order by mn_orden ";
        
        $query = "select *, 
                (select count(*) from wp_menu c where c.mn_cod_padre = t.mn_codigo and c.mn_estado = 'A' and c.mn_codigo in(select mn_codigo
                                                                                    from wp_perfil pe inner join wp_permiso pr on
                                                                                    pr.pe_codigo = pe.pe_codigo
                                                                                    and pr.pr_acceso = 'S'
                                                                                    where pe.pe_codigo in(select pe_codigo
                                                                                                   from wp_usuarios
                                                                                                   where us_codigo = '$us_codigo'))) as numeroHijos
              from wp_menu t
              where t.mn_cod_padre > 0  
              and t.mn_estado = 'A'
              and t.mn_codigo in(select mn_codigo
                        from wp_perfil pe inner join wp_permiso pr on
                        pr.pe_codigo = pe.pe_codigo
                        and pr.pr_acceso = 'S'
                        where pe.pe_codigo in(select pe_codigo
                                       from wp_usuarios
                                       where us_codigo = '$us_codigo'))
              order by t.mn_orden ";

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

                if (($rows['mn_tipo'] == 'P') && ($rows['numeroHijos'] <= 0)) {
                    $arr = $arr + array('children' => array());
                }

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

function listarAllF() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    $tree = array();

//    $id = isset($_GET['id']) ? $_GET['id'] : (isset($_POST['id']) ? $_POST['id'] : null);
    $us_codigo = isset($_GET['us_codigo']) ? $_GET['us_codigo'] : (isset($_POST['us_codigo']) ? $_POST['us_codigo'] : null);

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        $query = "select m.mn_codigo, m.mn_cod_padre, m.mn_nombre, m.mn_icono, m.mn_ruta
                from wp_menu_favoritos f inner join wp_menu m on
                m.mn_codigo = f.mn_codigo
                where f.us_codigo = '$us_codigo'
                and f.fa_estado = 'A'
                and m.mn_estado = 'A'
                and m.mn_codigo in (select mn_codigo
                                    from wp_permiso
                                    where pe_codigo = (select pe_codigo
                                                        from wp_usuarios
                                                        where us_codigo = f.us_codigo)
                            and pr_acceso = 'S'                     
                            and pr_estado = 'A')
                order by m.mn_orden";

        $result = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson($query);
        } else {
            foreach ($result as $key => $rows) {
                $leaf = true;
                $expanded = false;

//                $arr = array(
//                    'id' => $rows['id'],
//                    'idMenuPadre' => $rows['idMenuPadre'],
//                    'text' => $rows['nombreOpcion'],
//                    'iconCls' => trim($rows['icono']),
//                    'leaf' => $leaf,
//                    'expanded' => $expanded,
//                    'ruta' => trim($rows['ruta'])
//                );
                
                $arr = array(
                    'mn_codigo' => $rows['mn_codigo'],
                    'mn_cod_padre' => $rows['mn_cod_padre'],
                    'text' => $rows['mn_nombre'],
                    'iconCls' => trim($rows['mn_icono']),
                    'leaf' => $leaf,
                    'expanded' => $expanded,
                    'ruta' => trim($rows['mn_ruta'])
                );


                array_push($tree, $arr);
            }

            $texto = json_encode($tree);

            echo $texto;
        }
    }
}

//function listarAllF() {
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
//                  and mn_codigo in(select mn_codigo from wp_menu_favoritos where us_codigo = 1)
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

function cerrarSesionActual() {
    $se_codigo = $_POST['se_codigo'];
    $objetoSesion = new claseSesion();
    $resp = $objetoSesion->cerrarSesionActual($se_codigo);
    echo $resp;
}

?>
