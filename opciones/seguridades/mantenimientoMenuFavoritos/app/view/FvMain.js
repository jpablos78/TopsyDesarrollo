Ext.define('Favoritos.view.FvMain', {
    extend: 'Ext.tree.Panel',
    id: 'fvmain',
    name: 'fvmain',
    alias: 'widget.fvmain',
    store: 'Favoritos',
    width: 450,
    height: 400,
    columnLines: true,        
            
    viewConfig: {
        stripeRows: true
    },
    rootVisible: false,
    plugins: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
   
    dockedItems: [
    {
        xtype: 'toolbar',
        dock: 'top',
        items: [
        {
            text: 'Actualizar Favoritos',
            iconCls: 'icon-save',
            action: 'actualizar'
        },
        '->',
        {
            text: 'Salir',
            iconCls: 'icon-cancel',
            //action: 'nuevo',
            handler: function() {                                                
                this.up('window').close();
            }
        }
        ]
    }
    ],
        
    initComponent: function() {               
        
        this.columns= [  
        {
            xtype: 'treecolumn',
            text: 'Opcion',
            //flex: 1,
            dataIndex: 'mn_nombre',
            width: '50%',
            sortable: false,
            hideable: false
        },        
        {
            xtype: 'checkcolumn',
            header: 'Favoritos',
            id: 'favorito',
            width: '20%',
            dataIndex: 'favorito',
            sortable: false,
            hideable: false            
        }
        ];               
       
       
        this.callParent(arguments);
    }
});

Ext.define('Favoritos.view.Window', {
    extend: 'Ext.window.Window',
    title: 'Mantenimiento de Favoritos',
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
        Ext.widget('fvmain')
        ];
        this.callParent(arguments);    
    },
    
    listeners: {
        close: function() {
            parent[1].content.tabPanel.remove(parent[1].content.tabPanel.getActiveTab().getId());
        }
    }
});


