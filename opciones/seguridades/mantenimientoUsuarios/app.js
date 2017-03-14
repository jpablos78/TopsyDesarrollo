Ext.Loader.setConfig({
    enable: true 
});

Ext.application({
    name: 'Usuarios',
    appFolder: 'app',
   
    requires:[
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
    ],
   
    //   paths: { 'Ext.ux': 'extjs/ux/' },
   
    controllers: ['Usuarios'],
    launch: function() {
        Ext.EventManager.addListener(Ext.getBody(), 'keydown', function(e){            
            if(e.getKey() == '8'){
                if(e.getTarget().type == 'text' || e.getTarget().type == 'textarea' || e.getTarget().type == 'password') {
                    
                } else {
                    e.preventDefault();
                }
            }
        });
        
        Ext.create('Usuarios.view.MyViewport');
    }
});