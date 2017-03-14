Ext.define('TraspasoPedidosTopsy.view.MyViewport', {
   extend: 'Ext.container.Viewport',
   
   requires: ['TraspasoPedidosTopsy.view.TraspasoPedidosTopsy'],
   
   initComponent: function() {
       this.items = [
           {
               xtype: 'window'
           }
       ];
       
       this.callParent(arguments);
   }
});


