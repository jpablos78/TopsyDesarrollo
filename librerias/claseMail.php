<?php

include_once 'PhpMailer/class.phpmailer.php';
include_once 'PhpMailer/class.smtp.php';
include_once 'claseGenerica.php';

class claseMail {

    public function enviarListaMailPedidoWeb($lc_codigo, $cp_codigo, $ruta) {

        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            echo $objetoBaseDatos->getErrorConexionJson();
        } else {

            $query = "select * from wp_lista_correo where lc_codigo = '$lc_codigo' ";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getError()) {
                echo $objetoBaseDatos->getErrorJson($query);
            } else {
                $lc_asunto = $result[0]["lc_asunto"] . " # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT);
//                $lc_mensaje = $result[0]["lc_mensaje"];
//                $query = "select * from wp_lista_correo_detalle where lc_codigo = '$lc_codigo' and ld_estado = 'A' ";

                $query = "select * 
                          from wp_lista_correo_detalle 
                          where lc_codigo = '$lc_codigo' 
                          and ld_estado = 'A' 

                          union

                          select 999, 1, us_nombres + ' ' + us_apellidos as ld_nombre, us_email, 0, 1, 0, 'A'
                          from wp_usuarios
                          where us_codigo = (select us_codigo_vendedor
                                               from wp_cabecera_pedido
                                               where cp_codigo = '$cp_codigo')";

                $result = $objetoBaseDatos->query($query);

                if ($objetoBaseDatos->getError()) {
                    echo $objetoBaseDatos->getErrorJson($query);
                } else {

                    //$cp_codigo = 999;

                    $mail = new PHPMailer();
                    $body = "<b>Se Genero el pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " <br><br>
                     La informacion acerca del pedido se encuentra en el archivo adjunto.</b><br><br>";

                    $mail->IsSMTP();

                    $mail->Host = _smtp;
					
					$mail->Port = _port; // SMTP Port

                    $mail->SMTPSecure = _smtpSecure;

                    $mail->From = _from;

                    $mail->FromName = _fromName;

//                $mail->Subject = "Pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " Generado";
                    $mail->Subject = $lc_asunto;

                    $mail->AltBody = "Cuerpo alternativo para cuando el visor no puede leer HTML en el cuerpo";

                    $mail->MsgHTML($body);

                    //var ruta = '../../descargas/pedidos/notasPedido/wp_' + Ext.getCmp('cp_codigo').getValue() + '.pdf'; 
                    //$ruta = '../../../../../descargas/pedidos/notasPedido/wp_' . $cp_codigo . '.pdf';
//        $mail->AddAddress("efigueroa@inti-moda.com", "Edison Figueroa");

                    foreach ($result as $key => $rows) {
                        if ($rows['ld_a']) {
                            $mail->AddAddress($rows['ld_mail'], $rows['ld_nombre']);
                        }

                        if ($rows['ld_cc']) {
                            $mail->AddCC($rows['ld_mail'], $rows['ld_nombre']);
                        }

                        if ($rows['ld_bcc']) {
                            $mail->AddBCC($rows['ld_mail'], $rows['ld_nombre']);
                        }
                    }


//                    $mail->AddAddress("jpsanchez@inti-moda.com", "Juan Sanchez");
//                    $mail->AddAddress("jpablos2011@gmail.com", "JPabloS");
//                    $mail->AddCC("udg2001@hotmail.com", "Juan Sanchez");

                    $mail->AddAttachment($ruta);

                    $mail->SMTPAuth = true;

                    $mail->Username = _userName;
                    $mail->Password = _passwordMail;

                    if (!$mail->Send()) {
                        echo $objetoBaseDatos->getCadenaJson('El pedido se grabo correctamente, pero ocurrio un error al enviar el reporte por mail a la oficina: ' . $mail->ErrorInfo, false);
                    } else {
                        echo $objetoBaseDatos->getCadenaJson('¡¡Enviado!!', true);
                    }
                }
            }
        }
    }

    public function enviarListaMailPedidoWeb2($lc_codigo, $cp_codigo, $ruta) {

        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            echo $objetoBaseDatos->getErrorConexionJson();
        } else {

            $query = "select * from wp_lista_correo where lc_codigo = '$lc_codigo' ";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getError()) {
                echo $objetoBaseDatos->getErrorJson($query);
            } else {
                $lc_asunto = $result[0]["lc_asunto"] . " # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT);
//                $lc_mensaje = $result[0]["lc_mensaje"];
//                $query = "select * from wp_lista_correo_detalle where lc_codigo = '$lc_codigo' and ld_estado = 'A' ";

                $query = "select * 
                          from wp_lista_correo_detalle 
                          where lc_codigo = '$lc_codigo' 
                          and ld_estado = 'A' 

                          union

                          select 999, 1, us_nombres + ' ' + us_apellidos as ld_nombre, us_email, 0, 1, 0, 'A'
                          from wp_usuarios
                          where us_codigo = (select us_codigo_vendedor
                                               from wp_cabecera_pedido
                                               where cp_codigo = '$cp_codigo')";

                $result = $objetoBaseDatos->query($query);

                if ($objetoBaseDatos->getError()) {
                    echo $objetoBaseDatos->getErrorJson($query);
                } else {

                    //$cp_codigo = 999;

                    $mail = new PHPMailer();
                    $body = "<b>Se Genero el pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " <br><br>
                     La informacion acerca del pedido se encuentra en el archivo adjunto.</b><br><br>";

                    $mail->IsSMTP();

                    $mail->Host = _smtp;
					
					$mail->Port = _port; // SMTP Port

                    $mail->SMTPSecure = _smtpSecure;

                    $mail->From = _from;

                    $mail->FromName = _fromName;

//                $mail->Subject = "Pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " Generado";
                    $mail->Subject = $lc_asunto;

                    $mail->AltBody = "Cuerpo alternativo para cuando el visor no puede leer HTML en el cuerpo";

                    $mail->MsgHTML($body);

                    //var ruta = '../../descargas/pedidos/notasPedido/wp_' + Ext.getCmp('cp_codigo').getValue() + '.pdf'; 
                    //$ruta = '../../../../../descargas/pedidos/notasPedido/wp_' . $cp_codigo . '.pdf';
//        $mail->AddAddress("efigueroa@inti-moda.com", "Edison Figueroa");

                    foreach ($result as $key => $rows) {
                        if ($rows['ld_a']) {
                            $mail->AddAddress($rows['ld_mail'], $rows['ld_nombre']);
                        }

                        if ($rows['ld_cc']) {
                            $mail->AddCC($rows['ld_mail'], $rows['ld_nombre']);
                        }

                        if ($rows['ld_bcc']) {
                            $mail->AddBCC($rows['ld_mail'], $rows['ld_nombre']);
                        }
                    }


//                    $mail->AddAddress("jpsanchez@inti-moda.com", "Juan Sanchez");
//                    $mail->AddAddress("jpablos2011@gmail.com", "JPabloS");
//                    $mail->AddCC("udg2001@hotmail.com", "Juan Sanchez");

                    $mail->AddAttachment($ruta);

                    $mail->SMTPAuth = true;

                    $mail->Username = _userName;
                    $mail->Password = _passwordMail;

                    if (!$mail->Send()) {
                        echo $objetoBaseDatos->getCadenaJson('El pedido se grabo correctamente, pero ocurrio un error al enviar el reporte por mail a la oficina: ' . $mail->ErrorInfo, false);
                    } else {
                        echo $objetoBaseDatos->getCadenaJson('¡¡Enviado!!', true);
                    }
                }
            }
        }
    }

    public function enviarClienteMailPedidoWeb($lc_codigo, $cp_codigo, $ruta, $emailCliente) {

        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            echo $objetoBaseDatos->getErrorConexionJson();
        } else {

            $query = "select * from wp_lista_correo where lc_codigo = '$lc_codigo' ";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getError()) {
                echo $objetoBaseDatos->getErrorJson($query);
            } else {
                $lc_asunto = $result[0]["lc_asunto"] . " # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT);
//                $lc_mensaje = $result[0]["lc_mensaje"];
//                $query = "select * from wp_lista_correo_detalle where lc_codigo = '$lc_codigo' and ld_estado = 'A' ";
//                $query = "select * 
//                          from wp_lista_correo_detalle 
//                          where lc_codigo = '$lc_codigo' 
//                          and ld_estado = 'A' 
//
//                          union
//
//                          select 999, 1, us_nombres + ' ' + us_apellidos as ld_nombre, us_email, 0, 1, 0, 'A'
//                          from wp_usuarios
//                          where cci_cliprov = (select cci_vendedor
//                                               from wp_cabecera_pedido
//                                               where cp_codigo = '$cp_codigo')";

                $query = "
                select 111 as ld_codigo, 1 as lc_codigo, cno_cliente as ld_nombre, '$emailCliente' as ld_mail, 1 as ld_a, 0 as ld_cc, 0 as ld_bcc, 'A' as ld_estado
                from wp_cabecera_pedido
                where cp_codigo = '$cp_codigo'

                union 

                select 999, 1, us_nombres + ' ' + us_apellidos as ld_nombre, us_email, 0, 1, 0, 'A'
                      from wp_usuarios
                      where us_codigo = (select us_codigo_vendedor
                                           from wp_cabecera_pedido
                                           where cp_codigo = '$cp_codigo')                    
                    ";

                $result = $objetoBaseDatos->query($query);

                if ($objetoBaseDatos->getError()) {
                    echo $objetoBaseDatos->getErrorJson($query);
                } else {

                    //$cp_codigo = 999;

                    $mail = new PHPMailer();
                    $body = "<b>Se Genero el pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " <br><br>
                     La informacion acerca del pedido se encuentra en el archivo adjunto.</b><br><br>";

                    $mail->IsSMTP();

                    $mail->Host = _smtp;
					
					$mail->Port = _port; // SMTP Port

                    $mail->SMTPSecure = _smtpSecure;

                    $mail->From = _from;

                    $mail->FromName = _fromName;

//                $mail->Subject = "Pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " Generado";
                    $mail->Subject = $lc_asunto;

                    $mail->AltBody = "Cuerpo alternativo para cuando el visor no puede leer HTML en el cuerpo";

                    $mail->MsgHTML($body);

                    //var ruta = '../../descargas/pedidos/notasPedido/wp_' + Ext.getCmp('cp_codigo').getValue() + '.pdf'; 
                    //$ruta = '../../../../../descargas/pedidos/notasPedido/wp_' . $cp_codigo . '.pdf';
//        $mail->AddAddress("efigueroa@inti-moda.com", "Edison Figueroa");

                    foreach ($result as $key => $rows) {
                        if ($rows['ld_a']) {
                            $mail->AddAddress($rows['ld_mail'], $rows['ld_nombre']);
                        }

                        if ($rows['ld_cc']) {
                            $mail->AddCC($rows['ld_mail'], $rows['ld_nombre']);
                        }

                        if ($rows['ld_bcc']) {
                            $mail->AddBCC($rows['ld_mail'], $rows['ld_nombre']);
                        }
                    }


//                    $mail->AddAddress("jpsanchez@inti-moda.com", "Juan Sanchez");
//                    $mail->AddAddress("jpablos2011@gmail.com", "JPabloS");
//                    $mail->AddCC("udg2001@hotmail.com", "Juan Sanchez");

                    $mail->AddAttachment($ruta);

                    $mail->SMTPAuth = true;

                    $mail->Username = _userName;
                    $mail->Password = _passwordMail;

                    if (!$mail->Send()) {
                        echo $objetoBaseDatos->getCadenaJson('El pedido se grabo correctamente, pero ocurrio un error al enviar el reporte por mail a la oficina: ' . $mail->ErrorInfo, false);
                    } else {
                        echo $objetoBaseDatos->getCadenaJson('¡¡Enviado!!', true);
                    }
                }
            }
        }
    }

    public function enviarMail($destinatarios, $asunto, $ruta, $body) {
        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            echo $objetoBaseDatos->getErrorConexionJson();
        } else {
            $mail = new PHPMailer();
//                    $body = "<b>Se Genero el pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " <br><br>
//                     La informacion acerca del pedido se encuentra en el archivo adjunto.</b><br><br>";

            $mail->IsSMTP();

            $mail->Host = _smtp;
			
			$mail->Port = _port; // SMTP Port

            $mail->SMTPSecure = _smtpSecure;

            $mail->From = _from;

            $mail->FromName = _fromName;

//                $mail->Subject = "Pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " Generado";
            $mail->Subject = $asunto;

            $mail->AltBody = "Cuerpo alternativo para cuando el visor no puede leer HTML en el cuerpo";

            $mail->MsgHTML($body);

            foreach ($result as $key => $rows) {
                if ($rows['ld_a']) {
                    $mail->AddAddress($rows['ld_mail'], $rows['ld_nombre']);
                }

                if ($rows['ld_cc']) {
                    $mail->AddCC($rows['ld_mail'], $rows['ld_nombre']);
                }

                if ($rows['ld_bcc']) {
                    $mail->AddBCC($rows['ld_mail'], $rows['ld_nombre']);
                }
            }

            $mail->AddAttachment($ruta);

            $mail->SMTPAuth = true;

            $mail->Username = _userName;
            $mail->Password = _passwordMail;

            if (!$mail->Send()) {
                echo $objetoBaseDatos->getCadenaJson('El pedido se grabo correctamente, pero ocurrio un error al enviar el reporte por mail a la oficina: ' . $mail->ErrorInfo, false);
            } else {
                echo $objetoBaseDatos->getCadenaJson('¡¡Enviado!!', true);
            }
        }
    }

    public function enviarListaMail($lc_codigo, $ruta, $body) {
        $objetoBaseDatos = new claseBaseDatos();
        $objetoBaseDatos->conectarse();

        if ($objetoBaseDatos->getErrorConexionNo()) {
            echo $objetoBaseDatos->getErrorConexionJson();
        } else {

            $query = "select * from wp_lista_correo where lc_codigo = '$lc_codigo' ";

            $result = $objetoBaseDatos->query($query);

            if ($objetoBaseDatos->getError()) {
                echo $objetoBaseDatos->getErrorJson($query);
            } else {
                $lc_asunto = $result[0]["lc_asunto"];
//                $lc_mensaje = $result[0]["lc_mensaje"];

                $query = "select * from wp_lista_correo_detalle where lc_codigo = '$lc_codigo' and ld_estado = 'A' ";

                $result = $objetoBaseDatos->query($query);

                if ($objetoBaseDatos->getError()) {
                    echo $objetoBaseDatos->getErrorJson($query);
                } else {

                    //$cp_codigo = 999;

                    $mail = new PHPMailer();
//                    $body = "<b>Se Genero el pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " <br><br>
//                     La informacion acerca del pedido se encuentra en el archivo adjunto.</b><br><br>";

                    $mail->IsSMTP();

                    $mail->Host = _smtp;
					
					$mail->Port = _port; // SMTP Port

                    $mail->SMTPSecure = _smtpSecure;

                    $mail->From = _from;

                    $mail->FromName = _fromName;

//                $mail->Subject = "Pedido Web # " . str_pad($cp_codigo, 7, '0', STR_PAD_LEFT) . " Generado";
                    $mail->Subject = $lc_asunto;

                    $mail->AltBody = "Cuerpo alternativo para cuando el visor no puede leer HTML en el cuerpo";

                    $mail->MsgHTML($body);

                    //var ruta = '../../descargas/pedidos/notasPedido/wp_' + Ext.getCmp('cp_codigo').getValue() + '.pdf'; 
                    //$ruta = '../../../../../descargas/pedidos/notasPedido/wp_' . $cp_codigo . '.pdf';
//        $mail->AddAddress("efigueroa@inti-moda.com", "Edison Figueroa");

                    foreach ($result as $key => $rows) {
                        if ($rows['ld_a']) {
                            $mail->AddAddress($rows['ld_mail'], $rows['ld_nombre']);
                        }

                        if ($rows['ld_cc']) {
                            $mail->AddCC($rows['ld_mail'], $rows['ld_nombre']);
                        }

                        if ($rows['ld_bcc']) {
                            $mail->AddBCC($rows['ld_mail'], $rows['ld_nombre']);
                        }
                    }


//                    $mail->AddAddress("jpsanchez@inti-moda.com", "Juan Sanchez");
//                    $mail->AddAddress("jpablos2011@gmail.com", "JPabloS");
//                    $mail->AddCC("udg2001@hotmail.com", "Juan Sanchez");

                    $mail->AddAttachment($ruta);

                    $mail->SMTPAuth = true;

                    $mail->Username = _userName;
                    $mail->Password = _passwordMail;

                    if (!$mail->Send()) {
                        echo $objetoBaseDatos->getCadenaJson('El pedido se grabo correctamente, pero ocurrio un error al enviar el reporte por mail a la oficina: ' . $mail->ErrorInfo, false);
                    } else {
                        echo $objetoBaseDatos->getCadenaJson('¡¡Enviado!!', true);
                    }
                }
            }
        }
    }

}

?>
