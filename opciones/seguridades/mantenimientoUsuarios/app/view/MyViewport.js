Ext.define('Usuarios.view.MyViewport', {
   extend: 'Ext.container.Viewport',
   
   requires: ['Usuarios.view.Window'],
   
   initComponent: function() {
       this.items = [
           {
               xtype: 'window'
           }
       ];
       
       this.callParent(arguments);
   }
});


