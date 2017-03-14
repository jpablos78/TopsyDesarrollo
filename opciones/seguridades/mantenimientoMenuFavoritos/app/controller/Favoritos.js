function listNodes(childNodes, checked, col) {    
    Ext.each(childNodes, function(node){        
                //faz alguma coisa
        console.log(node.internalId);
        console.log(node.id);
        console.log(node.data.nombreOpcion);
        console.log(checked);
                    
        //node.set('pr_acceso', checked);
        //node.commit();
         
                //explora os filhos do Node - se tiver algum
                if (!node.leaf) {                       
            listNodes(node.childNodes, checked, col);  
            node.set(col, checked);
            node.commit();
                }
     
        });
}

function listNodes2(childNodes) {                               
    Ext.each(childNodes, function(node){
         
        //padre = node.parentNode.data.id
                                    
        //        node.set('mn_cod_padre', padre);
        //                                    
        //        console.log(node.data.text);
        //        console.log(node.data.mn_codigo);
        //        console.log(node.data.mn_cod_padre);
        //        console.log(node.data.iconCls);
        //        //console.log(node.data.iconCls);
        //        console.log(node.data.leaf);
                                    
                              
        //            Ext.each(modified, function(record){
        //                recordsToSend.push(Ext.apply({
        //                    id: record.id
        //                }, record.data))
        //            });
                              
                              
        menu.push(Ext.apply({
            id: node.id
        }, node.data)); 
                                    
 
        //explora os filhos do Node - se tiver algum
                                   
        if (!node.leaf) {
            //                                        console.log(node.internalId);
            //                                        console.log(node.data.text);
            //                                        console.log(node.data.iconCls);
            //                                        console.log(node.data.leaf);
                                     
            //                                        menu.push(Ext.apply({
            //                                            id: node.internalId,
            //                                            mn_codigo: node.data.mn_codigo,
            //                                            children: node.data.children,
            //                                            text: node.data.text
            //                                        }, node.data.children)); 
                                     
            listNodes2(node.childNodes);
        }
 
    });
                                
/*
                                 *var menu = [];
                                            
                                            Ext.each(records, function(record){
                                                menu.push(Ext.apply({
                                                    id: record.id,
                                                    children: record.children
                                                }, record.children)); 
                                            });
                                            
                                            menu = Ext.encode(menu);
                                 *
                                 **/
                                
                                
}

Ext.define('Favoritos.controller.Favoritos', {
    extend: 'Ext.app.Controller',
       
    stores: ['Favoritos'],
    views: ['FvMain'],//, 'PerNuevo', 'PerEdit'],
    requires: ['Ext.MessageBox'],
   
    refs: [
    {
        ref: 'list',
        selector: 'fvmain'
    }
    ],
    
    init: function() {        
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'side';
        
        var S_us_codigo = Ext.get("S_us_codigo").dom.value;                                
        
        this.getStore('Favoritos').load({
            params:{
                S_us_codigo: S_us_codigo
            }
        });                
        
        this.control({
            'fvmain combobox': {
                change:  this.onAction                
            },
            'fvmain button[action=actualizar]': {
                click:  this.actualizar                
            },
            
            'fvmain': {
                cellclick: function( cell, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                //alert('...');
                }
            },
            'fvmain checkcolumn': {
                cellclick: function( cell, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                //    alert('...ee');
                },
                checkchange: this.check1
            }
        });
    },
    
    onAction: function() {         
        this.getStore('Favoritos').load({
            params:{
                idAdmPerfil: Ext.getCmp('idAdmPerfil').getValue()
            }
        });        
    },
            
    actualizar: function(btn) {               
        var store = this.getStore('Favoritos');
        var S_us_codigo = Ext.get("S_us_codigo").dom.value;                       
        var S_se_codigo = Ext.get("S_se_codigo").dom.value;                                                                        
        var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
        var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
        
        menu = [];
        listNodes2(this.getStore('Favoritos').getRootNode().childNodes);
        menu = Ext.encode(menu);
        
        if(!Ext.isEmpty(menu)){
            var box = Ext.MessageBox.wait('Por favor espere mientras se actualiza el usario', 'Enviando');
            
            Ext.Ajax.request({
                url: 'app/data/Favoritos.php',
                method: 'POST',
                params: {
                    action: 'actualizar',                                
                    store: menu,
                    S_us_codigo: S_us_codigo,
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
                                store.load({
                                    params:{
                                        S_us_codigo: S_us_codigo
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
                    box.hide();
                    var text = Ext.decode(response.responseText);
                            
                    Ext.Msg.show({  
                        title: 'Mensaje del Sistema', //<- el título del diálogo  
                        msg: text.message, //<- El mensaje  
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
    },

    check1: function( col, rowIndex, checked, eOpts  ) {                
        var modified = this.getStore('Favoritos')//.getModifiedRecords();        
        var modified2 = this.getStore('Favoritos').getModifiedRecords();                
        
        Ext.each(modified2, function(record){
            listNodes(record.childNodes, checked, col.id);
            record.commit();
        });        
    }
});
