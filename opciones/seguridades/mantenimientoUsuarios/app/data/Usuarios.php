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
    case 'listarAllV':
        listarAllV();
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
    case 'verificarLogin':
        verificarLogin();
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
        $multiQuery[0] = "select count(*) as contador from vw_wp_usuarios where us_estado not in('X') " . $qs;
        $multiQuery[1] = "select *
                          from (
                                select *, ROW_NUMBER() OVER (ORDER BY us_codigo) AS row from vw_wp_usuarios where us_estado not in('X') " . $qs .
                ") as alias
                        where row >= " . $start . " and row < " . $limit;


//        $multiQuery[1] = "select *
//                          from (
//                                 select *, ROW_NUMBER() OVER (ORDER BY cci_cliprov) AS row from TB_GEN_CLIPROV where left(cci_cliprov, 1) = '7' " . $qs .
//                ") as alias
//                           where row >= " . $start . " and row < " . $limit;


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

        $query = "select * from wp_perfil where pe_estado = 'A' and  pe_desc like '%" . $filtro . "%'";
        $result = $objetoBaseDatos->queryJson($query);

        if ($objetoBaseDatos->getError()) {
            echo $objetoBaseDatos->getErrorJson('');
        } else {
            echo $result;
        }
    }
}

function guardar() {
    $us_login = trim($_POST['us_login']);
    $us_nombres = trim($_POST['us_nombres']);
    $us_apellidos = trim($_POST['us_apellidos']);
    $us_email = $_POST['us_email'];
    $us_pass = $_POST['us_pass'];
    $pe_codigo = $_POST['pe_codigo'];
    $cci_cliprov = $_POST['cci_cliprov'];
    $us_es_ven = isset($_POST['es_vendedor']) ? $_POST['es_vendedor'] : 'N';
    $us_vis_ped = isset($_POST['visualiza']) ? $_POST['visualiza'] : 'N';

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
            $us_pass = crypt($us_pass, strtoupper($us_login));

            $query = "insert into wp_usuarios(pe_codigo, us_login, us_nombres, us_apellidos, us_email, us_pass, us_estado, 
                      cci_cliprov, us_usu_ing, us_fec_ing, us_es_ven, us_vis_ped)
                  values('$pe_codigo', '$us_login', '$us_nombres', '$us_apellidos', '$us_email', '$us_pass', 'A', 
                  '$cci_cliprov', '$S_us_codigo', getdate(), '$us_es_ven', '$us_vis_ped')";
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
    $us_codigo = $_POST['us_codigo'];
    $us_login = trim($_POST['us_login']);
    $us_nombres = trim($_POST['us_nombres']);
    $us_apellidos = trim($_POST['us_apellidos']);
    $us_email = $_POST['us_email'];
    $us_pass = $_POST['us_passe1'];
    $us_estado = $_POST['us_estado'];
    $pe_codigo = $_POST['pe_codigo'];
    $cambioClave = $_POST['cambioClave'];
    $cci_cliprov = $_POST['cci_cliprov_e'];
    $us_es_ven = isset($_POST['us_es_ven']) ? $_POST['us_es_ven'] : 'N';
    $us_vis_ped = isset($_POST['us_vis_ped']) ? $_POST['us_vis_ped'] : 'N';

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
            if ($cambioClave == 'S') {
                $us_pass = crypt($us_pass, strtoupper($us_login));

                $query = "update wp_usuarios
                  set pe_codigo = '$pe_codigo',
                  us_login = '$us_login',
                  us_nombres = '$us_nombres',
                  us_apellidos = '$us_apellidos',
                  us_email = '$us_email',
                  us_estado = '$us_estado',   
                  us_pass = '$us_pass',
                  us_usu_act = '$S_us_codigo',
                  us_fec_act = getdate(),
                  cci_cliprov = '$cci_cliprov',
                  us_es_ven = '$us_es_ven',
                  us_vis_ped = '$us_vis_ped'
                  where us_codigo='$us_codigo'";
            } else {
                $query = "update wp_usuarios
                  set pe_codigo = '$pe_codigo',
                  us_login = '$us_login',
                  us_nombres = '$us_nombres',
                  us_apellidos = '$us_apellidos', 
                  us_email = '$us_email',
                  us_estado = '$us_estado',
                  us_usu_act = '$S_us_codigo',
                  us_fec_act = getdate(),
                  cci_cliprov = '$cci_cliprov',
                  us_es_ven = '$us_es_ven',
                  us_vis_ped = '$us_vis_ped'
                  where us_codigo='$us_codigo'";
            }

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
    $us_codigo = $_POST['us_codigo'];

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
            $query = "select count(*) as contador
                      from wp_cabecera_pedido
                      where cci_vendedor in(select cci_cliprov
                                            from wp_usuarios
                                            where us_codigo = '$us_codigo') ";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getErrorNo()) {
                echo $objetoBaseDatos->getErrorJson($query);
            } else {
                $registros = $result[0]['contador'];
                if ($registros > 0) {
                    echo $objetoBaseDatos->getCadenaJson('No se puede eliminar el Usuario, se encuentran ingresados pedidos con el usuario', false);
                } else {

                    $query = "update wp_usuarios
                              set us_estado = 'X',
                              us_usu_anu = '$S_us_codigo',
                              us_fec_anu = getdate()
                              where us_codigo = '$us_codigo' ";
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

function listarAllV() {
    $start = $_POST['start'];
    $limit = $_POST['limit'];

//    $filtro = isset($_POST['filtro']) ? $_POST['filtro'] : (isset($_POST['query']) ? $_POST['query'] : "");
    $filter = isset($_POST['filter']) ? $_POST['filter'] : "";

    $filtro2 = "";
    $qs = "";

    $query2 = isset($_POST['filtro']) ? $_POST['filtro'] : "";

    if (strlen($query2) > 0) {
        //$qs = " AND cno_item LIKE '%$query2%' ";        
        $pieces = explode(" ", $query2);
        for ($i = 0; $i < count($pieces); $i++) {
            $qs .= " AND cno_cliprov LIKE '%$pieces[$i]%' ";
        }
    } else if (is_array($filter)) {
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
        $multiQuery = array();
//        $multiQuery[0] = "select count(*) as contador from TB_GEN_CLIPROV where id >=1 " . $qs;
//        $multiQuery[1] = "select * from TB_GEN_CLIPROV where id >= 1 " . $qs . " limit $start, $limit";
        $start = $start + 1;
        $limit = $start + $limit;

//        $multiQuery[0] = "select count(*) as contador 
//                          from TB_GEN_CLIPROV where left(cci_cliprov, 1) ='9' and cci_cliprov not in (select cci_cliprov from wp_usuarios) " . $qs;
//        //$multiQuery[1] = "select top 100 * from TB_GEN_CLIPROV where len(cci_cliprov) >= 1 "; //. $qs . " limit $start, $limit";
//        $multiQuery[1] = "select *
//                          from (
//                                 select *, ROW_NUMBER() OVER (ORDER BY cci_cliprov) AS row 
//                                 from TB_GEN_CLIPROV where left(cci_cliprov, 1) = '9' and cci_cliprov not in (select cci_cliprov from wp_usuarios) " . $qs .
//                ") as alias
//                           where row >= " . $start . " and row < " . $limit;

        $multiQuery[0] = "select count(*) as contador 
                          from TB_GEN_CLIPROV where left(cci_cliprov, 1) ='9' and cci_cliprov not in (select cci_cliprov from wp_usuarios where cci_cliprov != '90035') " . $qs;
        //$multiQuery[1] = "select top 100 * from TB_GEN_CLIPROV where len(cci_cliprov) >= 1 "; //. $qs . " limit $start, $limit";
        $multiQuery[1] = "select *
                          from (
                                 select *, ROW_NUMBER() OVER (ORDER BY cci_cliprov) AS row 
                                 from TB_GEN_CLIPROV where left(cci_cliprov, 1) = '9' and cci_cliprov not in (select cci_cliprov from wp_usuarios where cci_cliprov != '90035') " . $qs .
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

function verificarLogin() {
    $us_login = trim($_POST['us_login']);

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

            $query = "select count(*) as contador from wp_usuarios where us_login = '$us_login' and us_estado not in('X')";
            $result = $objetoBaseDatos->queryJson($query);

            if ($objetoBaseDatos->getError()) {
                echo $objetoBaseDatos->getErrorJson('');
            } else {
                echo $result;
            }
        }
    }
}

function permisos() {
    $objetoBaseDatos = new claseBaseDatos();
    echo $objetoBaseDatos->getCadenaJson("false", true);
}

?>
