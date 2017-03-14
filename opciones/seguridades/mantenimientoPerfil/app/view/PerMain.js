Ext.define('Perfiles.view.PerMain', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.permain',
    store: 'Perfiles',
    width: 450,
    height: 400,
   
    dockedItems: [
    {
        xtype: 'toolbar',
        dock: 'top',
        items: [
        {
            text: 'Nuevo',
            iconCls: 'icon-new',
            action: 'nuevo',
            id: 'btnNuevo'            
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
                this.up('window').close();
            }
        }
        ]
    },
    {
        xtype: 'pagingtoolbar',
        store: 'Perfiles',
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
            width:'8%',
            id: 'ac',
            //hidden: true,
            //            items: [
            //            {
            //                icon: '../../../images/iconos/pencil.png'
            //            },
            //                        {
            //                icon: '../../../images/iconos/cross.png'
            //            }
            //            ]
            items:[                
            {
                iconCls: iconEdit,
                tooltip: tipEdit,
                itemId: 'btnModificar'
            //                            hidden: true
            },
            {                    
                iconCls: iconDelete,
                tooltip: tipDelete,
                itemId: 'btnEliminar'
            }            
            ]
        },
        {
            header: 'Descripción',
            width: '40%',
            dataIndex: 'pe_desc',
            filter: true
        },
        {
            header: 'Estado',
            width: '15%',
            dataIndex: 'pe_desc_estado',
            align: 'center',
            filter: true,
            renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                if (record.get('pe_estado') == 'A') {
                    return '<span style="color:green;">' + value + '</span>';
                } else {
                    return '<span style="color:red;">' + value + '</span>';
                }
                
                return value;
            }
        },
        ];
       
        this.callParent(arguments);
    },
    listeners: {
        afterrender: function() {
            var S_pr_insert = Ext.get("S_pr_insert").dom.value; 
            
            if (S_pr_insert == 'N') {
                Ext.getCmp('btnNuevo').setVisible(false);
            }
        }
    }
});

Ext.define('Perfiles.view.Window', {
    extend: 'Ext.window.Window',
    title: 'Mantenimiento de Perfil',
    //width: 500,
    //height: 400,
    layout: 'fit',
    autoShow: true,
    closable: true,
    iconCls: 'icon-perfil',
    //modal: true,       
    //bodyStyle: 'padding:5px;background-color:#fff',
    
    
    alias: 'widget.window',    

    initComponent: function(){        
        this.items = [
        Ext.widget('permain')
        ];
        this.callParent(arguments);    
    },
    
    listeners: {
        close: function() {
            parent[1].content.tabPanel.remove(parent[1].content.tabPanel.getActiveTab().getId());
        }
    }
});
