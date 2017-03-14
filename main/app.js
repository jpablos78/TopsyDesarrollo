Ext.Loader.setConfig({
    enable: true 
});

Ext.application({
    name: 'Main',
    appFolder: 'app',
    controllers: [],
    
    launch: function() {        
        Ext.EventManager.addListener(Ext.getBody(), 'keydown', function(e){
            if(e.getTarget().type != 'text' && e.getKey() == '8' ){
                e.preventDefault();
            }
        });
        
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'side';
        
        //alert('bye bye');
        //return;
        
        //        var usuario = '<?php echo $usuario ?>';
        //        var perfil = '<?php echo $perfil ?>';
        //var emailField = Ext.get("field1");
        //        var email = emailField.dom.value;
        //var login = Ext.get("login").dom.value;
        var S_us_codigo = Ext.get("S_us_codigo").dom.value;
        var usuario = Ext.get("usuario").dom.value;
        var perfil = Ext.get("perfil").dom.value;
        var S_se_codigo = Ext.get("S_se_codigo").dom.value;
        //        var xxx = Ext.get("xxx").dom.value;
        
        //        alert(xxx);
        
        //        Ext.define('model', {
        //            extend: 'Ext.data.Model',
        //            fields: [
        //            {
        //                name: 'id', 
        //                type: 'int'
        //            },
        //
        //            {
        //                name: 'idMenuPadre', 
        //                type: 'int'
        //            },
        //
        //            {
        //                name: 'text', 
        //                type: 'string'
        //            },
        //
        //            {
        //                name: 'iconCls',  
        //                type: 'string'
        //            }, 
        //
        //            {
        //                name: 'ruta',  
        //                type: 'string'
        //            },
        //
        //            {
        //                name: 'leaf'
        //            },
        //            ]
        //        });

        Ext.define('model', {
            extend: 'Ext.data.Model',
            fields: [
            {
                name: 'mn_codigo', 
                type: 'int'
            },

            {
                name: 'mn_cod_padre', 
                type: 'int'
            },

            {
                name: 'text', 
                type: 'string'
            },

            {
                name: 'iconCls',  
                type: 'string'
            }, 

            {
                name: 'ruta',  
                type: 'string'
            },

            {
                name: 'leaf'
            },
            ]
        });
        
        var store3 = Ext.create('Ext.data.TreeStore', {
            model: model,
            proxy: {
                type: 'ajax',
                url: "app/data/main.php?action=listarAll&us_codigo=" + S_us_codigo
            },
            root: {
                text: 'Sistema', 
                expanded: true
            }
        });       
        
        var storeFavoritos = Ext.create('Ext.data.TreeStore', {
            model: model,
            proxy: {
                type: 'ajax',
                url: "app/data/main.php?action=listarAllF&us_codigo=" + S_us_codigo
            },
            root: {
                text: 'Sistema', 
                expanded: true
            }
        });
        
        var contextMenu = Ext.create('Ext.menu.Menu', {
            height: 100,
            width: 125,
            defaults: {
                listeners: {
                    click: function(item) {
                        switch(item.itemId) {
                            case 'actualizar':
                                Ext.getCmp('treeOpciones').getStore().load();
                                break;
                        }
                    }
                }  
            },
            items: [
            {
                text: 'Actualizar',
                itemId: 'actualizar',
                iconCls: 'icon-reload'
            }
            ]
        });
        
        var contextMenuFavoritos = Ext.create('Ext.menu.Menu', {
            height: 100,
            width: 125,
            defaults: {
                listeners: {
                    click: function(item) {
                        switch(item.itemId) {
                            case 'actualizar':
                                Ext.getCmp('treeFavoritos').getStore().load();
                                break;
                        }
                    }
                }  
            },
            items: [
            {
                text: 'Actualizar',
                itemId: 'actualizar',
                iconCls: 'icon-reload'
            }
            ]
        });
        
        var westPanel = Ext.create('Ext.panel.Panel', {
            //title: 'Menu de Opciones',
            //            region : 'west',
            //            width : 200,
            //            margins : '0 2 0 0',
            //            collapsible: true,
            //            rootVisible : false,
            region: 'west',
            stateId: 'navigation-panel',
            id: 'west-panel', // see Ext.getCmp() below
            //title: 'West',
            //split: true,
            width: 150,
            minWidth: 150,
            maxWidth: 400,
            //collapsible: true,
            //animCollapse: true,
            //            margins: '0 0 0 5',
            margins: '0 2 0 0',
            //layout: 'fit',
            layout: {
                type: 'accordion'
            },                    
            items: [
            {
                xtype: 'treepanel',
                title: 'Panel de Favoritos',
                store : storeFavoritos,  
                id: 'treeFavoritos',
                iconCls: 'icon-favoritos',
                listeners : {
                    itemclick : function(tree, record, item, index, e, options) {
                        var ruta = record.data.ruta;
                        var S_mn_codigo = record.data.mn_codigo;
                                                                        
                        if (record.data.leaf) {
                
                            var nodeText = record.data.text;
                
                            //var tabPanel = viewport.items.get(2);
                            
                            tabPanel = Ext.getCmp('tabpanelmain') 
                            //alert('whit id');
                            
                            var tabBar = tabPanel.getTabBar();
                
                            for ( var i = 0; i < tabBar.items.length; i++) {
                                if (tabBar.items.get(i).getText() === nodeText) {
                                    var tabIndex = i;
                                }
                            }
                            
                            //                            idTab = 'tab-' + tabIndex;
                            var idTab = record.data.text
                
                            if (Ext.isEmpty(tabIndex)) {
                                tabPanel.add({
                                    id: idTab,
                                    title : record.data.text,
                                    bodyPadding : 10,
                                    html: '<iframe id="frame-welcome" src="' + ruta + "?S_se_codigo=" + S_se_codigo + "&S_mn_codigo=" + S_mn_codigo + "&S_tabPanel=" + tabPanel + '" border="0" width="100%" height="100%" style="border:0"></iframe>',
                                    iconCls: record.data.iconCls,
                                    tooltip : record.data.qtip,
                                    closable: true,
                                    layout: 'fit'
                                //                                    items: [
                                //                                    {
                                //                                        xtype: 'window',
                                //                                        title: 'Hellowww',
                                ////                                        height: 600,
                                ////                                        width: 800,
                                //                                        closable: true,
                                //                                        layout: 'fit',
                                //                                        autoShow: true,
                                //                                        items: {  // Let's put an empty grid in just to illustrate fit layout
                                //                                            html: '<iframe id="frame-welcome" src="' + ruta + "?S_se_codigo=" + S_se_codigo + "&S_mn_codigo=" + S_mn_codigo + "&S_tabPanel=" + tabPanel + '" border="0" width="100%" height="100%" style="border:0"></iframe>'
                                //                                        }, 
                                //                                        listeners : {
                                //                                            close: function( panel, eOpts ){
                                //                                                //alert('cerrando');
                                //                                                var tab = Ext.getCmp(idTab);
                                //                                                tabPanel.remove(tab);
                                //                                            }
                                //                                        }
                                //                                    }
                                //                                    ]
                                });
                
                                tabIndex = tabPanel.items.length - 1;
                            }
                
                            tabPanel.setActiveTab(tabIndex); 
                            
                                
                        //                            var tab = tabPanel.getActiveTab();
                        //                            alert('Current tab: ' + tab.title);
                        //                            alert('Current tab: ' + tab.id);
                            
                        }
                    },
                    
                    itemcontextmenu: function(view, record, item, index, e){
                        e.stopEvent();                       
                        contextMenuFavoritos.showAt(e.getXY());
                    }
                }
            },
            {
                xtype: 'treepanel',
                title: 'Panel de Opciones',
                store : store3, 
                id: 'treeOpciones',
                iconCls: 'icon-opciones',
                rootVisible: false,
                listeners : {
                    itemclick : function(tree, record, item, index, e, options) {
                                    
                        if (record.data.leaf) {
                
                            var nodeText = record.data.text;
                
                            //                            var tabPanel = viewport.items.get(2);
                            var tabPanel = Ext.getCmp('tabpanelmain')
                            var tabBar = tabPanel.getTabBar();
                            var ruta = record.data.ruta;
                            
                            var S_mn_codigo = record.data.mn_codigo;                                                    
                
                            for ( var i = 0; i < tabBar.items.length; i++) {
                                if (tabBar.items.get(i).getText() === nodeText) {
                                    var tabIndex = i;
                                }
                            }
                                                                                           
                            if (Ext.isEmpty(tabIndex)) {
                                tabPanel.add({
                                    title : record.data.text,
                                    bodyPadding : 10,

                                    html: '<iframe id="frame-welcome" src="' + ruta + "?S_se_codigo=" + S_se_codigo + "&S_mn_codigo=" + S_mn_codigo + '" border="0" width="100%" height="100%" style="border:0"></iframe>',
                                    iconCls: record.data.iconCls,
                                    tooltip : record.data.qtip,
                                    closable: true
                                });
                
                                tabIndex = tabPanel.items.length - 1;
                            }
                
                            tabPanel.setActiveTab(tabIndex);
                                    
                        } 
                    //                        else if(record.isExpanded()){
                    //                            record.collapse();
                    //                        } else {
                    //                            record.expand();
                    //                        }
                    },
                    
                    itemcontextmenu: function(view, record, item, index, e){
                        e.stopEvent();                       
                        contextMenu.showAt(e.getXY());
                    }                    
                }
            }
            ]
        });
        
        
        var southPanel = Ext.create('Ext.panel.Panel', {
            region : 'south',
            //title: 'Panel',
            dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: [              
                {
                    text: 'Cerrar Sesion',
                    iconCls: 'icon-stop',
                    action: 'save',
                    handler: function() {
                        var S_se_codigo = Ext.get("S_se_codigo").dom.value;
                        
                        Ext.MessageBox.confirm('Pregunta', 'Esta seguro de que desea cerrar la sesion?', function(btn) {
                            if (btn == 'yes') {
                                Ext.Ajax.request({
                                    url: 'app/data/main.php',
                                    method: 'POST',
                                    params: {
                                        action: 'cerrarSesionActual',                                        
                                        se_codigo: S_se_codigo
                                    },
                                    success: function(response){ 
                                                                                                                                                            
                                        var text = Ext.decode(response.responseText);                            
                                        var s = text.success
                                        //alert('fdfs');
                                        window.location = '../index.php';
                                                                                
                                    //                                        if (s) {                                            
                                    //                                            Ext.Msg.show({  
                                    //                                                title: 'Confirmación', //<- el título del diálogo  
                                    //                                                msg: text.message.reason, //<- El mensaje  
                                    //                                                buttons: Ext.Msg.OK, //<- Botones de SI  
                                    //                                                icon: Ext.Msg.INFO // <- un ícono de error  
                                    //                                            //                                    fn: function() {                                    
                                    //                                            //                                        store.load();                            
                                    //                                            //                                    }
                                    //                                            }); 
                                    //                                        } else {
                                    //                                            Ext.Msg.show({  
                                    //                                                title: 'Mensaje del Sistema: ERROR ', //<- el título del diálogo  
                                    //                                                msg: text.message.reason, //<- El mensaje  
                                    //                                                buttons: Ext.Msg.OK, //<- Botones de SI  
                                    //                                                icon: Ext.Msg.ERROR // <- un ícono de error                               
                                    //                                            });                                               
                                    //                                        }

                                                    
                                    //Ext.getCmp('trees').getStore().load();                                                                            
                                    },
                                    failure: function(response, options){
                                        window.location = '../index.php';
                                    //alert('fallo');                        
                                    }
                                }); 
                                
                            }
                        })
                    }
                },
                '->',
                {
                    text: 'Usuario: ' + usuario + ' -> ' + perfil,
                    iconCls: 'icon-user',
                    action: 'save',
                    tooltip: 
                    {
                        title: 'Mouse Track',
                        width: 200,
                        html: 'This tip will follow the mouse while it is over the element',
                        trackMouse: true
                    }
                                    
                },
                '->',
                {                                    
                    text: (Ext.Date.format(new Date(), 'd/m/Y')),
                    id: 'txtFecha',
                    iconCls: 'icon-calendar'                                    
                },
                '-',
                {                                    
                    text: (Ext.Date.format(new Date(), 'G:i:s')),
                    id: 'txtReloj'                                                                       
                }
                ]
            }
            ],
            listeners : {
                render: function(){                                                        
                    Ext.TaskManager.start({
                        run: function() {
                            Ext.getCmp('txtFecha').setText(Ext.Date.format(new Date(), 'd/m/Y'));
                            Ext.getCmp('txtReloj').setText(Ext.Date.format(new Date(), 'G:i:s'));                                    
                        },
                        interval: 1000
                    });                                                        
                }
            }
        });        
        
        var viewport = Ext.create('Ext.container.Viewport', {
            id: 'vwp',
            layout : 'border',
            items : [ 
//            {
//                region: 'north',                           
//                height: 65,
//                width: '100%',
//                xtype: 'container',
//                collapsible: true,
//                titleCollapse: true,
//                //title : 'Menu de Opciones',
//                layout: 'fit',
//                items: [
//                {
//                    xtype: 'panel',
//                    //height: 60,
//                    //width: '100%',
//                    frame: true,
//                    //title: 'Menu Principal',
//                    //                                    html: '<iframe id="frame-cabecera" src="http://www.google.com" border="0" width="100%" height="100%" style="border:0"></iframe>'
//                    //html:'<center><b>Inti-moda</b></center><br>Usuario: JPabloS &nbsp&nbsp&nbsp Fecha: 21/12/2012 12:12:12'
//                    //html:'<center><iframe src="../images/login/logo_sf.png" style="border:0px #FFFFFF none;" name="" scrolling="auto" frameborder="0" align=aus marginheight="0px" marginwidth="0px" height="100%" width="20%"></iframe></center>'
//                    html:'<center><iframe src="logo.php" style="border:0px #FFFFFF none;" name="" scrolling="auto" frameborder="0" align=aus marginheight="0px" marginwidth="0px" height="60px" width="100%"></iframe></center>'
//                }
//                ]
//            },
            westPanel, 
            {
                xtype : 'tabpanel',
                id: 'tabpanelmain',
                region : 'center',
                layout: 'fit'
            },
            southPanel
            ]
        });
        
        tabPanel = Ext.getCmp('tabpanelmain')
        
    }
});


