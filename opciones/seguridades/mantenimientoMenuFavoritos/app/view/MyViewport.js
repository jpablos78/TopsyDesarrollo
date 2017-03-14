Ext.define('Favoritos.view.MyViewport', {
   extend: 'Ext.container.Viewport',
   
   requires: ['Favoritos.view.Window'],
   
   initComponent: function() {
       this.items = [
           {
               xtype: 'window'
           }
       ];
       
       this.callParent(arguments);
   }
});


