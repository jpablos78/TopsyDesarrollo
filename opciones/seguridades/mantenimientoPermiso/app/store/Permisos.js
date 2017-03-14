Ext.define('Permisos.store.Permisos', {
    extend: 'Ext.data.TreeStore',
    id: 'per',
    name: 'per',
    //model: 'Perfiles.model.Usuario',
    //autoLoad: true,
    //pageSize: 10,
    //groupField: 'mn_cod_padre',
    //autoSync: true,
   
    proxy: {
        type: 'ajax',
        api: {
            read: 'app/data/Permisos.php?action=listarAll'
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
    //        url: "app/data/Permisos.php?action=listarAll"
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
        name: 'mn_cod_padre', 
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
        name: 'ruta',  
        type: 'string'
    },

    {
        name: 'leaf'
    },
    //    {
    //        name: 'mn_orden',
    //        type: 'string'
    //    },
    {
        name: 'pr_codigo',
        type: 'int'
    },
    //    {
    //        name: 'mn_cod_padre',
    //        type: 'int'
    //    },
    //    {
    //        name: 'mn_codigo',
    //        type: 'int'
    //    },
    //    {
    //        name: 'mn_nombre',
    //        type: 'string'
    //    },
    {
        name: 'pr_acceso',
        type: 'bool'
    },
    {
        name: 'pr_insert',
        type: 'bool'
    },
    {
        name: 'pr_delete',
        type: 'bool'
    },
    {
        name: 'pr_update',
        type: 'bool'
    },
    {
        name: 'pr_cp',
        type: 'bool'
    }
    ]    
});


