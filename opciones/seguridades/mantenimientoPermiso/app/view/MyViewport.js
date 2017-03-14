Ext.define('Permisos.view.MyViewport', {
   extend: 'Ext.container.Viewport',
   
   requires: ['Permisos.view.Window'],
   
   initComponent: function() {
       this.items = [
           {
               xtype: 'window'
           }
       ];
       
       this.callParent(arguments);
   }
});


