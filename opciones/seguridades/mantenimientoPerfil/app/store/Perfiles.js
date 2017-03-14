Ext.define('Perfiles.store.Perfiles', {
    extend: 'Ext.data.Store',
    //model: 'Perfiles.model.Usuario',
    //autoLoad: true,
    pageSize: 10,
    autoSync: true,
   
    proxy: {
        type: 'ajax',
        api: {
            read: 'app/data/Perfiles.php?action=listarAll'
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
        name: 'pe_codigo',
        type: 'int'
    },
    {
        name: 'pe_desc',
        type: 'string'
    },
    {
        name: 'pe_estado',
        type: 'string'
    },
    {
        name: 'pe_desc_estado',
        type: 'string'
    }
    ]
});


