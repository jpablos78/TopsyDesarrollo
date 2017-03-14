Ext.define('PedidosProcesados.view.MyViewport', {
   extend: 'Ext.container.Viewport',
   
   requires: ['PedidosProcesados.view.PedidosProcesados'],
   
   initComponent: function() {
       this.items = [
           {
               xtype: 'window'
           }
       ];
       
       this.callParent(arguments);
   }
});


