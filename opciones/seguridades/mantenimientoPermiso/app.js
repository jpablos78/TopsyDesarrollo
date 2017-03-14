Ext.Loader.setConfig({
    enable: true,
    paths: {
        Ext: '.',
        'Ext.ux': '../../../extjs/src/ux'
    }
});

Ext.application({
    name: 'Permisos',
    appFolder: 'app',
   
    requires: [
    'Ext.ux.CheckColumn',
    'Ext.data.*',
    'Ext.grid.*',
    
    
    'Ext.selection.CellModel',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.CheckColumn'
    ],
   
    //   paths: { 'Ext.ux': 'extjs/ux/' },
   
    controllers: ['Permisos'],
    launch: function() {
        Ext.EventManager.addListener(Ext.getBody(), 'keydown', function(e){
            if(e.getTarget().type != 'text' && e.getKey() == '8' ){
                e.preventDefault();
            }
        });
        
        Ext.create('Permisos.view.MyViewport');
    }
});