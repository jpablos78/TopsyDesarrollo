var states = Ext.create('Ext.data.Store', {
    fields: ['pe_estado', 'pe_desc_estado'],
    data : [
    {
        "pe_estado":"A", 
        "pe_desc_estado":"ACTIVO"
    },

    {
        "pe_estado":"I", 
        "pe_desc_estado":"INACTIVO"
    }    
    ]
});

Ext.define('Perfiles.view.PerEdit', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.form.Field'],
    defaultType: 'textfield',
    frame: true,
    width: 450,
    //layout: 'column',
    defaults: {
        allowBlank: false,
        labelAlign: 'left',
        labelWidth: 100,
        enableKeyEvents: true
    },
    alias: 'widget.peredit',
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
            fieldLabel: 'Codigo',
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
        },                           
        {
            xtype: 'combobox',
            id: 'pe_estado',
            name: 'pe_estado',
            fieldLabel: 'Estado',
            store: states,
            queryMode: 'local',
            displayField: 'pe_desc_estado',
            valueField: 'pe_estado'
        },
        ];
        
        this.callParent(arguments);
    }
});


Ext.define('Perfiles.view.WindowEdit', {
    extend: 'Ext.window.Window',
    title: 'Editando registro',
    //width: 500,
    //height: 400a,
    layout: 'fit',
    autoShow: true,
    modal: true,       
    bodyStyle: 'padding:5px;background-color:#fff',
    
    
    alias: 'widget.windowedit',    

    initComponent: function(){
        this.items = [
        Ext.widget('peredit')
        ];
        this.callParent(arguments);    
    }

});


