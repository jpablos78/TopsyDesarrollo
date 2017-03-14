Ext.Loader.setConfig({
    enable: true 
});

Ext.application({
    name: 'Claves',
    appFolder: 'app',
   
    controllers: ['Claves'],
    launch: function() {
        Ext.EventManager.addListener(Ext.getBody(), 'keydown', function(e){            
            if(e.getKey() == '8'){
                if(e.getTarget().type == 'text' || e.getTarget().type == 'textarea' || e.getTarget().type == 'password') {
                    
                } else {
                    e.preventDefault();
                }
            }
        });
       
        Ext.create('Claves.view.MyViewport');
    }
});