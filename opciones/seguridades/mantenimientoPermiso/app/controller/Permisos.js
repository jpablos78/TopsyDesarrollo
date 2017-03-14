function listNodes(childNodes, checked, col) {
    Ext.each(childNodes, function(node){         
        console.log(node.internalId);
        console.log(node.id);
        console.log(node.data.mn_nombre);
        console.log(checked);
                    

                if (!node.leaf) {                        
                    listNodes(node.childNodes, checked, col);  
            node.set(col, checked);
            node.commit();
                }
     
        });
}

function parentNodes(childNodes, checked, col) {
    if (checked) {
        Ext.each(childNodes, function(node){         
            console.log(node.internalId);
            console.log(node.id);
            console.log(node.data.mn_nombre);
            console.log(checked);
        
            //        alert(node.data.mn_nombre);
                    

                    if (!node.leaf) {                        
                        parentNodes(node.parentNode, checked, col);  
                node.set(col, checked);
                node.commit();
                    }
         
            });
    }
}

function listNodes2(childNodes) {                               
    Ext.each(childNodes, function(node){
         
        padre = node.parentNode.data.mn_codigo                                                                  
                              
        menu.push(Ext.apply({
            id: node.id
        }, node.data));        
                                   
        if (!node.leaf) {                                                 
            listNodes2(node.childNodes);
        }
 
    });                                                                                                
}

Ext.define('Permisos.controller.Permisos', {
    extend: 'Ext.app.Controller',
   
    //models: ['Usuario'],
    stores: ['Perfiles', 'Permisos'],
    views: ['PmMain'],//, 'PerNuevo', 'PerEdit'],
    requires: ['Ext.MessageBox'],
   
    refs: [
    {
        ref: 'list',
        selector: 'pmmain'
    }
    ],
    
    init: function() {
        
        function listNodes(childNodes) {
            Ext.each(childNodes, function(node){
                 
                        //faz alguma coisa
                        console.log(node.internalId);
                 
                        //explora os filhos do Node - se tiver algum
                        if (!node.leaf) {
                     
                                listNodes(node.childNodes);
                        }
             
                });
        }
        
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
            'pmmain combobox': {
                change:  this.onAction                
            },
            'pmmain button[action=actualizar]': {
                click:  this.actualizar                
            },
            
            'pmmain': {
                cellclick: function( cell, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                //alert('...');
                }
            },
            'pmmain checkcolumn': {
                cellclick: function( cell, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                //alert('...ee');
                },
                checkchange: this.check1
            }
        });
    },
    
    onAction: function() {         
        this.getStore('Permisos').load({
            params:{
                pe_codigo: Ext.getCmp('pe_codigo').getValue()
            }
        });        
    },
            
    actualizar: function(btn) {               
        var store = this.getStore('Permisos');        
        
        menu = [];
        listNodes2(this.getStore('Permisos').getRootNode().childNodes);
        menu = Ext.encode(menu);
        
        var S_se_codigo = Ext.get("S_se_codigo").dom.value;                                                                        
        var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
        var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
        var S_us_codigo = Ext.get("S_us_codigo").dom.value;
        
        if(Ext.getCmp('pe_codigo').isValid()) {
            if(!Ext.isEmpty(menu)){
                var box = Ext.MessageBox.wait('Por favor espere mientras se actualiza el registro', 'Enviando');
                
                Ext.Ajax.request({
                    url: 'app/data/Permisos.php',
                    method: 'POST',
                    params: {
                        action: 'actualizar',                                
                        store: menu,
                        pe_codigo: Ext.getCmp('pe_codigo').getValue(),
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
                                    box.hide();
                                    store.load({
                                        params:{
                                            pe_codigo: Ext.getCmp('pe_codigo').getValue()
                                        }
                                    });                         
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
            } else {
                Ext.Msg.show({  
                    title: 'Mensaje del Sistema', //<- el título del diálogo  
                    msg: 'No se ha modificado ningun registro', //<- El mensaje  
                    buttons: Ext.Msg.OK, //<- Botones de SI  
                    icon: Ext.Msg.ERROR // <- un ícono de error                               
                }); 
            }
        } else {
            Ext.Msg.show({  
                title: 'Mensaje del Sistema', //<- el título del diálogo  
                msg: 'No se ha seleccionado ningun Perfil', //<- El mensaje  
                buttons: Ext.Msg.OK, //<- Botones de SI  
                icon: Ext.Msg.ERROR // <- un ícono de error                               
            }); 
        }
    },

    check1: function( col, rowIndex, checked, eOpts  ) {
        //alert('f');
        var modified = this.getStore('Permisos')//.getModifiedRecords();        
        var modified2 = this.getStore('Permisos').getModifiedRecords();
                
        Ext.each(modified2, function(record){
            //alert(record.parentNode)
            parentNodes(record.parentNode, checked, col.id);
            listNodes(record.childNodes, checked, col.id);
            record.commit();
        });        
    }//,
});
