<?php
session_start();

include_once '../librerias/claseGenerica.php';

if (!isset($_SESSION['S_loginOk'])) {
    header('Location:../index.php');
} elseif ($_SESSION['S_loginOk'] == 'SI') {
    $_SESSION['S_loginOk'] = 'NO';
    $S_us_codigo = $_SESSION["S_us_codigo"];

    $S_se_codigo = 0;

    $objetoSesion = new claseSesion();

    $result = $objetoSesion->ingresarSesion($S_us_codigo);

    if ($result['estado'] != 'OK') {
        header('Location:../index.php');
        die($result['mensaje']);
    } else {
        $S_se_codigo = $result['se_codigo'];

        $result = $objetoSesion->getDataSesion($S_se_codigo);

        $S_us_login = $result[0]["us_login"];
        $S_pe_codigo = $result[0]["pe_codigo"];
        $usuario = "'" . $result[0]["us_nombres_apellidos"] . "'";
        $perfil = "'" . $result[0]["pe_desc"] . "'";
    }
} else {
    header('Location:../index.php');
}
?>

<html>
    <head>
        <title>SISTEMA</title>
        <!--<meta http-equiv="X-UA-Compatible" content="text/html; charset=UTF-8: IE=7,8,9">-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=7,8,9" />

		<link rel="shortcut icon" type="image/x-icon" href="../favicon.ico">
        <link rel="stylesheet" href="../extjs/resources/css/ext-all.css">
        <!--<link rel="stylesheet" href="../extjs/resources/css/ext-all-neptune.css">-->
        <link rel="stylesheet" href="../css/iconos.css">
        <script type="text/javascript" src="../extjs/ext-all.js"></script>
        <script type="text/javascript" src="../extjs/locale/ext-lang-es.js"></script>
        <script type="text/javascript" src="app.js?v7"></script>
        <script>
            window.onbeforeunload = function(e) {
                var e = e || window.event;
                
                if (e) {
                    e.returnValue = 'Esta seguro de Salir del Sistema ?';
                }
                return 'Esta seguro de Salir del Sistema ?';
            }
        </script>
    </head>
    <body>
        <div style="position:relative; display:none;">
            <input type="hidden=" name="S_us_codigo" id="S_us_codigo" value="<?php echo $S_us_codigo ?>"/>
            <input type="hidden=" name="S_us_login" id="S_us_login" value="<?php echo $S_us_login ?>"/>
            <input type="hidden=" name="S_pe_codigo" id="S_pe_codigo" value="<?php echo $S_pe_codigo ?>"/>
            <input type="hidden=" name="usuario" id="usuario" value="<?php echo $usuario ?>"/>
            <input type="hidden=" name="perfil" id="perfil" value="<?php echo $perfil ?>"/>
            <input type="hidden=" name="S_se_codigo" id="S_se_codigo" value="<?php echo $S_se_codigo ?>"/>
        </div>
    </body>
</html>