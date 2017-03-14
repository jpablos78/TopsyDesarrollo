Ext.define('PedidosProcesados.store.PedidoDetalle', {
    extend: 'Ext.data.Store',
    //pageSize: 10,
    //autoLoad: true,
    //autoSync: true,

    proxy: {
        type: 'ajax',
        timeout: 9000000,
        api: {
            read: 'app/data/pedidos.php'
        },
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        },
        writer: {
            type: 'json', //json ou xml
            root: 'data',
            writeAllFields: true,
            encode: true,
            allowSingle: true
        }
    },
    fields: [
        {
            name: 'id'
        },
        {
            name: 'id_pedido_cabecera'
        },
        {
            name: 'pedido_detalle'
        },
        {
            name: 'codigo_producto',
            type: 'string'
        },
        {
            name: 'nombre_producto',
            type: 'string'
        },
        {
            name: 'precio',
            type: 'float'
        },
        {
            name: 'precio_iva',
            type: 'float'
        },
        {
            name: 'cantidad',
            type: 'int'
        },
        {
            name: 'subtotal',
            type: 'float'
        },
        {
            name: 'total',
            type: 'float'
        },
        {
            name: 'estado',
            type: 'string'
        }        
    ]
});


