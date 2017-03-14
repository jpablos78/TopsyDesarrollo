<?php

$imagenes = array();

$imagenes[0] = 'paginaEnConstruccion1.jpg';
$imagenes[1] = 'paginaEnConstruccion2.jpg';
$imagenes[2] = 'paginaEnConstruccion3.jpg';
$imagenes[3] = 'paginaEnConstruccion4.jpg';
$imagenes[4] = 'paginaEnConstruccion5.jpg';

$i = rand(0, 4);

$presentar = '
	<table align="center" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td><img src="images/login/' . $imagenes[$i] .'" /></td>			
		</tr>			
	</table>
';

echo $presentar;

?>
