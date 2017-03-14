<?php
include_once '../../../librerias/claseGenerica.php';

$S_se_codigo = isset($_GET['S_se_codigo']) ? $_GET['S_se_codigo'] : (isset($_POST['S_se_codigo']) ? $_POST['S_se_codigo'] : null);
$S_mn_codigo = isset($_GET['S_mn_codigo']) ? $_GET['S_mn_codigo'] : (isset($_POST['S_mn_codigo']) ? $_POST['S_mn_codigo'] : null);

$objetoSesion = new claseSesion();

$result = $objetoSesion->getDataSesion($S_se_codigo);

if (!is_array($result)) {
    $i = strpos($result, 'false');
    if ($i) {
        $result = str_replace('"', '', $result);
        echo "
        <script>
            alert('Atencion no hay conexion con la base de Datos. " . $result . " ');
        </script>
        ";

        return;
    }
}

$S_us_codigo = $result[0]["us_codigo"];
$S_pe_codigo = $result[0]["pe_codigo"];

$sesionValida = $objetoSesion->verificaSesionValida($S_se_codigo);

if ($sesionValida <= 0) {
    echo "
        <script>
            alert('Atencion la sesion fue cerrada y no es valida, por favor salga del sistema y vuelva a ingresar');
        </script>
        ";

    return;
}

$result = $objetoSesion->verificaPermisoValido($S_pe_codigo, $S_mn_codigo);

$S_pr_acceso = $result[0]["pr_acceso"];
$S_pr_insert = $result[0]["pr_insert"];
$S_pr_delete = $result[0]["pr_delete"];
$S_pr_update = $result[0]["pr_update"];

if ($S_pr_acceso != 'S') {
    echo "
        <script>
            alert('Atencion no tiene los permisos necesarios para ingresar en esta opcion');
        </script>
        ";

    return;
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>       
        <link rel="stylesheet" href="../../../css/iconos.css">        
        <link rel="stylesheet" href="../../../extjs/resources/css/ext-all.css">
        <!--<script type="text/javascript" src="../../../extjs/ext-all.js"></script>-->
        <script type="text/javascript" src="../../../extjs/ext-all.js"></script>
        <script type="text/javascript" src="../../../extjs/locale/ext-lang-es.js"></script>  
        <script type="text/javascript" src="app.js?v1"></script>
        <script type="text/javascript" src="../../../gen/utilidades/encriptacion.js"></script>
    </head>
    <body bgcolor="#CCCCFF">
        <div style="position:relative; display:none;">
            <input type="hidden=" name="S_se_codigo" id="S_se_codigo" value="<?php echo $S_se_codigo ?>"/>
            <input type="hidden=" name="S_us_codigo" id="S_us_codigo" value="<?php echo $S_us_codigo ?>"/>
            <input type="hidden=" name="S_pe_codigo" id="S_pe_codigo" value="<?php echo $S_pe_codigo ?>"/>
            <input type="hidden=" name="S_mn_codigo" id="S_mn_codigo" value="<?php echo $S_mn_codigo ?>"/> 
            <input type="hidden=" name="S_pr_acceso" id="S_pr_acceso" value="<?php echo $S_pr_acceso ?>"/> 
            <input type="hidden=" name="S_pr_insert" id="S_pr_insert" value="<?php echo $S_pr_insert ?>"/> 
            <input type="hidden=" name="S_pr_delete" id="S_pr_delete" value="<?php echo $S_pr_delete ?>"/> 
            <input type="hidden=" name="S_pr_update" id="S_pr_update" value="<?php echo $S_pr_update ?>"/> 
        </div>
    </body>
</html>
