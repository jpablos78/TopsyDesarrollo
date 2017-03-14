Ext.define('Perfiles.view.PerNuevo', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.form.Field'],
    defaultType: 'textfield',
    frame: true,
    width: 450,
    layout: 'auto',
    defaults: {
        allowBlank: false,
        labelAlign: 'left',
        labelWidth: 100,
        enableKeyEvents: true
    },
    alias: 'widget.pernuevo',
    padding: 5,
    border: true,
    dockedItems: [
    {
        xtype: 'toolbar',
        dock: 'bottom',
        items: [
        '->',
        {
            id: 'cmdGrabar',
            text: 'Grabar',
            iconCls: 'icon-save',
            action: 'grabar'
        },
        {
            text: 'Cancelar',
            iconCls: 'icon-cancel',
            action: 'cancel',
            handler: function() {
                this.up('window').close();
            }
        }
        ]
    }
    ],
    
    initComponent: function() {
        this.items = [
        {
            id: 'pe_codigo',
            name: 'pe_codigo',
            fieldLabel: 'Código',
            width: 200,
            allowBlank: true,
            readOnly: true,
            fieldStyle: 'background-color: #ddd; background-image: none;'
        },
        {
            id: 'pe_desc',
            name: 'pe_desc',
            fieldLabel: 'Descripción',
            width: 400,
            maxLength: 350,
            listeners: {
                change: function(obj, newValue) {
                    obj.setRawValue(newValue.toUpperCase());
                }
            }
        }                                        
        ];
        
        this.callParent(arguments);
    }
});


Ext.define('Perfiles.view.WindowNuevo', {
    extend: 'Ext.window.Window',
    title: 'Editando registro',
    //width: 500,
    //height: 400,
    layout: 'fit',
    autoShow: true,
    modal: true,       
    bodyStyle: 'padding:5px;background-color:#fff',
    
    
    alias: 'widget.windownuevo',    

    initComponent: function(){
        this.items = [
        Ext.widget('pernuevo')
        ];
        this.callParent(arguments);    
    }

});


