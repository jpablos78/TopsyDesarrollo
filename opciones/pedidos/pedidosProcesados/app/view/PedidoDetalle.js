Ext.define('PedidosProcesados.view.PedidoDetalle', {
    extend: 'Ext.form.Panel',
    id: 'pedidodetalle',
    //requires: ['Ext.form.Field'],
    require: ['Ext.form.*', 'Ext.tip.QuickTipManager'],
    defaultType: 'textfield',
    frame: true,
    width: 900,
    layout: 'auto',
    defaults: {
        allowBlank: false,
        labelAlign: 'left',
        labelWidth: 150,
        enableKeyEvents: true
    },
    alias: 'widget.pedidodetalle',
    //padding: 5,
    border: true,
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
                '->',
                {
                    text: 'Salir',
                    iconCls: 'icon-cancel',
                    action: 'cancel',
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        }
    ],
    initComponent: function () {
        this.items = [
            {
                xtype: 'textfield',
                id: 'txtPedido',
                fieldLabel: 'Pedido',
                labelWidth: 85,
                width: 200,
                fieldStyle: {
                    'text-align': 'left',
                    'background-color': 'Lavender',
                    'background-image': 'none'
                }
            },
            {
                xtype: 'textfield',
                id: 'txtVendedor',
                fieldLabel: 'Vendedor',
                labelWidth: 85,
                width: 405,
                fieldStyle: {
                    'text-align': 'left',
                    'background-color': 'Lavender',
                    'background-image': 'none'
                }
            },
            {
                xtype: 'textfield',
                id: 'txtCliente',
                fieldLabel: 'Cliente',
                labelWidth: 85,
                width: 405,
                fieldStyle: {
                    'text-align': 'left',
                    'background-color': 'Lavender',
                    'background-image': 'none'
                }
            },
            {
                xtype: 'textfield',
                id: 'txtRuta',
                fieldLabel: 'Ruta',
                labelWidth: 85,
                width: 405,
                fieldStyle: {
                    'text-align': 'left',
                    'background-color': 'Lavender',
                    'background-image': 'none'
                }
            },
            {
                xtype: 'gridpanel',
                id: 'gridpanelpd',
                title: 'Productos',
                height: 200,
                //plugins: [cellEditing],
                store: 'PedidoDetalle',
                columns: [
                    new Ext.grid.RowNumberer(),
                    {
                        text: 'Codigo',
                        dataIndex: 'codigo_producto',
                        sortable: false,
                        hideable: false,
                        width: 70
                    },
                    {
                        text: 'Producto',
                        dataIndex: 'nombre_producto',
                        sortable: true,
                        hideable: false,
                        width: 200
                    },
                    {
                        text: 'Precio',
                        dataIndex: 'precio',
                        sortable: true,
                        hideable: false,
                        width: 90,
                        align: 'right',
                        renderer: Ext.util.Format.numberRenderer('$0.0000')
                    },
                    {
                        text: 'Precio Iva',
                        dataIndex: 'precio_iva',
                        sortable: false,
                        hideable: false,
                        width: 110,
                        align: 'right',
                        renderer: Ext.util.Format.numberRenderer('$0.0000')
                    },
                    {
                        text: 'Cantidad',
                        dataIndex: 'cantidad',
                        sortable: false,
                        hideable: false,
                        width: 110,
                        align: 'right'
                    },
                    {
                        text: 'Subtotal',
                        dataIndex: 'subtotal',
                        sortable: false,
                        hideable: false,
                        align: 'right',
                        width: 110,
                        renderer: Ext.util.Format.numberRenderer('$0.0000')
                    },
                    {
                        text: 'Total',
                        dataIndex: 'total',
                        sortable: false,
                        hideable: false,
                        align: 'right',
                        width: 110,
                        renderer: Ext.util.Format.numberRenderer('$0.0000')
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    //flex: 1,
                    //xtype: 'mynumberfield',
                    xtype: 'numericfield',
                    //labelWidth: 70,
                    //width: 160,
                    decimalPrecision: 2,
                    decimalSeparator: '.',
                    hideTrigger: true,
                    value: 0,
                    readOnly: true,
                    margins: '5 15 0 0',
                    useThousandSeparator: true,
                    //decimalPrecision: 2,
                    alwaysDisplayDecimals: true,
                    allowNegative: false,
                    currencySymbol: '$',
                    //value: 0,
                    thousandSeparator: ',',
                    fieldStyle: {
                        'text-align': 'right',
                        'background-color': 'Lavender',
                        'background-image': 'none'
                    }
                },
                items: [
                    //'->',
                    {
                        xtype: 'displayfield',
                        fieldLabel: '',
                        name: 'home_score',
                        value: '',
                        width: 350
                    },
                    {
                        //xtype: 'numberfield',
                        id: 'txtSubtotalPedido',
                        fieldLabel: 'Subtotal',
                        decimalPrecision: 2,
                        labelWidth: 55,
                        width: 150
                    },
                    {
                        //xtype: 'numberfield',
                        id: 'txtIvaPedido',
                        fieldLabel: 'Iva',
                        decimalPrecision: 2,
                        labelWidth: 55,
                        width: 150
                    },
                    {
                        id: 'txtTotalPedido',
                        fieldLabel: 'Total',
                        decimalPrecision: 2,
                        labelWidth: 40,
                        width: 135
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});


Ext.define('PedidosProcesados.view.WindowPedidoDetalle', {
    extend: 'Ext.window.Window',
    title: '',
    //width: 500,
    //height: 400,
    layout: 'fit',
    autoShow: true,
    modal: true,
    //bodyStyle: 'padding:5px;background-color:#fff',
    bodyStyle: 'padding:5px;background-color:#dfe8f5',
    alias: 'widget.windowpedidodetalle',
    initComponent: function () {
        this.items = [
            Ext.widget('pedidodetalle')
        ];
        this.callParent(arguments);
    }
});


