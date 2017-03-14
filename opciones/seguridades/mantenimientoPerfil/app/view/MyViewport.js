Ext.define('Perfiles.view.MyViewport', {
   extend: 'Ext.container.Viewport',
   
   requires: ['Perfiles.view.PerMain'],
   
   initComponent: function() {
       this.items = [
           {
               xtype: 'window'
           }
       ];
       
       this.callParent(arguments);
   }
});


