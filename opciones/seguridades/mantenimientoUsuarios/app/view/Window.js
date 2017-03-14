Ext.define('Usuarios.view.Window', {
    extend: 'Ext.window.Window',
    title: 'Mantenimiento de Usuarios',
    //width: 500,
    //height: 400,
    layout: 'fit',
    autoShow: true,
    closable: true,
    //modal: true,       
    //bodyStyle: 'padding:5px;background-color:#fff',
    
    
    alias: 'widget.window',    

    initComponent: function(){
        this.items = [
        Ext.widget('usmain')
        ];
        this.callParent(arguments);    
    },
    
    listeners: {
        close: function() {
            parent[1].content.tabPanel.remove(parent[1].content.tabPanel.getActiveTab().getId());
        }
    }
});



