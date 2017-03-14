Ext.define('Usuarios.view.UsMain', {
    extend: 'Ext.grid.Panel',
    //title: 'Mantenimiento de Usuarios',
    alias: 'widget.usmain',
    store: 'Usuarios',
    width: 850,
    height: 400,
    columnLines: true,
    viewConfig: {
        stripeRows: true
    },
    //layout: 'fit',
    //autoShow: true,
    //closable: false,
    //modal: true,
    
    dockedItems: [
    {
        xtype: 'toolbar',
        dock: 'top',
        items: [
        {
            text: 'Nuevo',
            id: 'cmdNuevo',
            iconCls: 'icon-new',
            action: 'nuevo'            
        },
        '->',
        {
            text: 'Salir',
            iconCls: 'icon-cancel',
            //action: 'nuevo',
            handler: function() {
                
                
                //var viewport = Ext.getCmp('vwp');
                //alert(viewport);
                //var tabPanel = viewport.items.get(2);
                //var tab = Ext.getCmp('remove-this-tab');
                //tabPanel.remove(tab);
                //alert('fff');
                //Ext.getCmp('cmdNuevo')
                
                //btn = Ext.getCmp('cmdNuevo');
                
                //btn.enable = false;
                //Ext.getCmp('cmdNuevo').disable();
                
                this.up('window').close();
            }
        }
        ]
    },
    {
        xtype: 'pagingtoolbar',
        store: 'Usuarios',
        dock: 'bottom',
        displayInfo: true
    }
    ],
        
    
    initComponent: function() {
        var S_pr_insert = Ext.get("S_pr_insert").dom.value;                                                                        
        var S_pr_delete = Ext.get("S_pr_delete").dom.value;
        var S_pr_update = Ext.get("S_pr_update").dom.value;
        
        var iconEdit = 'icon-pencil';
        var iconDelete = 'icon-cross';
        var tipEdit = 'Editar Registro';
        var tipDelete = 'Eliminar Registro';
        var hiddenNew = false;
                
        
        if (S_pr_update == 'N') {
            iconEdit = '';
            tipEdit = '';
        }
        
        if (S_pr_delete == 'N') {
            iconDelete = '',
            tipDelete = ''
        }

        this.columns= [
        {
            xtype:'actioncolumn',
            width:'5%',            
            items:[                
            {
                iconCls: iconEdit,
                tooltip: tipEdit                    
            },
            {                    
                iconCls: iconDelete,
                tooltip: tipDelete                
            }            
            ]
        },
        {
            header: 'Nombre',
            //            locked   : true,
            width: '35%',
            dataIndex: 'us_nombres_apellidos',
            filter: true
        },
        {
            header: 'Usuario',
            width: '15%',
            dataIndex: 'us_login',
            filter: true                
        },
        {
            header: 'Perfil',
            width: '25%',
            dataIndex: 'pe_desc',
            filter: true 
        },
        {
            header: 'Es Vendedor',
            width: '10%',
            dataIndex: 'us_es_ven',
            filter: true,
            align: 'center',
            renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                if (record.get('us_es_ven') == 'S') {
                    return 'SI'
                } else {
                    return 'NO'
                }
            }
        },
        {
            header: 'Estado',
            width: '10%',
            dataIndex: 'us_desc_estado',
            align: 'center',
            filter: true,
            renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                if (record.get('us_estado') == 'A') {
                    return '<span style="color:green;">' + value + '</span>';
                } else {
                    return '<span style="color:red;">' + value + '</span>';
                }
                
                return value;
            }
        }
        ];                                                
        this.callParent(arguments);
    },
    
    listeners: {
        afterrender: function() {
            var S_pr_insert = Ext.get("S_pr_insert").dom.value; 
            
            if (S_pr_insert == 'N') {
                Ext.getCmp('cmdNuevo').setVisible(false);
            }
            
        //alert('antes del render');
        //Ext.getCmp('cmdNuevo').setDisabled(false);
        //Ext.getCmp('cmdNuevo').disable();
            
            
        //            Ext.Ajax.request({
        //                url: 'app/data/Usuarios.php',
        //                method: 'POST',
        //                params: {
        //                    action: 'permisos',                                                    
        //                    S_se_codigo: S_se_codigo,
        //                    S_pe_codigo: S_pe_codigo,
        //                    S_mn_codigo: S_mn_codigo
        //                },
        //                success: function(response){                              
        //                            
        //                    var text = Ext.decode(response.responseText);                            
        //                    var s = text.success;
        //                            
        //                    if (s) {                        
        //                        if (text.message.reason == 'true') {
        //                            Ext.getCmp('cmdNuevo').setVisible(true);
        //                        } else {
        //                            Ext.getCmp('cmdNuevo').setVisible(false);
        //                        }
        //                    } else {
        //                                                      
        //                    }
        //                },
        //                failure: function(response, options){                         
        //                     
        //                }
        //            });
            
        }                
    }    
});


