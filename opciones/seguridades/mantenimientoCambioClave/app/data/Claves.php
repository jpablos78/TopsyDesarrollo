<?php

include_once '../../../../../librerias/claseGenerica.php';

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);

switch ($action) {
    case 'actualizar':
        actualizar();
        break;
}

function actualizar() {
    $us_codigo = $_POST['us_codigo'];
    $us_pass = trim($_POST['us_pass']);
    $us_new_pass = trim($_POST['us_new_pass']);

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

            $query = "select us_login, us_pass
                    from wp_usuarios
                    where us_codigo = '$us_codigo'";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getErrorNo()) {
                echo $objetoBaseDatos->getErrorJson($query);
            } else {
                $aux_pass = $result[0]['us_pass'];
                $us_login = $result[0]['us_login'];
                $us_pass = crypt($us_pass, strtoupper($us_login));

                if ($aux_pass == $us_pass) {
                    $us_new_pass = crypt($us_new_pass, strtoupper($us_login));

                    $query = "update wp_usuarios
                              set us_pass = '$us_new_pass',
                              us_fec_act = getdate(),
                              us_usu_act = '$S_us_codigo'
                              where us_codigo = '$us_codigo'";

                    $objetoBaseDatos->autocommit(false);
                    $result = $objetoBaseDatos->exec($query, 'Se actualizo el Registro correctamente ...');

                    if ($objetoBaseDatos->getError()) {
                        echo $objetoBaseDatos->getErrorJson($query);
                        $objetoBaseDatos->rollback();
                    } else {
                        $objetoBaseDatos->commit();
                        echo $result;
                    }
                } else {
                    echo $objetoBaseDatos->getCadenaJson('La Contraseña ingresada es incorrecta');
                }
            }
        }
    }
}
?>

