Ext.define('Favoritos.store.Favoritos', {
    extend: 'Ext.data.TreeStore',
    id: 'per',
    name: 'per',
    //model: 'Perfiles.model.Usuario',
    autoLoad: false,
    //pageSize: 10,
    //groupField: 'mn_cod_padre',
    //autoSync: true,
   
    proxy: {
        type: 'ajax',
        api: {
            read: 'app/data/Favoritos.php?action=listarAll'
        },
        actionMethods: {
            read: 'POST'
        }
    //        reader: {
    //            type: 'json',
    //            root: 'data',
    //            successProperty: 'success'
    //        },
    //        writer: {
    //            type: 'json',
    //            root: 'data',
    //            writeAllFields: true,
    //            encode: true,
    //            allowSingle: true
    //        }
    },
    //    proxy: {
    //        type: 'ajax',
    //        url: "app/data/Favoritos.php?action=listarAll"
    //    },
    //    actionMethods: {
    //        read: 'POST'
    //    },
    root: {
        text: 'Sistema',
        expanded: true
    },
    fields: [
    {
        name: 'mn_codigo', 
        type: 'int'
    },    
    {
        name: 'mn_nombre', 
        type: 'string'
    },

    {
        name: 'iconCls',  
        type: 'string'
    },    

    {
        name: 'leaf'
    },
    
    {
        name: 'favorito',
        type: 'bool'
    }               
    ]    
});


