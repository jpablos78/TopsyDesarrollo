Ext.define('TraspasoPedidosTopsy.store.Filtro', {
    extend: 'Ext.data.Store',
    fields: [
        'filtro',
        'filtro_descripcion'
    ],
    data: [
        {
            "filtro": "T",
            "filtro_descripcion": "TODOS"
        },
        {
            "filtro": "C",
            "filtro_descripcion": "CLIENTE"
        },
        {
            "filtro": "R",
            "filtro_descripcion": "RUTA"
        },
        {
            "filtro": "V",
            "filtro_descripcion": "VENDEDOR"
        },
        {
            "filtro": "F",
            "filtro_descripcion": "FECHA"
        },        
    ]
})


