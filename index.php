<?php
include_once 'librerias/claseGenerica.php';

$detect = new Mobile_Detect();
$deviceType = ($detect->isMobile() ? ($detect->isTablet() ? 'tablet' : 'phone') : 'computer');

//$deviceType = 'tablet';

if ($deviceType != 'computer') {
    //header('Location:../WebPedidosM/index.php');
	header('Location:WebPedidosM/main/index.php');
}

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=7,8,9" />
        <title>.:: Helador Topsy ::.</title>

        <!-- Ext Core -->
        <!--<script type="text/javascript" src="client/misc/ext-core.js"></script>-->
		<link rel="shortcut icon" type="image/x-icon" href="favicon2.ico">
        <link rel="stylesheet" href="extjs/resources/css/ext-all.css">
        <script type="text/javascript" src="extjs/ext-all.js"></script>
        <script type="text/javascript" src="extjs/locale/ext-lang-es.js"></script>

        <!-- Login -->
        <!--<link rel="stylesheet" type="text/css" href="resources/css/login.css" />-->
        <link rel="stylesheet" type="text/css" href="css/login.css" />
        <!--<script type="text/javascript" src="client/misc/cookies.js"></script>-->
        <script type="text/javascript" src="login.js?v2"></script>
        <script type="text/javascript" src="gen/utilidades/encriptacion.js"></script>
        <script>
            function runScript(e) {
                if (e.keyCode == 13) {                    
                    document.getElementById('clave').focus()
                    return false;
                }
            }
            
            function runScript2(e) {
                if (e.keyCode == 13) {                    
                    document.getElementById('submitBtn').focus()
                    return false;
                }
            }
        </script>

    </head>

    <body>
        <div id="qo-panel">            
            <label for="login" class="qo-abs-position" id="login-label" accesskey="e" name="login-label"><span class="key">U</span>suario:</label>
            <input class="qo-abs-position" type="text" name="login" id="login" value="" onkeypress="return runScript(event)"/>

            <label for="clave" class="qo-abs-position" id="clave-label" accesskey="p" name="clave-label"><span class="key">C</span>ontraseña:</label>
            <input class="qo-abs-position" type="password" name="clave" id="clave" value="" onkeypress="return runScript2(event)"/>

            <label id="field3-label" class="qo-abs-position" accesskey="g" for="field3" style="display: none;"><span class="key">G</span>roup</label>
            <select class="qo-abs-position" name="field3" id="field3" style="display: none;"></select>
            <input id="submitBtn" class="qo-submit qo-abs-position" type="image" src="images/login/s.gif" />
        </div>

        <!--        <div id="qo-panel">
                    <img alt="" src="images/login/s.gif" class="qo-logo qo-abs-position" />
        
                    <div class="qo-benefits qo-abs-position">
                        <p>A familiar desktop environment where you can access all your web applications in a single web page</p>
                        <p>Change the theme, wallpaper and colors to your liking</p>
                    </div>
        
                    <img alt="" src="images/login/s.gif" class="qo-screenshot qo-abs-position" />
        
                    <span class="qo-supported qo-abs-position">
                        <b>Supported Browsers</b><br />
                        <a href="http://www.mozilla.org/download.html" target="_blank">Firefox 2+</a><br />
                        <a href="http://www.microsoft.com/windows/downloads/ie/getitnow.mspx" target="_blank">Internet Explorer 7+</a><br />
                        <a href="http://www.opera.com/download/" target="_blank">Opera 9+</a><br />
                        <a href="http://www.apple.com/safari/download/" target="_blank">Safari 2+</a>
                    </span>
                    <label for="field1" class="qo-abs-position" id="field1-label" accesskey="e" name="field1-label"><span class="key">L</span>ogin</label>
                    <input class="qo-abs-position" type="text" name="field1" id="field1" value="" />
        
                    <label for="field2" class="qo-abs-position" id="field2-label" accesskey="p" name="field2-label"><span class="key">P</span>assword</label>
                    <input class="qo-abs-position" type="password" name="field2" id="field2" value="" />
        
                    <label id="field3-label" class="qo-abs-position" accesskey="g" for="field3" style="display: none;"><span class="key">G</span>roup</label>
                    <select class="qo-abs-position" name="field3" id="field3" style="display: none;"></select>
        
                    <input id="submitBtn" class="qo-submit qo-abs-position" type="image" src="images/login/s.gif" />
                </div>-->

    </body>
</html>
