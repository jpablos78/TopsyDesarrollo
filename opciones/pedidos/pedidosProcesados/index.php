<?php
include_once '../../../librerias/claseGenerica.php';

header('Content-Type: text/html; charset=UTF-8');

$S_se_codigo = isset($_GET['S_se_codigo']) ? $_GET['S_se_codigo'] : (isset($_POST['S_se_codigo']) ? $_POST['S_se_codigo'] : null);
$S_mn_codigo = isset($_GET['S_mn_codigo']) ? $_GET['S_mn_codigo'] : (isset($_POST['S_mn_codigo']) ? $_POST['S_mn_codigo'] : null);

$objetoSesion = new claseSesion();

$result = $objetoSesion->getDataSesion($S_se_codigo);

$S_us_codigo = $result[0]["us_codigo"];
$S_pe_codigo = $result[0]["pe_codigo"];
$S_cci_vendedor = $result[0]["cci_vendedor"];
$S_us_nombres_apellidos = $result[0]["us_nombres_apellidos"];

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
$S_pr_cp = $result[0]["pr_cp"];

if ($S_pr_acceso != 'S') {
    echo "
        <script>
            alert('Atencion no tiene los permisos necesarios para ingresar en esta opcion');
        </script>
        ";

    return;
}

//if ($S_cci_vendedor == '0') {
//    echo "
//        <script>
//            alert('Atencion solo los vendedores registrados pueden realizar pedidos');
//        </script>
//        ";
//
//    return;
//}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
<!--        <link rel="stylesheet" href="../../../css/iconos.css">        
        <link rel="stylesheet" href="../../../css/array-grid.css">
        <link rel="stylesheet" href="../../../extjs/src/ux/css/CheckHeader.css">
        <link rel="stylesheet" href="../../../extjs/resources/css/ext-all.css">  
        <link rel="stylesheet" type="text/css" href="../../../extjs/shared/example.css" />
        <script type="text/javascript" src="../../../extjs/ext-all.js"></script>
        <script type="text/javascript" src="../../../extjs/locale/ext-lang-es.js"></script>
        <script type="text/javascript" src="../../../extjs/src/ux/form/SearchField.js?V1"></script>
        <script type="text/javascript" src="../../../extjs/shared/examples.js"></script>
        <script type="text/javascript" src="app.js?v2"></script>-->
        
        
        
        <link rel="stylesheet" href="../../../css/iconos.css?v2">          
        <link rel="stylesheet" href="../../../css/array-grid.css">        
        <link rel="stylesheet" href="../../../extjs/src/ux/css/CheckHeader.css">
        <link rel="stylesheet" href="../../../extjs/resources/css/ext-all.css">        
        <script type="text/javascript" src="../../../extjs/ext-all.js"></script>
        <script type="text/javascript" src="../../../extjs/locale/ext-lang-es.js"></script>        
        <script type="text/javascript" src="app.js?v3"></script>
        
    </head>
    <body bgcolor="#CCCCFF">
        <div style="position:relative; display:none;">
            <input type="hidden=" name="S_se_codigo" id="S_se_codigo" value="<?php echo $S_se_codigo ?>"/>
            <input type="hidden=" name="S_us_codigo" id="S_us_codigo" value="<?php echo $S_us_codigo ?>"/>
            <input type="hidden=" name="S_pe_codigo" id="S_pe_codigo" value="<?php echo $S_pe_codigo ?>"/>
            <input type="hidden=" name="S_mn_codigo" id="S_mn_codigo" value="<?php echo $S_mn_codigo ?>"/>
            <input type="hidden=" name="S_cci_vendedor" id="S_cci_vendedor" value="<?php echo $S_cci_vendedor ?>"/>
            <input type="hidden=" name="S_us_nombres_apellidos" id="S_us_nombres_apellidos" value="<?php echo $S_us_nombres_apellidos ?>"/>
            <input type="hidden=" name="S_pr_acceso" id="S_pr_acceso" value="<?php echo $S_pr_acceso ?>"/> 
            <input type="hidden=" name="S_pr_insert" id="S_pr_insert" value="<?php echo $S_pr_insert ?>"/> 
            <input type="hidden=" name="S_pr_delete" id="S_pr_delete" value="<?php echo $S_pr_delete ?>"/> 
            <input type="hidden=" name="S_pr_update" id="S_pr_update" value="<?php echo $S_pr_update ?>"/>
            <input type="hidden=" name="S_pr_cp" id="S_pr_cp" value="<?php echo $S_pr_cp ?>"/>
        </div>
    </body>
</html>
