<?php

include_once 'claseBaseDatos.php';

class claseSesion {

    function ingresarSesion($us_codigo) {
        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            return $objetoBaseDatos->getErrorConexionJson();
        } else {

            $se_ip = $this->getIP();

            $resp = array();

            $query = "insert into wp_sesion(us_codigo, se_fecha_ingreso, se_ip, se_estado)
                  values('$us_codigo', getdate(), '$se_ip', 'A')";
            $objetoBaseDatos->autocommit(false);
            $result = $objetoBaseDatos->exec($query, 'Se ingreso el Registro correctamente ...');

            if ($objetoBaseDatos->getError()) {
                //echo $objetoBaseDatos->getErrorJson($query);
                //header('Location:../index.php');

                $resp['estado'] = 'NO';
                $resp['mensaje'] = $objetoBaseDatos->getErrorJson($query);
                $resp['se_codigo'] = 0;
                $objetoBaseDatos->rollback();
                return $resp;
            } else {
                //

                $query = "select  @@identity as se_codigo ";

                $result = $objetoBaseDatos->query($query);

                if ($objetoBaseDatos->getErrorNo()) {
                    $resp['estado'] = 'NO';
                    $resp['mensaje'] = $objetoBaseDatos->getErrorJson($query);
                    $resp['se_codigo'] = 0;

                    $objetoBaseDatos->rollback();

                    return $resp;
                } else {
                    $objetoBaseDatos->commit();

                    $resp['estado'] = 'OK';
                    $resp['mensaje'] = 'OK';
                    $resp['se_codigo'] = $result[0]['se_codigo'];

                    return $resp;
                }

                //return 'OK';
                //echo $result;
            }
        }
    }

    function verificaSesionIniciada($us_codigo) {
        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            return $objetoBaseDatos->getErrorConexionJson();
        } else {
            $query = "select count(*) as contador
                      from wp_sesion
                      where us_codigo = '$us_codigo'
                      and se_estado = 'A'";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getErrorNo()) {
                return $objetoBaseDatos->getErrorJson($query);
            } else {
                $registros = $result[0]['contador'];
                return $registros;
            }
        }
    }

    function verificaSesionValida($se_codigo) {
        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            return $objetoBaseDatos->getErrorConexionJson();
        } else {
            $query = "select count(*) as contador
                      from wp_sesion
                      where se_codigo = '$se_codigo'
                      and se_estado = 'A'";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getErrorNo()) {
                return $objetoBaseDatos->getErrorJson($query);
            } else {
                $registros = $result[0]['contador'];
                return $registros;
            }
        }
    }

    function verificaPermisoValido($pe_codigo, $mn_codigo, $tipo) {
        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            return $objetoBaseDatos->getErrorConexionJson();
        } else {
//            $query = "select count(*) as contador
//                      from wp_permiso
//                      where pe_codigo = '$pe_codigo'
//                      and mn_codigo = '$mn_codigo'
//                      and pr_acceso = 'S'
//                      and pr_estado = 'A'";

            $query = "select pr_acceso, pr_insert, pr_delete, pr_update, pr_cp
                      from wp_permiso
                      where pe_codigo = '$pe_codigo'
                      and mn_codigo = '$mn_codigo'                      
                      and pr_estado = 'A'";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getErrorNo()) {
                return $objetoBaseDatos->getErrorJson($query);
            } else {
//                $registros = $result[0]['contador'];
//                return $registros;
                if ($tipo == 'P') {
                    return $result[0]['pr_acceso'];
                } else {
                    return $result;
                }
            }
        }
    }

    function getIP() {
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $se_ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if (isset($_SERVER ['HTTP_VIA']))
            $se_ip = $_SERVER['HTTP_VIA'];
        else if (isset($_SERVER ['REMOTE_ADDR']))
            $se_ip = $_SERVER['REMOTE_ADDR'];
        else
            $se_ip = null;
        return $se_ip;
    }

    function getDataSesion($se_codigo) {
        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            echo $objetoBaseDatos->getErrorConexionJson();
            return $objetoBaseDatos->getErrorConexionJson();
        } else {

            $query = "select us_codigo, us_login, us_nombres_apellidos, pe_codigo, pe_desc, cci_vendedor, us_es_ven
                      from vw_wp_usuarios
                      where us_codigo = (select us_codigo
                                         from wp_sesion
                                         where se_codigo = '$se_codigo')";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getError()) {
                return $objetoBaseDatos->getErrorJson('');
            } else {
                return $result;
            }
        }
    }

    function cerrarSesiones($us_codigo) {
        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            return $objetoBaseDatos->getErrorConexionJson();
        } else {
            $query = "update wp_sesion
                      set se_estado = 'C'
                      where us_codigo = '$us_codigo'
                      and se_estado = 'A'";
            $objetoBaseDatos->autocommit(false);
            $result = $objetoBaseDatos->exec($query, 'Se cerraron las sesiones abiertas correctamente ...');
            //$result = $objetoBaseDatos->exec($query, $query);

            if ($objetoBaseDatos->getError()) {
                $r = $objetoBaseDatos->getErrorJson($query);
                $objetoBaseDatos->rollback();
                return $r;
            } else {
                $objetoBaseDatos->commit();
                return $result;
            }
        }
    }

    function cerrarSesionActual($se_codigo) {
        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            return $objetoBaseDatos->getErrorConexionJson();
        } else {
            $query = "update wp_sesion
                      set se_estado = 'C'
                      where se_codigo = '$se_codigo'
                      and se_estado = 'A'";
            $objetoBaseDatos->autocommit(false);
            $result = $objetoBaseDatos->exec($query, 'Se cerraron las sesiones abiertas correctamente ...');
            //$result = $objetoBaseDatos->exec($query, $query);

            if ($objetoBaseDatos->getError()) {
                $r = $objetoBaseDatos->getErrorJson($query);
                $objetoBaseDatos->rollback();
                return $r;
            } else {
                $objetoBaseDatos->commit();
                return $result;
            }
        }
    }

}

?>
