Ext.define('Usuarios.store.Perfiles', {
    extend: 'Ext.data.Store',
    //model: 'Rol.model.AdmRol',
    pageSize: 10,
    autoLoad: true,
    autoSync: true,
    
    proxy: {
        type: 'ajax',
        //url: 'app/data/AdmRol.php',
        api: {
            read: 'app/data/Usuarios.php?action=listarAllP'            
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
            name: 'pe_codigo',
            type: 'int'
        },
        {
            name: 'pe_desc',
            type: 'string'
        }
    ]
});



