Ext.Loader.setConfig({
    enable: true,
    paths: {
        'Gen': '../../../gen',
        'Ext.ux': '../../../extjs/src/ux'
    }
});

//<script type="text/javascript" src="../../../extjs/src/ux/form/SearchField.js"></script>

Ext.require([
    'Ext.ux.CheckColumn',
    'Ext.tip.*',
    'Ext.Button',
    'Ext.window.MessageBox',
    'Ext.form.Field', 
    'Gen.view.MyNumberField',
    'Ext.ux.form.NumericField'
    //    'Ext.ux.form.SearchField'
    ]);

Ext.application({
    name: 'TraspasoPedidosTopsy',
    appFolder: 'app',
   
    controllers: ['TraspasoPedidosTopsyController'],    
    launch: function() {
        Ext.util.Format.thousandSeparator = ',';
        Ext.util.Format.decimalSeparator = '.';
        
        Ext.EventManager.addListener(Ext.getBody(), 'keydown', function(e){
            if(e.getTarget().type != 'text' && e.getKey() == '8' ){
                e.preventDefault();
            }
        });
        
        Ext.create('TraspasoPedidosTopsy.view.MyViewport');
    }   
});