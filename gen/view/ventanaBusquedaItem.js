function ventanaBusquedaItem(title, width, height, store, columns) {       
    
    var id = 0;
    
    store.load();    
    
    Ext.create('Ext.window.Window', {
        title: title,
        height: height,
        width: width,
        layout: 'fit',
        modal: true,
        
        dockedItems: [        
        {
            xtype: 'pagingtoolbar',
            store: eval(store),
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
            store: eval(store),
            //columns: [{header: 'Codigo', dataIndex: 'id', filter: true},{header: 'Nombre'},{header: 'Tipo'}]
            columns: eval(columns),             // One header just for show. There's no data,
            //            store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
            //            store: ds
            listeners: {
                beforeitemdblclick: {                    
                    fn: function(view, record, item, index, e, eOpts){
                        //alert('fifa 98');
                        this.up('window').close();
                        //id = 999;
                        //proceso = false
                        
                        //alert(record);
                        //record = Ext.getCmp('grdBusqueda').getSelectionModel().getSelected();
                        //alert(record.get('id'));
                        //return proceso;
                        //alert(record.get('id'));
                        //rc = record.get('id');
                        //rc = record;
                        //eval('prueba()');
                        
                        //eval("Ext.getCmp('txtCliente').setValue(record.get('CCI_CLIPROV') + ' - ' +record.get('CNO_CLIPROV'))");
                        //eval("Ext.getCmp('txtRuc').setValue(record.get('CCI_RUC'))");
                        //eval("Ext.getCmp('txtDireccion').setValue(record.get('CTX_DIRECCION'))");
                        //eval("Ext.getCmp('txtTelefono').setValue(record.get('CTX_TELEFONO'))");
                        //eval("Ext.getCmp('txtTipoPago').focus(true, 100)");
                        
                        alert(record.get('cci_item'))
                        alert(record.get('cno_item'))
                        alert(record.get('nqn_item'))
                        
                        eval("storePedido.add({CCI_ITEM: record.get('cci_item'), CNO_ITEM: record.get('cno_item'), PRECIO_VENTA: 1.00, nqn_item: record.get('nqn_item')})"); 
                        
                        //
//                                        name: 'PRECIO_VENTA',
//                type: 'float'
//            },
//            {                 
//                name: 'PRECIO_PEDIDO',
//                type: 'float'
//            },
//            {                
//                name: 'EXISTENCIA',
//                type: 'float'
//            },
//            {                 
//                name: 'RESERVADO',
//                type: 'float'
//            },
//            {                
//                name: 'DISPONIBLE',
//                type: 'float'
//            },
//            {                
//                name: 'SOLICITADO',
//                type: 'float'
//            },
//            {                 
//                name: 'SUBTOTAL',

                        //
                        
                    }                                        
                }
            //                itemkeydown: {
            //                                    
            //                    fn: function(){
            //                        alert('ffff');  
            //                    }
            //                }
                

            }
        }
    }).show();
    
    return id;

}


