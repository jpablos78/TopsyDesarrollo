Ext.define('Permisos.view.PmMain', {
    extend: 'Ext.tree.Panel',
    id: 'pmmain',
    name: 'pmmain',
    alias: 'widget.pmmain',
    store: 'Permisos',
    width: 600,
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
            xtype: 'combobox',
            id: 'pe_codigo',
            name: 'pe_codigo',
            fieldLabel: 'Perfil',
            labelWidth: 50,
            store: 'Perfiles',
            displayField: 'pe_desc',
            valueField: 'pe_codigo',
            queryMode: 'remote',
            forceSelection: true,
            allowBlank: false,
            anchor: '100%',
            minChars: 1,
            typeAhead: true,
            typeAheadDelay: 100,
            width: 400                   
        },
        {
            text: 'Actualizar Permiso',
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
    }//,
    //    {
    //        xtype: 'pagingtoolbar',
    ////        store: 'Permisos',
    //        dock: 'bottom',
    //        displayInfo: true
    //    }
    ],
        
    initComponent: function() {               
        
        this.columns= [  
        {
            xtype: 'treecolumn',
            text: 'Opción',
            //flex: 1,
            dataIndex: 'mn_nombre',
            width: '40%',
            sortable: false,
            hideable: false
        },
        //        {
        //            header: 'orden',            
        //            dataIndex: 'mn_orden',
        //            hidden: true,
        //            hideable: false	
        //        },
        //        {
        //            xtype: 'treecolumn',
        //            header: 'descripcion',
        //            width: '40%',
        //            dataIndex: 'mn_nombre',
        //            filter: true
        //        },
        {
            xtype: 'checkcolumn',
            header: 'Acceso',
            id: 'pr_acceso',
            width: '15%',
            dataIndex: 'pr_acceso',
            align: 'center',
            sortable: false,
            hideable: false            
        //            listeners: {
        //                checkchange: function(column, rowIndex, checked, eOpts) {
        //                    alert(column);
        //                    alert(rowIndex);
        //                    alert(checked);
        //                            
        //                    column.cascadeBy(function(n) {
        //                        n.set('checked', checked);
        //                    });
        //                            
        //                //store = Ext.getCmp('pmmain').getStore('Permisos');
        //                //                        store = this.getStore('Permisos');
        //                            
        //                //                    store.each(function(rec){
        //                //                        rec.set('field', true)
        //                //                    });
        //                //                    
        //                //                    var store = grid.getStore();
        //        
        //                //store.load();
        //                            
        //                //Ext.getCmp('pmmain').store.each(function(record) {
        //                                
        //                //    });
        //        
        //        
        //                //                    store.each(function(record,idx){
        //                //                        //faz alguma coisa
        //                //                        //console.log(record.get('company');
        //                //                        });
        //                            
        //                //var me = this,
        //                //grid = me.getList(),
        //                //store = grid.getStore();
        //                            
        //                //this.getStore('Perfiles').each(function(rec){ rec.set('field', true) });
        //                //
        //                //
        //                //
        //                //store.each(function(rec){ rec.set('field', true) })
        //                            
        //                //                    node.expand();
        //                //                    if (checked) {
        //                //                        //function(node) {
        //                //                            node.expand();
        //                //                        //}
        //                //                    } else {
        //                //                        alert('no checked')
        //                //                    }
        //                }
        //            }
        },
        {
            xtype: 'checkcolumn',
            header: 'Agregar',
            id: 'pr_insert',
            width: '10%',
            dataIndex: 'pr_insert',
            sortable: false,
            hideable: false,
            hidden: false,
            align: 'center'
        },
        {
            xtype: 'checkcolumn',
            header: 'Editar',
            id: 'pr_update',
            //xtype: 'checkcolumn',
            width: '10%',
            dataIndex: 'pr_update',
            sortable: false,
            hideable: false,
            hidden: false,
            align: 'center'
        },
        {
            xtype: 'checkcolumn',
            header: 'Eliminar',
            id: 'pr_delete',
            width: '10%',
            dataIndex: 'pr_delete',
            sortable: false,
            hideable: false,
            hidden: false,
            align: 'center'
        },
        {
            xtype: 'checkcolumn',
            header: 'CP',
            id: 'pr_cp',
            width: '10%',
            dataIndex: 'pr_cp',
            sortable: false,
            hideable: false,
            hidden: false,
            align: 'center'
        }        
        ];               
       
       
        this.callParent(arguments);
    }
});

Ext.define('Permisos.view.Window', {
    extend: 'Ext.window.Window',
    title: 'Mantenimiento de Permisos',
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
        Ext.widget('pmmain')
        ];
        this.callParent(arguments);    
    },
    
    listeners: {
        close: function() {
            parent[1].content.tabPanel.remove(parent[1].content.tabPanel.getActiveTab().getId());
        }
    }
});


