Ext.define('PedidosProcesados.store.Pedidos', {
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
            name: 'id_pedido_fono'
        },
        {
            name: 'codigo_ruta',
            type: 'string'
        },
        {
            name: 'nombre_ruta',
            type: 'string'
        },
        {
            name: 'codigo_vendedor',
            type: 'string'
        },
        {
            name: 'nombre_vendedor',
            type: 'string'
        },
        {
            name: 'codigo_cliente',
            type: 'string'
        },
        {
            name: 'nombre_cliente',
            type: 'string'
        },
        {
            name: 'fecha_caracter',
            type: 'string'
        },
        {
            name: 'fecha_pedido_caracter',
            type: 'string'
        },
        {
            name: 'fecha_proceso_caracter',
            type: 'string'
        },
        {
            name: 'observacion',
            type: 'string'
        },
        {
            name: 'subtotal',
            type: 'float'
        },
        {
            name: 'iva',
            type: 'float'
        },
        {
            name: 'total',
            type: 'float'
        },
        {
            name: 'sel',
            type: 'bool'
        },
        {
            name: 'nrodoc'            
        }
    ]
});




