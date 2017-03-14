var states = Ext.create('Ext.data.Store', {
    fields: ['us_estado', 'us_desc_estado'],
    data : [
    {
        "us_estado":"A", 
        "us_desc_estado":"ACTIVO"
    },

    {
        "us_estado":"I", 
        "us_desc_estado":"INACTIVO"
    }    
    ]
});

Ext.define('Usuarios.view.UsEdit', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.form.Field', 'Ext.form.RadioGroup'],
    defaultType: 'textfield',
    frame: true,
    width: 600,
    //layout: 'column',
    defaults: {
        allowBlank: false,
        labelAlign: 'left',
        labelWidth: 100,
        enableKeyEvents: true
    },
    alias: 'widget.usedit',
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
            xtype: 'hidden',
            id: 'aux',
            name: 'aux',
            value: 'N'
        },
        {
            id: 'us_codigo',
            name: 'us_codigo',
            fieldLabel: 'Codigo',
            width: 200,
            allowBlank: true,
            readOnly: true,
            fieldStyle: 'background-color: #ddd; background-image: none;'
        },
        {
            xtype: 'checkbox',
            id: 'us_es_ven',
            name: 'us_es_ven',            
            fieldLabel: 'Es Vendedor',
            labelAlign: 'left',
            value: '0',
            inputValue: 'S'            
        },
        {
            xtype: 'checkbox',
            id: 'us_vis_ped',
            name: 'us_vis_ped',            
            fieldLabel: 'Visualiza Pedidos',
            labelAlign: 'left',
            value: '0',
            inputValue: 'S'            
        },
        {
            id: 'us_nombres',
            name: 'us_nombres',
            fieldLabel: 'Nombres',
            width: 400,
            maxLength: 350,
            listeners: {
                change: function(obj, newValue) {
                    obj.setRawValue(newValue.toUpperCase());
                }
            }
        },
        {
            id: 'us_apellidos',
            name: 'us_apellidos',
            fieldLabel: 'Apellidos',
            allowBlank: true,
            width: 400,
            maxLength: 350,
            listeners: {
                change: function(obj, newValue) {
                    obj.setRawValue(newValue.toUpperCase());
                }
            }
        },
        {
            id: 'us_login',
            name: 'us_login',
            fieldLabel: 'Login',
            width: 250,
            maxLength: 20,
            listeners: {
                change: function(obj, newValue) {
                    obj.setRawValue(newValue.toUpperCase());
                }
            }
        //regex: /\[a-zA-Z0-9]\+/
        },
        {
            xtype: 'combobox',
            id: 'pe_codigo',
            name: 'pe_codigo',
            fieldLabel: 'Perfil',
            store: 'Perfiles',
            displayField: 'pe_desc',
            valueField: 'pe_codigo',
            queryMode: 'remote',
            forceSelection: true,
            //anchor: '100%',
            minChars: 1,
            typeAhead: true,
            typeAheadDelay: 100,
            width: 400
        },     
        {
            id: 'us_email',
            name: 'us_email',            
            fieldLabel: 'Email',
            width: 250,
            maxLength: 80,
            allowBlank: false,
            vtype:'email'
        },
        {
            xtype: 'combobox',
            id: 'us_estado',
            name: 'us_estado',
            fieldLabel: 'Estado',
            store: states,
            queryMode: 'local',
            displayField: 'us_desc_estado',
            valueField: 'us_estado'
        },        
        {            
            xtype:'fieldset',
            //columnWidth: 0.5,
            title: 'Cambiar Clave',
            collapsible: true,
            defaultType: 'textfield',
            checkboxToggle: true,
            collapsed: true,
            border: true,
            //defaults: {anchor: '100%'},
            //layout: 'anchor',
            items :[
            //            {
            //                fieldLabel: 'Field 1',
            //                name: 'field1'
            //            },
            //            {
            //                fieldLabel: 'Field 2',
            //                name: 'field2'
            //            },
            {
                id: 'us_passe1',
                name: 'us_passe1',                
                fieldLabel: 'Contraseña',
                inputType: 'password',
                maxLength: 45,
                width: 250,
                enableKeyEvents: true
            },
            {
                id: 'us_passe2',
                name: 'us_passe2',                
                fieldLabel: 'Ratificar Contraseña',
                inputType: 'password',
                maxLength: 45,
                width: 250,
                enableKeyEvents: true
            }
            ]
        },
        {
            xtype: 'hidden',
            id: 'cci_cliprov_e',
            name: 'cci_cliprov_e',
            value: '0'
        },
        {
            xtype: 'hidden',
            id: 'cci_vendedor',
            name: 'cci_vendedor'            
        }
        ];
        
        this.callParent(arguments);
    }
});


Ext.define('Usuarios.view.WindowEdit', {
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
        Ext.widget('usedit')
        ];
        this.callParent(arguments);
    //        this.items = [
    //        Ext.widget('admrolcrud')
    //        ];
    //        this.callParent(arguments);
    }

});

