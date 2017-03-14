<?php
session_start();

include_once '../librerias/claseGenerica.php';

//function adj_tree(&$tree, $item) {
//    $i = $item['mn_codigo'];
//    $p = $item['mn_cod_padre'];
//    $tree[$i] = isset($tree[$i]) ? $item + $tree[$i] : $item;
//
//    $tree[$p]['children'][] = &$tree[$i];
//}
//$objetoBaseDatos = new claseBaseDatos();
//$objetoBaseDatos->conectarse();
//
//$tree = array();
//
//if ($objetoBaseDatos->getErrorConexionNo()) {
//    echo $objetoBaseDatos->getErrorConexionJson();
//} else {
//    $query = "select * from wp_menu order by mn_orden";
//
//    //$result = $objetoBaseDatos->queryJson($query);
//    $result = $objetoBaseDatos->query($query);
//
//    if ($objetoBaseDatos->getError()) {
//        echo $objetoBaseDatos->getErrorJson('');
//    } else {
//        //echo $result;
//        foreach ($result as $key => $rows) {
////            echo $rows['mn_codigo'];
////            echo $rows['mn_cod_padre'];
//            $arr = array(
//                'mn_codigo' => $rows['mn_codigo'],
//                'mn_cod_padre' => $rows['mn_cod_padre'],
//                'text' => "Menu 1",
//                'iconCls' => 'icon-menu1'
//            );
//
//            adj_tree($tree, $arr);
//        }
//
//        $nodes = $tree[1];
//        $texto = json_encode($nodes);
//
//        $texto = substr($texto, 86);
//        $texto = substr($texto, 0, strlen($texto) - 1);
//
//        //echo $texto;
//    }
//}
//die();
if (!isset($_SESSION['loginOk'])) {
    header('Location:../index.php');
} elseif ($_SESSION['loginOk'] == 'SI') {
    //$usuario = $_POST['usuario'];    
    $_SESSION['loginOk'] = 'NO';
    $us_codigo = $_SESSION["us_codigoOK"];
    $usuario = "'" . $_SESSION["us_nombresOK"] . "'";
    $perfil = "'" . $_SESSION["us_perfilOK"] . "'";
    echo 'Bienvenido al sistema: ' . $us_codigo;
} else {
    header('Location:../index.php');
}
?>

<!DOCTYPE html>
<html>
    <head>
        <title>INTI-MODA</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">        
        <link rel="stylesheet" href="../extjs/resources/css/ext-all.css">
        <!--<link rel="stylesheet" href="../extjs/resources/css/ext-sandbox.css">-->
        <link rel="stylesheet" href="../css/iconos.css">
        <script type="text/javascript" src="../extjs/ext-all.js"></script>
        <script type="text/javascript" src="../extjs/locale/ext-lang-es.js"></script>
        <!--<script type="text/javascript" src="app.js"></script>-->
    </head>
    <body>
        <script>
            var usuario = <?php echo $usuario ?>;
            var perfil = <?php echo $perfil ?>;
            Ext.onReady(function() {
                Ext.QuickTips.init();
                                
                Ext.define('model', {
                    extend: 'Ext.data.Model',
                    fields: [
                        {name: 'mn_codigo', type: 'int'},
                        {name: 'mn_cod_padre', type: 'int'},
                        {name: 'text', type: 'string'},
                        {name: 'iconCls',  type: 'string'}, 
                        {name: 'ruta',  type: 'string'},
                        {name: 'leaf'},
                    ]
                });
                
                Ext.Ajax.request({
                    url: 'store.php',
                    method: 'POST',
                    params: {
                        action: 'identificarUsuario',                                                        
                        us_codigo: <?php echo $us_codigo ?>
                    },
                    success: function(response){                            
                        var text = Ext.decode(response.responseText);                            
                        var s = text.success;
                            
                        if (s) {
                            usuario = text.data[0].us_nombres_apellidos;
                            perfil = text.data[0].pe_desc;                            
                        
                            //                            Ext.Msg.show({  
                            //                                title: 'Confirmación', //<- el título del diálogo  
                            //                                msg: text.message.reason, //<- El mensaje  
                            //                                buttons: Ext.Msg.OK, //<- Botones de SI  
                            //                                icon: Ext.Msg.INFO, // <- un ícono de error  
                            //                                fn: function() {                                    
                            //                                    //                                this.getStore('Permisos').load({
                            //                                    store.load({
                            //                                        params:{
                            //                                            pe_codigo: Ext.getCmp('pe_codigo').getValue()
                            //                                        }
                            //                                    });                         
                            //                                }
                            //                            }); 
                        } else {
                            Ext.Msg.show({  
                                title: 'Mensaje del Sistema: ERROR ', //<- el título del diálogo  
                                msg: text.message, //<- El mensaje  
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

                var store3 = Ext.create('Ext.data.TreeStore', {
                    model: model,
                    proxy: {
                        type: 'ajax',
                        url: "store.php?action=listarAll&us_codigo=" + <?php echo $us_codigo ?>
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
                        url: "store.php?action=listarAllF"
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

                var store = Ext.create('Ext.data.TreeStore', {
                    root : {
                        expanded : true,
                        iconCls: 'icon-home',
                        children : [ 
                            {
                                text : "Menu 1",
                                iconCls: 'icon-menu1',
                                expanded: true,
                                children: [
                                    {
                                        text: "Submenu 1",
                                        children: [
                                            {
                                                text: 'opcion 1',
                                                leaf: true,
                                                iconCls: 'icon-opcion1',
                                                qtip: 'Esta es la opcion number 1'
                                            },
                                            {
                                                text: 'opcion 2',
                                                leaf: true,
                                                iconCls: 'icon-opcion2',
                                                qtip: 'Esta es la opcion number 2'
                                            }
                                        ]
                                    }                                    
                                ]
                            },                            
                            {
                                text : "Menu 3",
                                expanded: true,
                                iconCls: 'icon-menu3',
                                children: [
                                    {
                                        text: "opcion 3", 
                                        leaf: true, 
                                        iconCls: 'icon-opcion3',
                                        qtip: 'Esta es la opcion number 3'
                                    },
                                    {
                                        text: "opcion 4", 
                                        leaf: true, 
                                        iconCls: 'icon-opcion4',
                                        qtip: 'Esta es la opcion number 4'
                                    }
                                ]
                            }                            
                        ]
                    }                        
                });
                
                var store2 = Ext.create('Ext.data.TreeStore', {
                    root : {
                        expanded : true,
                        iconCls: 'icon-home',
                        children : [ 
                            {
                                text: 'opcion 1',
                                leaf: true,
                                iconCls: 'icon-opcion1',
                                qtip: 'Esta es la opcion number 1'
                            },
                            {
                                text: 'opcion 2',
                                leaf: true,
                                iconCls: 'icon-opcion2',
                                qtip: 'Esta es la opcion number 2'
                            },                                                                                    
                            {
                                text: "opcion 3", 
                                leaf: true,
                                iconCls: 'icon-opcion3',
                                qtip: 'Esta es la opcion number 3'
                            },
                            {
                                text : "opcion 4",
                                leaf : true,
                                iconCls: 'icon-opcion4',
                                qtip: 'Esta es la opcion number 4'
                            } 
                        ]
                    }                        
                });
                
                //                var store3 =  Ext.create('Ext.data.TreeStore', {
                //                    proxy : {
                //                        type : 'ajax',
                //                        url : '../opciones/rol-copia/MantenimientoRol/app/data/treeData.json'
                //                    }
                //                });

                //                var westPanel = Ext.create('Ext.tree.Panel', {
                //                    title : 'Menu de Opciones',
                //                    region : 'west',
                //                    margins : '0 2 0 0',
                //                    width : 200,
                //                    store : store,
                //                    collapsible: true,
                //                    rootVisible : false,
                //                    listeners : {
                //                        itemclick : function(tree, record, item, index, e, options) {
                //
                //                            var nodeText = record.data.text;
                //
                //                            var tabPanel = viewport.items.get(2);
                //                            var tabBar = tabPanel.getTabBar();
                //
                //                            for ( var i = 0; i < tabBar.items.length; i++) {
                //                                if (tabBar.items.get(i).getText() === nodeText) {
                //                                    var tabIndex = i;
                //                                }
                //                            }
                //
                //                            if (Ext.isEmpty(tabIndex)) {
                //                                tabPanel.add({
                //                                    title : record.data.text,
                //                                    bodyPadding : 10,
                //                                    html : record.data.text
                //                                });
                //
                //                                tabIndex = tabPanel.items.length - 1;
                //                            }
                //
                //                            tabPanel.setActiveTab(tabIndex);
                //                        }
                //                    }
                //                });
                
                var westPanel = Ext.create('Ext.panel.Panel', {
                    //title: 'Menu de Opciones',
                    region : 'west',
                    width : 200,
                    margins : '0 2 0 0',
                    collapsible: true,
                    rootVisible : false,
                    layout: {
                        type: 'accordion'
                    },                    
                    items: [
                        {
                            xtype: 'treepanel',
                            title: 'Panel de Favoritos',
                            store : storeFavoritos,   
                            iconCls: 'icon-favoritos',
                            listeners : {
                                itemclick : function(tree, record, item, index, e, options) {
                                    var ruta = record.data.ruta;
                                    if (record.data.leaf) {
                
                                        var nodeText = record.data.text;
                
                                        var tabPanel = viewport.items.get(2);
                                        var tabBar = tabPanel.getTabBar();
                
                                        for ( var i = 0; i < tabBar.items.length; i++) {
                                            if (tabBar.items.get(i).getText() === nodeText) {
                                                var tabIndex = i;
                                            }
                                        }
                
                                        if (Ext.isEmpty(tabIndex)) {
                                            tabPanel.add({
                                                title : record.data.text,
                                                bodyPadding : 10,
                                                //width: '100%',
                                                //height: '100%',
                                                //layout: 'fit',
                                                //html : record.data.text,
                                                //html: '<center><iframe src="../opciones/rol-copia/MantenimientoRol/index.php" style="border:0px #FFFFFF none;" name="" scrolling="auto" frameborder="0" align=aus marginheight="0px" marginwidth="0px" height="100%" width="100%"></iframe></center>',
                                                //                                            layout: {
                                                //                                                type: 'hbox',
                                                //                                                align: 'center'//,
                                                //                                                //pack: 'center'                                                
                                                //                                            },
                                                //                                            items: [
                                                //                                                {
                                                //                                                    //xtype: 'panel',
                                                //                                                    //width: '100%',
                                                //                                                    //height: '100%',
                                                //                                                    //layout: 'fit', 
                                                //                                                    //style: 'margin:0 auto;margin-top:100px;',
                                                //                                                    //border: false,
                                                ////                                                    style: {
                                                ////                                                        marginLeft: 'auto',
                                                ////                                                        marginRight: 'auto'
                                                ////                                                    },
                                                //                                                    html: '<iframe id="frame-welcome" src="../opciones/rol-copia/MantenimientoRol/index.php" border="0" width="100%" height="100%" style="border:0"></iframe>'
                                                //                                                }
                                                //                                            ],
                                                //                                            style: {
                                                //                                                marginLeft: 'auto',
                                                //                                                marginRight: 'auto'
                                                //                                            },
                                                //                                            layout: {
                                                //                                                type: 'hbox',
                                                //                                                align: 'center',
                                                //                                                pack: 'center'                                                
                                                //                                            },
                                                //                                            items: [
                                                //                                                {
                                                //                                                    xtype: 'panel',
                                                //                                                    //layout: 'fit',
                                                //                                                    border: false,
                                                //                                                    width: 600,
                                                //                                                    height: 420,
                                                //                                                    layout: {
                                                //                                                        type: 'hbox',
                                                //                                                        align: 'center',
                                                //                                                        pack: 'center'                                                
                                                //                                                    },
                                                //                                                    items: [
                                                //                                                        {
                                                //                                                            border: false,
                                                //                                                            width: '100%',
                                                //                                                            height: '100%',
                                                //                                                            html: '<iframe id="frame-welcome" src="../opciones/rol-copia/MantenimientoRol/index.php" border="0" width="100%" height="100%" style="border:0"></iframe>'
                                                //                                                        }
                                                //                                                        
                                                //                                                    ]
                                                //                                                    
                                                //                                                }
                                                //                                            ],
                                                //                                            html: '<iframe id="frame-welcome" src="../opciones/rol-copia/MantenimientoRol/index.php" border="0" width="100%" height="100%" style="border:0"></iframe>',
                                            
                                                //                                            items: [
                                                //                                                {
                                                //                                                    xtype: 'window',
                                                //                                                    title: 'Hello',
                                                //                                                    autoShow: true,
                                                //                                                    layout: 'fit',
                                                //                                                    html: '<iframe id="frame-welcome" src="../opciones/rol-copia/MantenimientoRol/index.php" border="0" width="100%" height="100%" style="border:0"></iframe>'
                                                //                                                }
                                                //                                            ],
                                            
                                                //html: '<iframe id="frame-welcome" src="../opciones/rol-copia/MantenimientoRol/index.php" border="0" width="100%" height="100%" style="border:0"></iframe>',
                                                html: '<iframe id="frame-welcome" src="' + ruta + '" border="0" width="100%" height="100%" style="border:0"></iframe>',
                                                iconCls: record.data.iconCls,
                                                tooltip : record.data.qtip,
                                                closable: true
                                                //bodyStyle: 'background:none'
                                            });
                
                                            tabIndex = tabPanel.items.length - 1;
                                        }
                
                                        tabPanel.setActiveTab(tabIndex);                                                                        
                                    }
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
                
                                        var tabPanel = viewport.items.get(2);
                                        var tabBar = tabPanel.getTabBar();
                                        var ruta = record.data.ruta;
                
                                        for ( var i = 0; i < tabBar.items.length; i++) {
                                            if (tabBar.items.get(i).getText() === nodeText) {
                                                var tabIndex = i;
                                            }
                                        }
                                                                                           
                                        if (Ext.isEmpty(tabIndex)) {
                                            tabPanel.add({
                                                title : record.data.text,
                                                bodyPadding : 10,
                                                //html : record.data.text,
                                                //html: '<center><iframe src="http://www.google.com" style="border:0px #FFFFFF none;" name="" scrolling="auto" frameborder="0" align=aus marginheight="0px" marginwidth="0px" height="60px" width="100%"></iframe></center>',
                                                html: '<iframe id="frame-welcome" src="' + ruta + '" border="0" width="100%" height="100%" style="border:0"></iframe>',
                                                iconCls: record.data.iconCls,
                                                tooltip : record.data.qtip,
                                                closable: true
                                                //                                                bodyStyle: 'background:none',
                                                //                                                layout: {
                                                //                                                    type: 'hbox',
                                                //                                                    align: 'center',
                                                //                                                    pack: 'center'
                                                //                                                },
                                                //                                                items: [
                                                //                                                    {
                                                //                                                        xtype: 'panel',
                                                //                                                        title: 'xxxx',
                                                //                                                        width: 200
                                                //                                                    }
                                                //                                                ]
                                            });
                
                                            tabIndex = tabPanel.items.length - 1;
                                        }
                
                                        tabPanel.setActiveTab(tabIndex);
                                    
                                    } else if(record.isExpanded()){
                                        record.collapse();
                                    } else {
                                        record.expand();
                                    }
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
                                        Ext.MessageBox.confirm('Pregunta', 'Esta seguro de que desea cerrar la sesion?', function(btn) {
                                            if (btn == 'yes') {
                                                window.location = '../index.php';
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
                                    iconCls: 'icon-calendario_tb'                                    
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
                
                Ext.getCmp('treeOpciones').on({
                    itemcontextmenu: function(view, record, item, index, e){
                        e.stopEvent();
                        
                        contextMenu.showAt(e.getXY());
                    }
                });

                var viewport = Ext.create('Ext.container.Viewport', {
                    layout : 'border',
                    items : [ 
                        {
                            region: 'north',                           
                            height: 65,
                            width: '100%',
                            xtype: 'container',
                            collapsible: true,
                            titleCollapse: true,
                            //title : 'Menu de Opciones',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'panel',
                                    //height: 60,
                                    //width: '100%',
                                    frame: true,
                                    //title: 'Menu Principal',
                                    //                                    html: '<iframe id="frame-cabecera" src="http://www.google.com" border="0" width="100%" height="100%" style="border:0"></iframe>'
                                    //html:'<center><b>Inti-moda</b></center><br>Usuario: JPabloS &nbsp&nbsp&nbsp Fecha: 21/12/2012 12:12:12'
                                    //html:'<center><iframe src="../images/login/logo_sf.png" style="border:0px #FFFFFF none;" name="" scrolling="auto" frameborder="0" align=aus marginheight="0px" marginwidth="0px" height="100%" width="20%"></iframe></center>'
                                    html:'<center><iframe src="../logo.php" style="border:0px #FFFFFF none;" name="" scrolling="auto" frameborder="0" align=aus marginheight="0px" marginwidth="0px" height="60px" width="100%"></iframe></center>'
                                }
                            ]
                        },
                        westPanel, 
                        {
                            xtype : 'tabpanel',
                            region : 'center'                            
                            //width: '500',
                            //height: '500',
                            //centered  : true                            
                        },
                        southPanel
                    ]
                });

            });
        </script>
    </body>
</html>
