Ext.define('Perfiles.controller.Perfiles', {
    extend: 'Ext.app.Controller',
   
    //models: ['Usuario'],
    stores: ['Perfiles'],
    views: ['PerMain', 'PerNuevo', 'PerEdit'],
    requires: ['Ext.MessageBox'],
   
    refs: [
    {
        ref: 'list',
        selector: 'permain'
    }
    ],
    
    init: function() {
        tipo = '';
        
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'side';
        
        this.getStore('Perfiles').load(function(records, operation, success, response) {
            //var json = Ext.decode(response.responseText);
            //alert(json); 
            if(!success) {
                Ext.Msg.alert("Failed",operation.request.scope.reader.jsonData["message"]);
            }         
        });
                
        this.control({
            'permain': {
                itemdblclick: this.editar
            },
            
            'permain button[action=nuevo]': {
                click: this.nuevo
            },
            
            'permain actioncolumn': {
                click:  this.onAction
            },
            
            'pernuevo button[action=grabar]': {
                click: this.grabarNuevoRegistro
            },
            
            'pernuevo textfield': {                
                keypress: this.keypress                
            },
            
            'peredit textfield': {                
                keypress: this.keypressEdit                
            },
            
            'peredit button[action=grabar]': {
                click: this.actualizarRegistro
            }
        });
    },
    
    nuevo: function() {        
        tipo = 'N';      
                
        var me = this,
        view = Ext.widget('windownuevo');
        
        //storeP = this.getStore('Perfiles');
        //Ext.getCmp('pe_codigo').setValue(storeP.getAt('0').get('pe_codigo'))

        view.setTitle('Nuevo Usuario');
        
    //Ext.getCmp('btnNew').setVisible(false);        
    },
    
    //    grabar: function(btn) {
    //        if (tipo == 'N') {
    //            this.grabarNuevoRegistro(btn);
    //        } else {            
    //        //this.actualizarRegistro(btn);
    //        }
    //    },
    
    grabarNuevoRegistro: function(btn) {
        var me = this,
        form = btn.up('pernuevo'),
        win = form.up('window'),
        store = this.getStore('Perfiles'),
        basicForm = form.getForm();     
        
        var S_se_codigo = Ext.get("S_se_codigo").dom.value;                                                                        
        var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
        var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
        
        if(basicForm.isValid()) {     
            var box = Ext.MessageBox.wait('Por favor espere mientras se graba el Registro', 'Enviando');
            
            basicForm.submit({
                url: 'app/data/Perfiles.php',
                method: 'POST',
                params: {
                    action : 'guardar',
                    S_se_codigo: S_se_codigo,
                    S_pe_codigo: S_pe_codigo,
                    S_mn_codigo: S_mn_codigo
                },
                success: function(basicForm, action) {
                    //var data = Ext.util.JSON.decode(action.response.responseText);
                    
                    Ext.Msg.show({  
                        title: 'Confirmación', //<- el título del diálogo  
                        msg: action.result.message.reason, //<- El mensaje  
                        buttons: Ext.Msg.OK, //<- Botones de SI  
                        icon: Ext.Msg.INFO, // <- un ícono de error  
                        fn: function() {
                            win.close();
                            store.load(); 
                            box.hide();
                        }
                    });  
                    
                //Ext.Msg.alert('Success', action.result.message.reason);
                //store.load();
                //win.close();
                },
                failure: function(basicForm, action) {
                    //Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                    Ext.Msg.show({  
                        title: 'Mensaje del Sistema', //<- el título del diálogo  
                        msg: action.result.message.reason, //<- El mensaje  
                        buttons: Ext.Msg.OK, //<- Botones de SI  
                        icon: Ext.Msg.ERROR, // <- un ícono de error   
                        fn: function() {
                            box.hide();
                            win.close();                             
                        }
                    });                     
                }
            });     
                                              
        } else {
            Ext.Msg.show({  
                title: 'Mensaje del Sistema', //<- el título del diálogo  
                msg: 'Debe llenar los campos obligatorios', //<- El mensaje  
                buttons: Ext.Msg.OK, //<- Botones de SI  
                icon: Ext.Msg.ERROR // <- un ícono de error                               
            });  
        }  
    },
    
    editar: function() {
        var S_pr_update = Ext.get("S_pr_update").dom.value;

        if (S_pr_update == 'S') {
            tipo = 'U';        
            var me = this,
            grid = me.getList(),                
            records = grid.getSelectionModel().getSelection();
        
            if(records.length === 1){
                var record = records[0],
                view = Ext.widget('windowedit'),
                form = view.down('form').getForm();                                    
            
            
                form.loadRecord(record);
                        
                Ext.getCmp('pe_estado').setValue(record.get('pe_estado'));
            
                view.setTitle('Modificar Usuario');

            }else{
                Ext.Msg.show({  
                    title: 'Mensaje del Sistema', //<- el título del diálogo  
                    msg: 'Debe seleccionar un registro', //<- El mensaje  
                    buttons: Ext.Msg.OK, //<- Botones de SI  
                    icon: Ext.Msg.ERROR // <- un ícono de error                               
                });            
            }
        }
    },
    
    actualizarRegistro: function(btn) {
        var win = btn.up('window'),        
        form2 = win.down('form').getForm();
        
        var me = this,
        grid = me.getList(),
        store = grid.getStore();        
        var msg = 'Debe llenar los campos obligatorios';  
        
        var S_se_codigo = Ext.get("S_se_codigo").dom.value;                                                                        
        var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
        var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
                
        if (form2.isValid()) {        
            var box = Ext.MessageBox.wait('Por favor espere mientras se actualiza el usario', 'Enviando');
            
            form2.submit({
                url: 'app/data/Perfiles.php',
                method: 'POST',
                params: {
                    action : 'actualizar',
                    S_se_codigo: S_se_codigo,
                    S_pe_codigo: S_pe_codigo,
                    S_mn_codigo: S_mn_codigo                    
                },
                success: function(form2, action) {
                    Ext.Msg.show({  
                        title: 'Confirmación', //<- el título del diálogo  
                        msg: action.result.message.reason, //<- El mensaje  
                        buttons: Ext.Msg.OK, //<- Botones de SI  
                        icon: Ext.Msg.INFO, // <- un ícono de error  
                        fn: function() {
                            box.hide();
                            win.close();
                            store.load();                            
                        }
                    });                                          
                },
                failure: function(form2, action) {
                    Ext.Msg.show({  
                        title: 'Mensaje del Sistema', //<- el título del diálogo  
                        //msg: 'error',
                        msg: action.result.message.reason, //<- El mensaje  
                        buttons: Ext.Msg.OK, //<- Botones de SI  
                        icon: Ext.Msg.ERROR, // <- un ícono de error   
                        fn: function() {
                            box.hide();
                            win.close();                                                       
                        }
                    });
                //Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                }
            });   
            
            win.close();
        } else {
            Ext.Msg.show({  
                title: 'Mensaje del Sistema', //<- el título del diálogo  
                msg: msg, //<- El mensaje  
                buttons: Ext.Msg.OK, //<- Botones de SI  
                icon: Ext.Msg.ERROR // <- un ícono de error                   
            });
        }                   
    },
    
    eliminar: function() {
        var store = this.getStore('Perfiles');
        var me = this,
        grid = me.getList(),
        records = grid.getSelectionModel().getSelection();
        if(records.length === 1){
            var record = records[0]            
            Ext.Msg.confirm('Mensaje del Sistema', 'Desea eliminar el Registro', function(btn) {
                if (btn == 'yes') {
                    var box = Ext.MessageBox.wait('Por favor espere mientras se elimina el registro', 'Enviando');
                    
                    var S_se_codigo = Ext.get("S_se_codigo").dom.value;                                                                        
                    var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
                    var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
        
                    Ext.Ajax.request({
                        url: 'app/data/Perfiles.php',
                        method: 'POST',
                        params: {
                            action: 'eliminar',                                
                            pe_codigo: record.get('pe_codigo'),
                            S_se_codigo: S_se_codigo,
                            S_pe_codigo: S_pe_codigo,
                            S_mn_codigo: S_mn_codigo
                        },
                        success: function(response){                            
                            var text = Ext.decode(response.responseText);                            
                            var s = text.success;
                            
                            if (s) {
                                Ext.Msg.show({  
                                    title: 'Confirmación', //<- el título del diálogo  
                                    msg: text.message.reason, //<- El mensaje  
                                    buttons: Ext.Msg.OK, //<- Botones de SI  
                                    icon: Ext.Msg.INFO, // <- un ícono de error  
                                    fn: function() { 
                                        box.hide();
                                        store.load();                            
                                    }
                                }); 
                            } else {
                                box.hide();
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
                            
                            box.hide();
                            
                            Ext.Msg.show({  
                                title: 'Mensaje del Sistema', //<- el título del diálogo  
                                msg: text, //<- El mensaje  
                                buttons: Ext.Msg.OK, //<- Botones de SI  
                                icon: Ext.Msg.ERROR // <- un ícono de error                               
                            });  
                        }
                    });
                }
            });
        }
    },
    
    onAction: function(view,cell,row,col,e) {
        var me = this,
        grid = me.getList()                
        grid.getView().select(row);
       
        var m = e.getTarget().className.match(/\bicon-(\w+)\b/);                
        
        if(m){
            switch(m[1]){                
                case 'pencil':
                    this.editar();
                    break;    
                case 'cross':
                    this.eliminar();
                    break;
            }
        }        
    },
    
    keypress: function(field, e) {
        if (e.getCharCode() == e.ENTER) {            
            switch(field.name) {
                case 'pe_desc':
                    Ext.getCmp('cmdGrabar').focus()
                    break;
            }
        }
    },
    
    keypressEdit: function(field, e) {
        if (e.getCharCode() == e.ENTER) {            
            switch(field.name) {
                case 'pe_desc':
                    Ext.getCmp('pe_estado').focus()
                    break;
                case 'pe_estado':
                    Ext.getCmp('cmdGrabar').focus()
                    break;
            }
        }
    }

});
