Ext.define('Usuarios.controller.Usuarios', {
    extend: 'Ext.app.Controller',
   
    models: ['Usuario'],
    stores: ['Usuarios', 'Perfiles'],
    views: ['UsMain', 'Window', 'UsNuevo', 'UsEdit'],
    requires: ['Ext.MessageBox'],
   
    refs: [
    {
        ref: 'list',
        selector: 'usmain'
    }
    ],
   
    init: function() {
        tipo = '';
        cambioClave = 'N';
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'side';
        
        this.getStore('Usuarios').load(function(records, operation, success, response) {
            //var json = Ext.decode(response.responseText);
            //alert(json); 
            if(!success) {
                Ext.Msg.alert("Failed",operation.request.scope.reader.jsonData["message"]);
            }         
        });
        
        this.control({
            'usmain': {
                itemdblclick: this.editar
            },            
            
            'usmain button[action=nuevo]': {
                click: this.nuevo
            },                        
            
            'usmain actioncolumn': {
                click:  this.onAction
            },
            
            'usnuevo button[action=grabar]': {
                click: this.grabar
            },
            
            'usnuevo checkbox[id="es_vendedor"]': {
                change: this.seleccionarVendedor
            },      
            
            'usedit checkbox[id="us_es_ven"]': {
                change: this.modificarVendedor
            },
            
            //            'usnuevo textfield[name="us_nombres"]': {                
            //                afterrender: this.afterrender               
            //            },
            
            'usnuevo textfield': {                
                keypress: this.keypress                
            },
            
            'usedit textfield': {                
                keypress: this.keypressEdit                
            },
            
            //            'usedit fieldset textfield': {                
            //                keypress: this.keypressEdit                
            //            },
            
            'usedit button[action=grabar]': {
                click: this.grabar
            },
            
            'usedit fieldset': {
                //this.expan;
                expand: this.ex,
                collapse: this.col
            }
        });
    },
    
    nuevo: function() {        
        tipo = 'N';        
        var me = this,
        view = Ext.widget('windownuevo');
        
        storeP = this.getStore('Perfiles');
        Ext.getCmp('pe_codigo').setValue(storeP.getAt('0').get('pe_codigo'))

        view.setTitle('Nuevo Usuario');
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
            
                //alert(record.get('pe_codigo'));
                //storeP = this.getStore('Perfiles'),
            
                //storeP.find('pe_codigo', record.get('pe_codigo'));
            
                //storeP.setValue('')
            
            
            
                form.loadRecord(record);
                Ext.getCmp('cci_cliprov_e').setValue(Ext.getCmp('cci_vendedor').getValue());
                if (Ext.getCmp('us_es_ven').getValue() == false) {
                    Ext.getCmp('aux').setValue('S');                    
                }
            
                //storeP = this.getStore('Perfiles');
                //Ext.getCmp('pe_codigo').setValue(storeP.getAt('0').get('pe_codigo'));
                //alert(record.get('pe_codigo'));
                //valor = 2;
                Ext.getCmp('pe_codigo').setValue(record.get('pe_codigo'));
                Ext.getCmp('us_estado').setValue(record.get('us_estado'));
            
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
    
    grabar: function(btn) {
        if (tipo == 'N') {
            this.grabarNuevoRegistro(btn);
        } else {            
            this.actualizarRegistro(btn);
        }
    },
    
    grabarNuevoRegistro: function(btn) {
        var me = this,
        form = btn.up('usnuevo'),
        win = form.up('window'),
        store = this.getStore('Usuarios'),
        basicForm = form.getForm();     
        
        var S_se_codigo = Ext.get("S_se_codigo").dom.value;                                                                        
        var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
        var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
        var S_us_codigo = Ext.get("S_us_codigo").dom.value;
        
        
        if(basicForm.isValid()) {
            if (Ext.util.Format.trim(Ext.getCmp('us_pass').getValue()).length>15 || Ext.util.Format.trim(Ext.getCmp('us_pass2').getValue()).length>15) {
                Ext.Msg.show({  
                    title: 'Mensaje del Sistema', //<- el título del diálogo                       
                    msg: 'Atencion: La clave no puede ser mayor de 15 caracteres', //<- El mensaje
                    buttons: Ext.Msg.OK, //<- Botones de SI  
                    icon: Ext.Msg.ERROR // <- un ícono de error                           
                });
                
                return;               
            }
            
            if (Ext.getCmp('us_pass').getValue() == Ext.getCmp('us_pass2').getValue()) {
                Ext.getCmp('us_pass').setValue(md5(Ext.getCmp('us_pass').getValue()));
                Ext.getCmp('us_pass2').setValue(md5(Ext.getCmp('us_pass2').getValue())); 
                
                //////////////////////////////////////////////
                var box = Ext.MessageBox.wait('Por favor espere mientras se graba el usario', 'Enviando');
                Ext.Ajax.request({
                    url: 'app/data/Usuarios.php',
                    method: 'POST',
                    params: {
                        action: 'verificarLogin',                                
                        us_login: Ext.getCmp('us_login').getValue(),
                        S_se_codigo: S_se_codigo,
                        S_pe_codigo: S_pe_codigo,
                        S_mn_codigo: S_mn_codigo                        
                    },
                    success: function(response){                              
                            
                        var text = Ext.decode(response.responseText);                            
                        var s = text.success;
                            
                        if (s) {
                            
                            if (text.data[0]['contador'] == 0) {
                                basicForm.submit({
                                    url: 'app/data/Usuarios.php',
                                    method: 'POST',
                                    params: {
                                        action : 'guardar',
                                        S_se_codigo: S_se_codigo,
                                        S_pe_codigo: S_pe_codigo,
                                        S_mn_codigo: S_mn_codigo,
                                        S_us_codigo: S_us_codigo
                                    },
                                    success: function(basicForm, action) {                                                
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
                                        Ext.Msg.show({  
                                            title: 'Mensaje del Sistema', //<- el título del diálogo  
                                            msg: action.result.message.reason, //<- El mensaje  
                                            buttons: Ext.Msg.OK, //<- Botones de SI  
                                            icon: Ext.Msg.ERROR, // <- un ícono de error   
                                            fn: function() {
                                                win.close();      
                                                box.hide();
                                            }
                                        });                     
                                    }
                                });
                            } else {
                                Ext.Msg.show({  
                                    title: 'Mensaje', //<- el título del diálogo  
                                    msg: 'El Login ya se encuentra ingresado', //<- El mensaje  
                                    buttons: Ext.Msg.OK, //<- Botones de SI  
                                    icon: Ext.Msg.ERROR, // <- un ícono de error  
                                    fn: function() {                                    
                                    //                                        Ext.getCmp('us_login').focus();
                                    }
                                }); 
                            }

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
            }else {
                Ext.Msg.show({  
                    title: 'Mensaje del Sistema', //<- el título del diálogo  
                    msg: 'Las contraseñas no coinciden, revise', //<- El mensaje  
                    buttons: Ext.Msg.OK, //<- Botones de SI  
                    icon: Ext.Msg.ERROR // <- un ícono de error                               
                }); 
            }                                    
        } else {
            Ext.Msg.show({  
                title: 'Mensaje del Sistema', //<- el título del diálogo  
                msg: 'Debe llenar los campos obligatorios..', //<- El mensaje  
                buttons: Ext.Msg.OK, //<- Botones de SI  
                icon: Ext.Msg.ERROR, // <- un ícono de error                               
                fn: function() {
                //                    Ext.getCmp('us_nombres').focus();                           
                }
            });                          
        }  
    },
    
    actualizarRegistro: function(btn) {
        var win = btn.up('window'),
        //form   = win.down('form')
        form2 = win.down('form').getForm();
        
        var me = this,
        grid = me.getList(),
        store = grid.getStore();
        var errorClave = 'N';
        var msg = 'Debe llenar los campos obligatorios';
        
        var S_se_codigo = Ext.get("S_se_codigo").dom.value;                                                                        
        var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
        var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
        var S_us_codigo = Ext.get("S_us_codigo").dom.value;
        
        if (cambioClave == 'S') {
            if (Ext.util.Format.trim(Ext.getCmp('us_passe1').getValue()).length==0 || Ext.util.Format.trim(Ext.getCmp('us_passe2').getValue()).length==0) {
                errorClave = 'S';
                msg = 'La clave esta vacia';
            } else if(Ext.getCmp('us_passe1').getValue() != Ext.getCmp('us_passe2').getValue()) {
                errorClave = 'S';
                msg = 'Las claves no coinciden';
            } else if (Ext.util.Format.trim(Ext.getCmp('us_passe1').getValue()).length>15 || Ext.util.Format.trim(Ext.getCmp('us_passe2').getValue()).length>15) {
                errorClave = 'S';
                msg = 'Atencion: La clave no puede ser mayor de 15 caracteres';                
            }
        } else {
            errorClave = 'N';
        }
                
        if ((form2.isValid()) && (errorClave == 'N')) { 
            Ext.getCmp('us_passe1').setValue(md5(Ext.getCmp('us_passe1').getValue()));
            Ext.getCmp('us_passe2').setValue(md5(Ext.getCmp('us_passe2').getValue())); 
            
            var box = Ext.MessageBox.wait('Por favor espere mientras se actualiza el usario', 'Enviando');
            
            form2.submit({
                url: 'app/data/Usuarios.php',
                method: 'POST',
                params: {
                    action : 'actualizar',
                    cambioClave: cambioClave,
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
                            win.close();        
                            box.hide();
                        }
                    });                
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
                
    //        win.close();
    },
    
    eliminar: function() {
        var store = this.getStore('Usuarios');
        var me = this,
        grid = me.getList(),
        records = grid.getSelectionModel().getSelection();
        
        var S_se_codigo = Ext.get("S_se_codigo").dom.value;                                                                        
        var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
        var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
        var S_us_codigo = Ext.get("S_us_codigo").dom.value;
        
        if(records.length === 1){
            var record = records[0]            
            Ext.Msg.confirm('Mensaje del Sistema', 'Desea eliminar el Registro', function(btn) {
                if (btn == 'yes') {  
                    var box = Ext.MessageBox.wait('Por favor espere mientras se elimina el usario', 'Enviando');
                    
                    Ext.Ajax.request({
                        url: 'app/data/Usuarios.php',
                        method: 'POST',
                        params: {
                            action: 'eliminar',                                
                            us_codigo: record.get('us_codigo'),
                            S_se_codigo: S_se_codigo,
                            S_pe_codigo: S_pe_codigo,
                            S_mn_codigo: S_mn_codigo,
                            S_us_codigo: S_us_codigo
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
                                        store.load();    
                                        box.hide();
                                    }
                                }); 
                            } else {                                                                
                                Ext.Msg.show({  
                                    title: 'Mensaje del Sistema: ERROR ', //<- el título del diálogo  
                                    msg: text.message.reason, //<- El mensaje  
                                    buttons: Ext.Msg.OK, //<- Botones de SI  
                                    icon: Ext.Msg.ERROR, // <- un ícono de error                               
                                    fn: function() {
                                        box.hide();
                                    }
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

    ex: function(expanded) {                     
        cambioClave = 'S';
    },
    
    col: function(expanded) {        
        cambioClave = 'N';
    },
    
    keypress: function(field, e) {
        if (e.getCharCode() == e.ENTER) {            
            switch(field.name) {
                case 'us_nombres':
                    Ext.getCmp('us_apellidos').focus()
                    break;
                case 'us_apellidos':
                    Ext.getCmp('us_login').focus()
                    break;
                case 'us_login':
                    Ext.getCmp('pe_codigo').focus()
                    break;
                case 'pe_codigo':
                    Ext.getCmp('us_email').focus()
                    break;
                case 'us_email':
                    Ext.getCmp('us_pass').focus()
                    break;
                case 'us_pass':
                    Ext.getCmp('us_pass2').focus()
                    break;
                case 'us_pass2':
                    Ext.getCmp('cmdGrabar').focus()
                    break;
            }
        }
    },
    
    keypressEdit: function(field, e) {        
        if (e.getCharCode() == e.ENTER) {            
            switch(field.name) {
                case 'us_nombres':
                    Ext.getCmp('us_apellidos').focus()
                    break;
                case 'us_apellidos':
                    Ext.getCmp('us_login').focus()
                    break;
                case 'us_login':
                    Ext.getCmp('pe_codigo').focus()
                    break;
                case 'pe_codigo':
                    Ext.getCmp('us_email').focus()
                    break;
                case 'us_email':
                    Ext.getCmp('us_estado').focus()
                    break;
                case 'us_estado':
                    Ext.getCmp('cmdGrabar').focus()
                    break;                                        
                case 'us_passe1':
                    Ext.getCmp('us_passe2').focus()
                    break;
                case 'us_passe2':
                    Ext.getCmp('cmdGrabar').focus()
                    break;
            }
        }
    },
    
    seleccionarVendedor: function( checkbox, newValue, oldValue, eOpts ) {        
        Ext.getCmp('cci_cliprov').setValue('0');
        
        if (newValue) {
            var store = Ext.create('Usuarios.store.TB_GEN_CLIPROV');
            store.load();
        
            Ext.create('Ext.window.Window', {
                title: 'Busqueda de Vendedores',
                height: 450,
                width: 750,
                layout: 'fit',
                modal: true,
                closable: false,
                listeners: {                    
                    activate: function() {                        
                        Ext.getCmp('searchField').focus(true, 100);
                    }
                },
                dockedItems: [        
                {
                    xtype: 'searchfield',
                    height: 30,
                    id: 'searchField',
                    //fieldLabel: 'Cliente',
                    styleHtmlContent: true,
                    width: '90%',
                    fieldLabel: 'Nombre Cliente',
                    //store: Ext.create('Pedidos.store.TB_INV_ITEM'),
                    store: store,
                    paramName: 'filtro',
                    listeners: {                        
                        specialkey: function(f, e ) {
                            if (e.getKey() == e.ENTER) {                                                                
                                Ext.getCmp('grdBusqueda').getView().focus();
                                Ext.getCmp('grdBusqueda').getSelectionModel().select(0);
                            }
                        }
                    }
                },
                {
                    xtype: 'pagingtoolbar',
                    store: store,
                    dock: 'bottom',
                    displayInfo: true
                }                
                ],
                items: {  // Let's put an empty grid in just to illustrate fit layout
                    xtype: 'grid',
                    id: 'grdBusqueda',
                    border: false,
                    features: Ext.create('Ext.ux.grid.FiltersFeature', {
                        ftype: 'filters',
                        // encode and local configuration options defined previously for easier reuse
                        //encode: encode, // json encode the filter query
                        //local: local,   // defaults to false (remote filtering)

                        // Filters are most naturally placed in the column definition, but can also be
                        // added here.
                        filters: [{
                            type: 'boolean',
                            dataIndex: 'visible'
                        }]
                    }),
                    store: store,
                    viewConfig:{
                        listeners:{
                            itemkeydown:function(view, record, item, index, e){
                                //alert('The press key is' + e.getKey());
                                if (e.getKey() == e.ENTER) {
                                    this.up('window').close();                                
                        
                                    Ext.getCmp('us_nombres').setValue(record.get('CNO_CLIPROV'));
                                    Ext.getCmp('cci_cliprov').setValue(record.get('CCI_CLIPROV'));
                                }
                            }
                        }
                    },                    
                    columns: [
                    {
                        header: 'Codigo', 
                        dataIndex: 'CCI_CLIPROV', 
                        width: 100, 
                        filter: true
                    },

                    {
                        header: 'Nombre', 
                        dataIndex: 'CNO_CLIPROV', 
                        width: 350, 
                        filter: true
                    },

                    {
                        header: 'Ruc', 
                        dataIndex: 'CCI_RUC', 
                        width: 150, 
                        filter: true
                    }
                    ],
                    listeners: {
                        beforeitemdblclick: {                    
                            fn: function(view, record, item, index, e, eOpts){
                        
                                this.up('window').close();                                
                        
                                Ext.getCmp('us_nombres').setValue(record.get('CNO_CLIPROV'));
                                Ext.getCmp('cci_cliprov').setValue(record.get('CCI_CLIPROV'));                                                     
                            }                                        
                        },
                        afterrender: function(field) {
                            field.focus(false, 100);
                        },
                        specialkey: function(f, e ) {
                            if (e.getKey() == e.ENTER) {
                                alert('kuassss');
                            //Ext.getCmp('grdBusqueda').getSelectionModel().select(0);
                            }
                        }
                    }
                }
            }).show();
        }
    },
    
    modificarVendedor: function(checkbox, newValue, oldValue, eOpts) {
        if (Ext.getCmp('aux').getValue() == 'N') {
            Ext.getCmp('aux').setValue('S')        
        } else {
            if (newValue) {                
                if (Ext.getCmp('cci_vendedor').getValue() == 0) {                
                    var store = Ext.create('Usuarios.store.TB_GEN_CLIPROV');
                    store.load();
        
                    Ext.create('Ext.window.Window', {
                        title: 'Busqueda de Vendedores',
                        height: 450,
                        width: 750,
                        layout: 'fit',
                        modal: true,
                        closable: false,
                        listeners: {                    
                            activate: function() {                        
                                Ext.getCmp('searchField').focus(true, 100);
                            }
                        },
                        dockedItems: [        
                        {
                            xtype: 'searchfield',
                            height: 30,
                            id: 'searchField',
                            //fieldLabel: 'Cliente',
                            styleHtmlContent: true,
                            width: '90%',
                            fieldLabel: 'Nombre Cliente',
                            //store: Ext.create('Pedidos.store.TB_INV_ITEM'),
                            store: store,
                            paramName: 'filtro',
                            listeners: {                        
                                specialkey: function(f, e ) {
                                    if (e.getKey() == e.ENTER) {                                                                
                                        Ext.getCmp('grdBusqueda').getView().focus();
                                        Ext.getCmp('grdBusqueda').getSelectionModel().select(0);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'pagingtoolbar',
                            store: store,
                            dock: 'bottom',
                            displayInfo: true
                        }                
                        ],
                        items: {  // Let's put an empty grid in just to illustrate fit layout
                            xtype: 'grid',
                            id: 'grdBusqueda',
                            border: false,
                            features: Ext.create('Ext.ux.grid.FiltersFeature', {
                                ftype: 'filters',
                                // encode and local configuration options defined previously for easier reuse
                                //encode: encode, // json encode the filter query
                                //local: local,   // defaults to false (remote filtering)

                                // Filters are most naturally placed in the column definition, but can also be
                                // added here.
                                filters: [{
                                    type: 'boolean',
                                    dataIndex: 'visible'
                                }]
                            }),
                            store: store,
                            viewConfig:{
                                listeners:{
                                    itemkeydown:function(view, record, item, index, e){
                                        //alert('The press key is' + e.getKey());
                                        if (e.getKey() == e.ENTER) {
                                            this.up('window').close();                                
                        
                                            //Ext.getCmp('us_nombres').setValue(record.get('CNO_CLIPROV'));
                                            Ext.getCmp('cci_cliprov_e').setValue(record.get('CCI_CLIPROV'));
                                        }
                                    }
                                }
                            },                    
                            columns: [
                            {
                                header: 'Codigo', 
                                dataIndex: 'CCI_CLIPROV', 
                                width: 100, 
                                filter: true
                            },

                            {
                                header: 'Nombre', 
                                dataIndex: 'CNO_CLIPROV', 
                                width: 350, 
                                filter: true
                            },

                            {
                                header: 'Ruc', 
                                dataIndex: 'CCI_RUC', 
                                width: 150, 
                                filter: true
                            }
                            ],
                            listeners: {
                                beforeitemdblclick: {                    
                                    fn: function(view, record, item, index, e, eOpts){                        
                                        this.up('window').close();                                                                                            
                                        Ext.getCmp('cci_cliprov_e').setValue(record.get('CCI_CLIPROV'));                                                     
                                    }                                        
                                },
                                afterrender: function(field) {
                                    field.focus(false, 100);
                                },
                                specialkey: function(f, e ) {
                                    if (e.getKey() == e.ENTER) {
                                    //alert('kuassss');
                                    //Ext.getCmp('grdBusqueda').getSelectionModel().select(0);
                                    }
                                }
                            }
                        }
                    }).show();
                } else {
                    Ext.getCmp('cci_cliprov_e').setValue(Ext.getCmp('cci_vendedor').getValue());
                }
            } else {
            //                Ext.getCmp('cci_cliprov_e').setValue(0);
            }
        }
    }
});
