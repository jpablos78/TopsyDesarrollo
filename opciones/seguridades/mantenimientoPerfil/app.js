Ext.Loader.setConfig({
    enable: true 
});

Ext.application({
    name: 'Perfiles',
    appFolder: 'app',
   
    //   paths: { 'Ext.ux': 'extjs/ux/' },
   
    controllers: ['Perfiles'], //['Usuarios'],
    launch: function() {
        Ext.EventManager.addListener(Ext.getBody(), 'keydown', function(e){
            if(e.getTarget().type != 'text' && e.getKey() == '8' ){
                e.preventDefault();
            }
        });
        
        Ext.create('Perfiles.view.MyViewport');
    }
});