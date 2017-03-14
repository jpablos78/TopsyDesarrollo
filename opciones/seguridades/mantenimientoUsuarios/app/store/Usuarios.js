Ext.define('Usuarios.store.Usuarios', {
   extend: 'Ext.data.Store',
   model: 'Usuarios.model.Usuario',
   //autoLoad: true,
   pageSize: 10,
   autoSync: true,
   
   proxy: {
       type: 'ajax',
       api: {
           read: 'app/data/Usuarios.php?action=listarAll'
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
   }
});


