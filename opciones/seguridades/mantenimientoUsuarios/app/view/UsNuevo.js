Ext.define('Usuarios.view.UsNuevo', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.form.Field'],
    defaultType: 'textfield',
    frame: true,
    width: 600,
    layout: 'auto',
    defaults: {
        allowBlank: false,
        labelAlign: 'left',
        labelWidth: 100,
        enableKeyEvents: true
    },
    alias: 'widget.usnuevo',
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
            name: 'us_codigo',
            fieldLabel: 'Código',
            width: 200,
            allowBlank: true,
            readOnly: true,
            fieldStyle: 'background-color: #ddd; background-image: none;',
            listeners: {
                afterrender: function(field) {
                    field.focus(false, 100);
                }
            }
        },
        {
            xtype: 'checkbox',
            id: 'es_vendedor',
            name: 'es_vendedor',            
            fieldLabel: 'Es Vendedor',
            labelAlign: 'left',
            value: '0',
            inputValue: 'S'            
        },
        {
            xtype: 'checkbox',
            id: 'visualiza',
            name: 'visualiza',            
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
            anchor: '100%',
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
            id: 'us_pass',
            name: 'us_pass',            
            fieldLabel: 'Contraseña',
            inputType: 'password',
            maxLength: 45,
            width: 250
        },
        {                       
            id: 'us_pass2',
            name: 'us_pass2',
            fieldLabel: 'Ratificar Contraseña',
            inputType: 'password',
            maxLength: 45,
            width: 250
        },
        {
            xtype: 'hidden',
            id: 'cci_cliprov',
            name: 'cci_cliprov',
            value: '0'
        }
        ];
        
        this.callParent(arguments);
    }
});


Ext.define('Usuarios.view.WindowNuevo', {
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
        Ext.widget('usnuevo')
        ];
        this.callParent(arguments);    
    }

});


