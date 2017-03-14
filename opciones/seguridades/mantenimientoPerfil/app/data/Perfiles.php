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
    case 'permisos':
        permisos();
        break;
}

function listarAll() {
    $start = $_POST['start'];
    $limit = $_POST['limit'];

//    $filtro = isset($_POST['filtro']) ? $_POST['filtro'] : (isset($_POST['query']) ? $_POST['query'] : "");
    $filter = isset($_POST['filter']) ? $_POST['filter'] : "";

    $filtro2 = "";
    $qs = "";

    if (is_array($filter)) {
        for ($i = 0; $i < count($filter); $i++) {
            switch ($filter[$i]['data']['type']) {
                case 'string' : $qs .= " AND " . $filter[$i]['field'] . " LIKE '%" . $filter[$i]['data']['value'] . "%'";
                    Break;
                case 'list' :
                    if (strstr($filter[$i]['data']['value'], ',')) {
                        $fi = explode(',', $filter[$i]['data']['value']);
                        for ($q = 0; $q < count($fi); $q++) {
                            $fi[$q] = "'" . $fi[$q] . "'";
                        }
                        $filter[$i]['data']['value'] = implode(',', $fi);
                        $qs .= " AND " . $filter[$i]['field'] . " IN (" . $filter[$i]['data']['value'] . ")";
                    } else {
                        $qs .= " AND " . $filter[$i]['field'] . " = '" . $filter[$i]['data']['value'] . "'";
                    }
                    Break;
                case 'boolean' : $qs .= " AND " . $filter[$i]['field'] . " = " . ($filter[$i]['data']['value']);
                    Break;
                case 'numeric' :
                    switch ($filter[$i]['data']['comparison']) {
                        case 'eq' : $qs .= " AND " . $filter[$i]['field'] . " = " . $filter[$i]['data']['value'];
                            Break;
                        case 'lt' : $qs .= " AND " . $filter[$i]['field'] . " < " . $filter[$i]['data']['value'];
                            Break;
                        case 'gt' : $qs .= " AND " . $filter[$i]['field'] . " > " . $filter[$i]['data']['value'];
                            Break;
                    }
                    Break;
                case 'date' :
                    switch ($filter[$i]['data']['comparison']) {
                        case 'eq' : $qs .= " AND " . $filter[$i]['field'] . " = '" . date('Y-m-d', strtotime($filter[$i]['data']['value'])) . "'";
                            Break;
                        case 'lt' : $qs .= " AND " . $filter[$i]['field'] . " < '" . date('Y-m-d', strtotime($filter[$i]['data']['value'])) . "'";
                            Break;
                        case 'gt' : $qs .= " AND " . $filter[$i]['field'] . " > '" . date('Y-m-d', strtotime($filter[$i]['data']['value'])) . "'";
                            Break;
                    }
                    Break;
            }
        }
//        $filtro2 .= $qs;
//        echo $qs;
//        echo $where;
    }

    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        $start = $start + 1;
        $limit = $start + $limit;

        $multiQuery = array();
        $multiQuery[0] = "select count(*) as contador from vw_wp_perfil where pe_estado not in('X') " . $qs;
        $multiQuery[1] = "select *
                          from (
                                      select *, ROW_NUMBER() OVER (ORDER BY pe_codigo) AS row from vw_wp_perfil where pe_estado not in('X') " . $qs .
                ") as alias 
                         where row >= " . $start . " and row < " . $limit;

        $result = $objetoBaseDatos->queryPaginacionJson($multiQuery);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            echo $result;
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

        $query = "select * from wp_perfil where pe_desc like '%" . $filtro . "%'";
        $result = $objetoBaseDatos->queryJson($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            echo $result;
        }
    }
}

function guardar() {
    $pe_desc = trim($_POST['pe_desc']);

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
            $query = "insert into wp_perfil(pe_desc, pe_estado)
                  values('$pe_desc', 'A')";
            $objetoBaseDatos->autocommit(false);
            $result = $objetoBaseDatos->exec($query, 'Se ingreso el Registro correctamente ...');

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

function actualizar() {
    $pe_codigo = $_POST['pe_codigo'];
    $pe_desc = $_POST['pe_desc'];
    $pe_estado = $_POST['pe_estado'];

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

            if ($pe_estado == 'I') {
                $query = "select count(*) as contador
                      from wp_usuarios
                      where pe_codigo = '$pe_codigo'
                      and us_estado != 'X' ";

                $result = $objetoBaseDatos->query($query);

                if ($objetoBaseDatos->getErrorNo()) {
                    echo $objetoBaseDatos->getErrorJson($query);
                    return;
                } else {
                    $registros = $result[0]['contador'];
                    if ($registros > 0) {
                        echo $objetoBaseDatos->getCadenaJson('No se puede deshabilitar el Perfil, se encuentra asignado a usuarios', false);
                        return;
                    }
                }
            }

            $query = "update wp_perfil
                  set pe_desc = '$pe_desc',
                  pe_estado = '$pe_estado'
                  where pe_codigo = '$pe_codigo'";

            $objetoBaseDatos->autocommit(false);
            $result = $objetoBaseDatos->exec($query, 'Se actualizo el Registro correctamente ...');

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

function eliminar() {
    $pe_codigo = $_POST['pe_codigo'];

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
            $query = "select count(*) as contador
                      from wp_usuarios
                      where pe_codigo = '$pe_codigo'
                      and us_estado != 'X' ";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getErrorNo()) {
                echo $objetoBaseDatos->getErrorJson($query);
            } else {
                $registros = $result[0]['contador'];
                if ($registros > 0) {
                    echo $objetoBaseDatos->getCadenaJson('No se puede eliminar el Perfil, se encuentra asignado a usuarios', false);
                } else {

                    $query = "update wp_perfil
                      set pe_estado = 'X'
                      where pe_codigo = '$pe_codigo'";
                    $objetoBaseDatos->autocommit(false);
                    $result = $objetoBaseDatos->exec($query, 'Se elimino el Registro correctamente ...');

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
    }
}

function menu() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    $mn_codigo = $_POST['mn_codigo'];

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
        $query = "select * from wp_menu where mn_codigo = '$mn_codigo' ";
        $result = $objetoBaseDatos->queryJson($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            echo $result;
        }
    }
}

function permisos() {
    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {
//        $multiQuery = array();
//        $multiQuery[0] = "select count(*) as contador from wp_usuarios where us_codigo >=1 " . $qs;
//        $multiQuery[1] = "select * from wp_usuarios where us_codigo >= 1 " . $qs . " limit $start, $limit";
//        $result = $objetoBaseDatos->queryPaginacionJson($multiQuery);
//        $filtro = isset($_POST['filtro']) ? $_POST['filtro'] : (isset($_POST['query']) ? $_POST['query'] : "");

        $query = "select pr_acceso, pr_insert, pr_delete, pr_update
                  from wp_permiso
                  where pe_codigo = 8
                  and mn_codigo = 11";
        $result = $objetoBaseDatos->queryJson($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            echo $result;
        }
    }
}
?>

