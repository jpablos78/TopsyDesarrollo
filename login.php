<?php

include_once 'librerias/claseGenerica.php';

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);

switch ($action) {
    case 'login':
        login();
        break;
    case 'cerrarSesiones':
        cerrarSesiones();
        break;
}

function login() {
    $login = $_POST['login'];
    $password = $_POST['password'];

    session_start();
    $_SESSION['S_loginOk'] = "NO";

    $objetoBaseDatos = new claseBaseDatos();
    $objetoBaseDatos->conectarse();

    if ($objetoBaseDatos->getErrorConexionNo()) {
        echo $objetoBaseDatos->getErrorConexionJson();
    } else {

        $password = crypt($password, strtoupper($login));

        $query = "select count(*) as contador, us_codigo, us_nombres_apellidos, pe_desc
                  from vw_wp_usuarios
                  where us_login = '$login'
                  and us_pass = '$password'
                  group by us_codigo, us_nombres_apellidos, pe_desc";
        
        $result = $objetoBaseDatos->query($query);

        if ($objetoBaseDatos->getErrorNo()) {
            echo $objetoBaseDatos->getErrorJson($query);
        } else {
            $registros = $objetoBaseDatos->getNumRows();

            //echo $registros;
            $us_codigo = 0;

            if ($registros <= 0) {
                $mensaje = 'Usuario o clave incorrectos';
                //$objetoSesion = new claseSesion();
                //$resp = $objetoSesion->verificaSesionIniciada($result[0]['id']);
                $resp = 0;
            } else {

                $mensaje = 'OK';
                $_SESSION["S_loginOk"] = "SI";
                $_SESSION["S_us_codigo"] = $result[0]['us_codigo'];
                $us_codigo = $result[0]['us_codigo'];
//                $_SESSION["S_us_nombres_apellidos"] = $result[0]['us_nombres_apellidos'];
//                $_SESSION["S_us_descripcion_perfil"] = $result[0]['pe_desc'];

//            $registros = $result[0]['contador'];
                $objetoSesion = new claseSesion();
                $resp = $objetoSesion->verificaSesionIniciada($result[0]['us_codigo']);

            }



            $o = array(
                "success" => true,
                "data" => $registros,
                "mensaje" => $mensaje,
                "sesionIniciada" => $resp,
                "us_codigo" => $us_codigo
            );

            //sleep(40);
            echo json_encode($o);
        }
    }
}

function cerrarSesiones() {
    $us_codigo = $_POST['us_codigo'];
    $objetoSesion = new claseSesion();
    $resp = $objetoSesion->cerrarSesiones($us_codigo);
    echo $resp;
}

?>