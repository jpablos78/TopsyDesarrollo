<?php

include_once '../../../../../librerias/claseGenerica.php';

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);

switch ($action) {
    case 'listarAll':
        listarAll();
        break;
    case 'listarAllP':
        listarAllP();
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
    case 'menu':
        menu();
        break;
}

function adj_tree(&$tree, $item) {
    $i = $item['mn_codigo'];
    $p = $item['mn_cod_padre'];
    $tree[$i] = isset($tree[$i]) ? $item + $tree[$i] : $item;

    $tree[$p]['children'][] = &$tree[$i];
}

function listarAll() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    $pe_codigo = $_POST['pe_codigo'];

    //$pe_codigo = 2;

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        $query = "select p.pr_codigo, m.mn_cod_padre, p.mn_codigo, m.mn_nombre,
                m.mn_tipo, m.mn_icono, m.mn_ruta,
                case p.pr_acceso when 'S' then 1 when 'N' then 0 end as pr_acceso, 
                case p.pr_insert when 'S' then 1 when 'N' then 0 end as pr_insert, 
                case p.pr_delete when 'S' then 1 when 'N' then 0 end as pr_delete, 
                case p.pr_update when 'S' then 1 when 'N' then 0 end as pr_update, 
                case p.pr_cp when 'S' then 1 when 'N' then 0 end as pr_cp,
                m.mn_orden,
                1 as active,
                (select count(*) from wp_menu where mn_cod_padre = m.mn_codigo and mn_estado = 'A') as numeroHijos
                from wp_menu m inner join wp_permiso p on
                p.mn_codigo = m.mn_codigo
                where m.mn_cod_padre > 0
                and p.pe_codigo= '$pe_codigo'
                and m.mn_estado = 'A'

                union

                select 0 as pr_codigo, mn_cod_padre, mn_codigo, mn_nombre, 
                mn_tipo, mn_icono, mn_ruta,
                0 as pr_acceso,
                0 as pr_insert, 
                0 as pr_delete, 
                0 as pr_update,
                0 as pr_cp,
                mn_orden,
                0 as active,
                (select count(*) from wp_menu where mn_cod_padre = m.mn_codigo and mn_estado = 'A') as numeroHijos
                from wp_menu m
                where mn_cod_padre > 0
                and mn_codigo not in(select mn_codigo from wp_permiso where pe_codigo = '$pe_codigo')
                and mn_estado = 'A'
                order by mn_orden;";

        //$result = $objetoBaseDatos->queryJson($query);

        $result = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            //echo $result;

            foreach ($result as $key => $rows) {
//            echo $rows['mn_codigo'];
//            echo $rows['mn_cod_padre'];
                $leaf = true;
                $expanded = false;
                if ($rows['mn_tipo'] == 'P') {
                    if ($rows['mn_cod_padre'] == 1) {
                        $expanded = true;
                    }

                    $leaf = false;
//                    $expanded = true;
                }

                $arr = array(
                    'mn_codigo' => $rows['mn_codigo'],
                    'mn_cod_padre' => $rows['mn_cod_padre'],
                    'mn_nombre' => $rows['mn_nombre'],
                    'iconCls' => trim($rows['mn_icono']),
                    'leaf' => $leaf,
                    'expanded' => $expanded,
                    'ruta' => trim($rows['mn_ruta']),
                    'pr_acceso' => $rows['pr_acceso'],
                    'pr_insert' => $rows['pr_insert'],
                    'pr_delete' => $rows['pr_delete'],
                    'pr_update' => $rows['pr_update'],
                    'pr_cp' => $rows['pr_cp'],
                    'pr_codigo' => $rows['pr_codigo']
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

function listarAllP() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
//        $multiQuery = array();
//        $multiQuery[0] = "select count(*) as contador from wp_usuarios where us_codigo >=1 " . $qs;
//        $multiQuery[1] = "select * from wp_usuarios where us_codigo >= 1 " . $qs . " limit $start, $limit";
//        $result = $objetoBaseDatos->queryPaginacionJson($multiQuery);

        $filtro = isset($_POST['filtro']) ? $_POST['filtro'] : (isset($_POST['query']) ? $_POST['query'] : "");

        $query = "select * from wp_perfil where pe_estado = 'A' and pe_desc like '%" . $filtro . "%'";
        $result = $objetoBaseDatos->queryJson($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            echo $result;
        }
    }
}

function actualizar() {
    $store = $_POST['store'];
    $records = json_decode(stripslashes($store));
    $pe_codigo = $_POST['pe_codigo'];

    $S_se_codigo = $_POST['S_se_codigo'];
    $S_pe_codigo = $_POST['S_pe_codigo'];
    $S_mn_codigo = $_POST['S_mn_codigo'];
    $S_us_codigo = $_POST['S_us_codigo'];

    $objetoBaseDatos = new claseBaseDatos();
    $objetoSesion = new claseSesion();

    $sesionValida = $objetoSesion->verificaSesionValida($S_se_codigo);

    if ($sesionValida <= 0) {
        echo $objetoBaseDatos->getCadenaJson("Atencion la sesion fue cerrada y no es valida, por favor salga del sistema y vuelva a ingresar...", false);
    } else if (($permisoValido = $objetoSesion->verificaPermisoValido($S_pe_codigo, $S_mn_codigo, 'P')) != 'S') {
        echo $objetoBaseDatos->getCadenaJson("Atencion no tiene los permisos necesarios para ingresar en esta opcion...", false);
    } else {
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            echo $objetoBaseDatos->getErrorConexionJson();
        } else {
            $objetoBaseDatos->autocommit(false);
            foreach ($records as $record) {
                $pr_acceso = ($record->pr_acceso) ? 'S' : 'N';
                $pr_insert = ($record->pr_insert) ? 'S' : 'N';
                $pr_delete = ($record->pr_delete) ? 'S' : 'N';
                $pr_update = ($record->pr_update) ? 'S' : 'N';
                $pr_cp = ($record->pr_cp) ? 'S' : 'N';
                if ($record->pr_codigo == 0) {
                    $query = "insert into wp_permiso(pe_codigo, mn_codigo, pr_acceso, pr_insert, pr_delete, pr_update, pr_cp, pr_estado, us_usu_ing, us_fec_ing)
                          values('$pe_codigo', '$record->mn_codigo', '$pr_acceso', '$pr_insert', '$pr_delete', '$pr_update', '$pr_cp', 'A',  '$S_us_codigo', getdate())";
                } else {
                    $query = "update wp_permiso
                          set pr_acceso = '$pr_acceso',
                          pr_insert = '$pr_insert', 
                          pr_delete = '$pr_delete', 
                          pr_update = '$pr_update',
                          pr_cp = '$pr_cp',
                          us_usu_act = '$S_us_codigo',
                          us_fec_act = getdate()
                          where pr_codigo = '$record->pr_codigo'";
                }

                $result = $objetoBaseDatos->exec($query, 'Se actualizo el Registro correctamente ...');

                if ($objetoBaseDatos->getError()) {
                    break;
                }
            }

            if ($objetoBaseDatos->getError()) {
                echo $objetoBaseDatos->getErrorJson($query);
                $objetoBaseDatos->rollback();
            } else {
                $objetoBaseDatos->commit();
                echo $result;
            }
        }
    }
}

?>
