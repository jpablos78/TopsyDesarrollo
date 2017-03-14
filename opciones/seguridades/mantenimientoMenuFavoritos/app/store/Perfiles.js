Ext.define('Favoritos.store.Perfiles', {
    extend: 'Ext.data.Store',
    //model: 'Perfiles.model.Usuario',
    //autoLoad: true,
    pageSize: 10,
    autoSync: true,
   
    proxy: {
        type: 'ajax',
        api: {
            read: 'app/data/Favoritos.php?action=listarAllP'
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
            type: 'json',
            root: 'data',
            writeAllFields: true,
            encode: true,
            allowSingle: true
        }
    },
    fields: [
    {
        name: 'id',
        type: 'int'
    },
    {
        name: 'descripcion',
        type: 'string'
    },
    {
        name: 'estado',
        type: 'string'
    },
    {
        name: 'descripcionEstado',
        type: 'string'
    }
    ]
});


