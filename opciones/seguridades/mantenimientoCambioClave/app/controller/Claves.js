Ext.define('Claves.controller.Claves', {
    extend: 'Ext.app.Controller',       
    views: ['ClaEdit'],
    requires: ['Ext.MessageBox'],       
    
    init: function() {
        tipo = '';        
        
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'side';                
        
        this.control({
            
            'claedit button[action=grabar]': {
                click: this.actualizarRegistro
            },
            
            'claedit textfield': {                
                keypress: this.keypress                
            }
        });
    },        
    
    actualizarRegistro: function(btn) {
        var win = btn.up('window'),        
        form2 = win.down('form').getForm();
                       
        var msg = 'Debe llenar los campos obligatorios'; 
        
        var S_se_codigo = Ext.get("S_se_codigo").dom.value;                                                                        
        var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
        var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
        var S_us_codigo = Ext.get("S_us_codigo").dom.value;
                
        if (form2.isValid()) {          
            if (Ext.util.Format.trim(Ext.getCmp('us_pass').getValue()).length>15 || Ext.util.Format.trim(Ext.getCmp('us_new_pass').getValue()).length>15) {
                Ext.Msg.show({  
                    title: 'Mensaje del Sistema', //<- el título del diálogo                       
                    msg: 'Atencion: La clave no puede ser mayor de 15 caracteres', //<- El mensaje
                    buttons: Ext.Msg.OK, //<- Botones de SI  
                    icon: Ext.Msg.ERROR // <- un ícono de error                           
                });
                
                return;
            }
            
            Ext.getCmp('us_pass').setValue(md5(Ext.getCmp('us_pass').getValue()));
            Ext.getCmp('us_new_pass').setValue(md5(Ext.getCmp('us_new_pass').getValue())); 
            
            var box = Ext.MessageBox.wait('Por favor espere mientras se actualiza el usario', 'Enviando');
            
            form2.submit({
                url: 'app/data/Claves.php',
                method: 'POST',
                params: {
                    action : 'actualizar',
                    S_se_codigo: S_se_codigo,
                    S_pe_codigo: S_pe_codigo,
                    S_mn_codigo: S_mn_codigo,
                    S_us_codigo: S_us_codigo
                },
                success: function(form2, action) {
                    box.hide();
                    
                    Ext.Msg.show({  
                        title: 'Confirmación', //<- el título del diálogo  
                        msg: action.result.message.reason, //<- El mensaje  
                        buttons: Ext.Msg.OK, //<- Botones de SI  
                        icon: Ext.Msg.INFO, // <- un ícono de error                          
                        fn: function() {
                            
                        }
                    });                                       
                },
                failure: function(form2, action) {
                    box.hide();
                    Ext.Msg.show({  
                        title: 'Mensaje del Sistema', //<- el título del diálogo  
                        //msg: 'error',
                        msg: action.result.message.reason, //<- El mensaje  
                        buttons: Ext.Msg.OK, //<- Botones de SI  
                        icon: Ext.Msg.ERROR // <- un ícono de error                           
                    });                
                }
            });                           
        } else {
            Ext.Msg.show({  
                title: 'Mensaje del Sistema', //<- el título del diálogo  
                msg: msg, //<- El mensaje  
                buttons: Ext.Msg.OK, //<- Botones de SI  
                icon: Ext.Msg.ERROR // <- un ícono de error                   
            });
        }                   
    },

    keypress: function(field, e) {        
        if (e.getCharCode() == e.ENTER) {            
            switch(field.name) {
                case 'us_pass':
                    Ext.getCmp('us_new_pass').focus()
                    break;
                case 'us_new_pass':
                    Ext.getCmp('cmdGrabar').focus()
                    break;                
            }
        }
    }
});
