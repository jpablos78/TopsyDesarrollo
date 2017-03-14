Ext.define('Claves.view.MyViewport', {
   extend: 'Ext.container.Viewport',
   
   requires: ['Claves.view.ClaEdit'],
   
   initComponent: function() {
       this.items = [
           {
               xtype: 'window'
           }
       ];
       
       this.callParent(arguments);
   }
});


