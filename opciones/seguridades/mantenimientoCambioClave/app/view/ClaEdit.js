Ext.define('Claves.view.ClaEdit', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.form.Field'],
    defaultType: 'textfield',
    frame: true,
    width: 450,
    layout: 'auto',
    defaults: {
        allowBlank: false,
        labelAlign: 'left',
        labelWidth: 120,
        enableKeyEvents: true
    },
    alias: 'widget.claedit',
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
        var S_us_codigo = Ext.get('S_us_codigo').dom.value;
    
        this.items = [
        {
            id: 'us_pass',
            name: 'us_pass',
            fieldLabel: 'Contraseña Anterior',
            width: 250,   
            maxLength: 45,
            inputType: 'password'            
        },
        {
            id: 'us_new_pass',
            name: 'us_new_pass',
            fieldLabel: 'Contraseña Nueva',
            width: 250,
            maxLength: 45,
            inputType: 'password'
        //            listeners: {
        //                change: function(obj, newValue) {
        //                    obj.setRawValue(newValue.toUpperCase());
        //                }
        //            }
        },
        {
            xtype: 'hidden',
            name: 'us_codigo',
            value: S_us_codigo
        }
        ];
        
        this.callParent(arguments);
    }
});


Ext.define('Perfiles.view.Window', {
    extend: 'Ext.window.Window',
    title: 'Cambio de Clave',
    //width: 500,
    //height: 400,
    layout: 'fit',
    autoShow: true,
    closable: true,
    iconCls: 'icon-perfil',
    //modal: true,       
    //bodyStyle: 'padding:5px;background-color:#fff',
    
    
    alias: 'widget.window',    

    initComponent: function(){        
        this.items = [
        Ext.widget('claedit')
        ];
        this.callParent(arguments);    
    },
    
    listeners: {
        close: function() {
            parent[1].content.tabPanel.remove(parent[1].content.tabPanel.getActiveTab().getId());
        }
    }
});