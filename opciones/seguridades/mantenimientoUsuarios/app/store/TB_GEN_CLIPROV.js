Ext.define('Usuarios.store.TB_GEN_CLIPROV', {
    extend: 'Ext.data.Store',
    alias : 'widget.tb_gen_cliprov',
    //model: 'Rol.model.AdmRol',
    pageSize: 15,
    //autoLoad: true,
    autoSync: true,
    
    proxy: {
        type: 'ajax',
        //url: 'app/data/AdmRol.php',
        api: {
            read: 'app/data/Usuarios.php?action=listarAllV'            
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
        name: 'id',
        type: 'int'
    },
    {
        name: 'CCI_CLIPROV',
        type: 'string'
    },
    {
        name: 'CNO_CLIPROV',
        type: 'string'
    },
    {
        name: 'CCI_RUC',
        type: 'string'
    },
    {
        name: 'CTX_DIRECCION',
        type: 'string'
    },
    {
        name: 'CTX_TELEFONO',
        type: 'string'
    }
    ]
});


//Ext.define('Pedidos.store.TB_GEN_CLIPROV', {
//                             extend: 'Ext.data.Store',
//                             alias : 'widget.tb_gen_cliprov',
//                             0,
//                             autoSync: true,
//                             proxy: {
//                                type: 'ajax',
//                                api: {
//                                    read: 'app/data/TB_GEN_CLIPROV.php?action=listarAll'            
//                                },
//                                actionMethods: {
//                                read: 'POST'
//                                },
//                                reader: {
//                                    type: 'json',
//                                    root: 'data',
//                                    successProperty: 'success'
//                                },
//                                writer: {
//                                    type: 'json', //json ou xml
//                                    root: 'data',
//                                    writeAllFields: true,
//                                    encode: true,
//                                    allowSingle: true
//                                }
//
//                            },
//                            fields: [{"name":"id"},{"name":"CCI_CLIPROV"},{"name":"CNO_CLIPROV"},{"name":"CTX_DIRECCION"},{"name":"CTX_TELEFONO"},{"name":"CCI_RUC"}] 
//            }); 
//

