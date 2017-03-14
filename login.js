Ext.onReady(function () {
    
    document.getElementById('login').focus();
    
    Ext.require([
        'Ext.tip.*',
        'Ext.Button',
        'Ext.window.MessageBox',
        'Ext.form.Field', 
        'Gen.view.MyNumberField'
        //    'Ext.ux.form.SearchField'
        ]);
    var submitBtn = Ext.get('submitBtn');
    submitBtn.on({
        'click': {
            fn: onClick
        },
        'mouseover': {
            fn: function () {
                submitBtn.addCls('qo-submit-over');
            }
        },
        'mouseout': {
            fn: function () {
                submitBtn.removeCls('qo-submit-over');
            }
        }
    });
    
    //    var txtLogin= Ext.get("login");
    //    txtLogin.enableKeyEvents = true;
    //    txtLogin.on('keypress', function(field, e){
    //        if (e.getCharCode() == e.ENTER) {
    //            alert('...55');
    //        }        
    //    }, this);
    //    txtLogin.on({
    //        'click': {
    //            fn: function() {
    //                alert('login');
    //            }
    //        },
    //        
    //        'keypress' : {
    //            fn: function(field, e) {
    //                alert(getCharCode());
    //            //                if (e.getCharCode() == e.ENTER) {
    //            //                    alert('....');
    //            //                }
    //            }
    //        }
    //    })

    function hideLoginFields() {
        Ext.get('login-label').setDisplayed('none');
        Ext.get('login').setDisplayed('none');
        Ext.get('clave-label').setDisplayed('none');
        Ext.get('clave').setDisplayed('none');
    }

    function loadGroupField(d) {
        var combo = Ext.get('field3');
        var comboEl = combo.dom;

        while (comboEl.options.length) {
            comboEl.options[0] = null;
        }

        for (var i = 0, len = d.length; i < len; i++) {
            comboEl.options[i] = new Option(d[i][1], d[i][0]);
        }
    }

    function onClick() {
        //var emailField = Ext.get("field1");
        //var email = emailField.dom.value;
        var login = Ext.get("login").dom.value;
        //var pwdField = Ext.get("field2");
        //var pwd = pwdField.dom.value;
        var password = Ext.get("clave").dom.value;
        if (validate(password)) {
            password = md5(Ext.get("clave").dom.value);
        }
        
        var groupField = Ext.get("field3");
        var group = groupField.dom.value;

        if (validate(login) === false) {
            Ext.Msg.show({  
                title: 'Mensaje del Sistema', //<- el título del diálogo  
                msg: 'Debe ingresar el usuario', //<- El mensaje  
                buttons: Ext.Msg.OK, //<- Botones de SI  
                icon: Ext.Msg.ERROR, // <- un ícono de error  
                fn: function() {
                    Ext.get("login").focus();                    
                }
            });   
            return;
        }

        if (validate(password) === false) {
            Ext.Msg.show({  
                title: 'Mensaje del Sistema', //<- el título del diálogo  
                msg: 'Debe ingresar el password', //<- El mensaje  
                buttons: Ext.Msg.OK, //<- Botones de SI  
                icon: Ext.Msg.ERROR, // <- un ícono de error                               
                fn: function() {
                    Ext.get("clave").focus();
                }
            });   
            return;
        }

        Ext.Ajax.request({
            url: 'login.php',
            //timeout: 50000,
            params: {
                action: 'login',
                login: login,
                password: password                

                
            },
            success: function (o) {
                
                if (typeof o == 'object') {
                    var d = Ext.decode(o.responseText);

                    if (typeof d == 'object') {
                        if (d.success == true) {
                            //alert(d.data);
                            
                            if (d.data >= 1) {
                                //Ext.get('user').dom.value = Ext.getCmp('usuario').getValue();  
                                //Ext.get('emp').dom.value = Ext.getCmp('empresa').getValue();
                                //window.location = 'desktop/desktop.php';
                                //document.form1.submit();
                                //window.location = 'main/index.php';
                                //alert('intro');
                                if (d.sesionIniciada > 0) {
//                                    Ext.Msg.confirm('Mensaje del Sistema', 'Ya se encuentra iniciada una sesion con este usuario en otra maquina, desea cerrar las sesiones abiertas en otra maquina con este usuario ?', function(btn) {
//                                        if (btn == 'yes') {
//                                            alert('Actualizando sesiones');
                                            Ext.Ajax.request({
                                                url: 'login.php',
                                                method: 'POST',
                                                params: {
                                                    action: 'cerrarSesiones',
                                                    us_codigo: d.us_codigo
                                                },
                                                success: function(response){                            
                                                    var text = Ext.decode(response.responseText);                            
                                                    var s = text.success;
                                                    
                                                    if (s) {
//                                                        Ext.Msg.show({  
//                                                            title: 'Confirmación', //<- el título del diálogo  
//                                                            msg: text.message.reason, //<- El mensaje  
//                                                            buttons: Ext.Msg.OK, //<- Botones de SI  
//                                                            icon: Ext.Msg.INFO, // <- un ícono de error  
//                                                            fn: function() {                                    
                                                                window.location = 'main/index.php';                                                                 
//                                                            }
//                                                        }); 
                                                    } else {
                                                        Ext.Msg.show({  
                                                            title: 'Mensaje del Sistema: ERROR ', //<- el título del diálogo  
                                                            msg: text.message.reason, //<- El mensaje  
                                                            buttons: Ext.Msg.OK, //<- Botones de SI  
                                                            icon: Ext.Msg.ERROR // <- un ícono de error                               
                                                        });
                                                    }
                                                },
                                                failure: function(response, options){                         
                                                    var text = Ext.decode(response.responseText);
                            
                                                    Ext.Msg.show({  
                                                        title: 'Mensaje del Sistema', //<- el título del diálogo  
                                                        msg: text, //<- El mensaje  
                                                        buttons: Ext.Msg.OK, //<- Botones de SI  
                                                        icon: Ext.Msg.ERROR // <- un ícono de error                               
                                                    });  
                                                }
                                            });

//                                        } else {
//                                            
//                                        }
//                                    });
                                } else {                                    
                                    window.location = 'main/index.php';                                    
                                }                                
                            } else {
                                Ext.Msg.show({  
                                    title: 'Mensaje del Sistema: ERROR ', //<- el título del diálogo  
                                    msg: d.mensaje, //<- El mensaje  
                                    buttons: Ext.Msg.OK, //<- Botones de SI  
                                    icon: Ext.Msg.ERROR, // <- un ícono de error         
                                    fn: function() {
                                        Ext.get("login").focus();
                                    }
                                });
                            }
                            
                            
                            
                            
                        //                            var g = d.groups;
                        //
                        //                            if (g && g.length > 0) {
                        //                                hideLoginFields();
                        //                                showGroupField();
                        //
                        //                                var d = [];
                        //                                for (var i = 0, len = g.length; i < len; i++) {
                        //                                    d.push([g[i].id, g[i].name]);
                        //                                }
                        //
                        //                                loadGroupField(d);
                        //
                        //                            } else if (d.sessionId !== '') {
                        //
                        //                                // get the path
                        //                                var path = window.location.pathname;
                        //                                alert(path);
                        //                                path = path.substring(0, path.lastIndexOf('/') + 1);
                        //
                        //                                // set the cookie
                        //                                set_cookie('sessionId', d.sessionId, '', path, '', '');
                        //
                        //                                // redirect the window
                        //                                window.location = path;

                        //}
                        } else {
                            //                            if (d.errors && d.errors[0].msg) {
                            //                                alert(d.errors[0].msg);
                            //                            } else                             
                            if (d.success == false) {
                                Ext.Msg.show({  
                                    title: 'Mensaje del Sistema: ERROR ', //<- el título del diálogo  
                                    msg: d.message.reason, //<- El mensaje  
                                    buttons: Ext.Msg.OK, //<- Botones de SI  
                                    icon: Ext.Msg.ERROR // <- un ícono de error                               
                                });
                            } else {                                
                                Ext.Msg.show({  
                                    title: 'Mensaje del Sistema: ERROR ', //<- el título del diálogo  
                                    msg: 'Errors encountered on the server.', //<- El mensaje  
                                    buttons: Ext.Msg.OK, //<- Botones de SI  
                                    icon: Ext.Msg.ERROR // <- un ícono de error                               
                                });
                            }
                            
                            Ext.get("login").focus();
                        }
                    }
                }
            },
            failure: function () {
                alert('Lost connection to server.');
            }
        });
    }

    function showGroupField() {
        Ext.get('field3-label').setDisplayed(true);
        Ext.get('field3').setDisplayed(true);
    }

    function validate(field) {
        if (field === '') {
            return false;
        }
        return true;
    }
});