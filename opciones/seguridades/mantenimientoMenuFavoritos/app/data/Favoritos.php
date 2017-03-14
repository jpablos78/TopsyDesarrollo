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
    $i = $item['id'];
    $p = $item['idMenuPadre'];
    $tree[$i] = isset($tree[$i]) ? $item + $tree[$i] : $item;

    $tree[$p]['children'][] = &$tree[$i];
}

function listarAll() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    $S_us_codigo = $_POST['S_us_codigo'];

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
//        $query = "select m.id, m.nombreOpcion, m.icono, 
//                  case when p.mn_codigo in(select mn_codigo
//                                           from wp_menu_favoritos
//                                           where us_codigo = '$S_us_codigo'
//                                           and estado = 'H') then '1' else '0' end as favorito 
//                  from tAdmPermiso p inner join tAdmMenu m on
//                  m.id = p.mn_codigo
//                  where p.idAdmPerfil = (select idAdmPerfil 
//                                         from tAdmUsuario
//                                         where id = '$S_us_codigo')
//                  and p.estado = 'H'                     
//                  and p.acceso = 'S'
//                  and m.estado = 'H'
//                  and m.tipo = 'O'
//                  order by m.orden";

        $query = "select m.mn_codigo, m.mn_nombre, m.mn_icono, 
                case when p.mn_codigo in(select mn_codigo
                                       from wp_menu_favoritos
                                       where us_codigo = '$S_us_codigo'
                                       and fa_estado = 'A') then '1' else '0' end as favorito 
                from wp_permiso p inner join wp_menu m on
                m.mn_codigo = p.mn_codigo
                where p.pe_codigo = (select pe_codigo 
                                     from wp_usuarios
                                     where us_codigo = '$S_us_codigo')
                and p.pr_estado = 'A'                     
                and p.pr_acceso = 'S'
                and m.mn_estado = 'A'
                and m.mn_tipo = 'O'
                order by m.mn_orden ";

        $result = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            $tree = array();
            foreach ($result as $key => $rows) {
                $leaf = true;
                $expanded = true;

                $arr = array(
                    'mn_codigo' => $rows['mn_codigo'],
//                    'idMenuPadre' => $rows['idMenuPadre'],
                    'mn_nombre' => $rows['mn_nombre'],
                    'iconCls' => trim($rows['mn_icono']),
                    'leaf' => $leaf,
                    'expanded' => $expanded,
//                    'ruta' => trim($rows['ruta']),
                    'favorito' => $rows['favorito'],
//                    'ingresar' => $rows['ingresar'],
//                    'eliminar' => $rows['eliminar'],
//                    'actualizar' => $rows['actualizar'],
//                    'idAdmPermiso' => $rows['id']
                );

                array_push($tree, $arr);

//                adj_tree($tree, $arr);
            }

//            $nodes = $tree[1];
            $texto = json_encode($tree);

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

        $query = "select * from tAdmPerfil where descripcion like '%" . $filtro . "%'";
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
    $S_us_codigo = $_POST['S_us_codigo'];
    $S_se_codigo = $_POST['S_se_codigo'];
    $S_pe_codigo = $_POST['S_pe_codigo'];
    $S_mn_codigo = $_POST['S_mn_codigo'];

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
            $error = 'N';
            foreach ($records as $record) {
                $mn_codigo = $record->mn_codigo;
                $estado = ($record->favorito) ? 'A' : 'I';

                $query = "select count(*) as contador 
                      from wp_menu_favoritos 
                      where us_codigo = '$S_us_codigo'
                      and mn_codigo = $mn_codigo
                      ";
                $result = $objetoBaseDatos->query($query);

                if ($result[0]['contador'] >= 1) {
                    $query = "update wp_menu_favoritos
                              set fa_estado = '$estado',
                              us_fec_act = getdate(),
                              us_usu_act = '$S_us_codigo'
                              where us_codigo = '$S_us_codigo'
                              and mn_codigo = $mn_codigo
                    ";

                    $result = $objetoBaseDatos->exec($query);

                    if ($objetoBaseDatos->getError()) {
                        echo $objetoBaseDatos->getErrorJson();
                        $error = 'S';
                        break;
                    }
                } else {
                    $query = "insert into wp_menu_favoritos(us_codigo, mn_codigo, fa_estado, us_usu_ing, us_fec_ing)
                          values('$S_us_codigo', '$mn_codigo', '$estado', '$S_us_codigo', getdate())";

                    $result = $objetoBaseDatos->exec($query);

                    if ($objetoBaseDatos->getError()) {
                        echo $objetoBaseDatos->getErrorJson();
                        $error = 'S';
                        break;
                    }
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
