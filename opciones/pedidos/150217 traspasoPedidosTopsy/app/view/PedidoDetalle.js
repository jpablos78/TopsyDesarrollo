//var storeComisionesDesglose = Ext.create('Gen2.store.Comisiones.ComisionesDesglose');

Ext.define('TraspasoPedidosTopsy.view.PedidoDetalle', {
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
                id: 'gridpanelcd',
                title: 'Productos',
                height: 200,
                //plugins: [cellEditing],
                //store: storeComisionesDesglose,
                columns: [
                    new Ext.grid.RowNumberer(),
                    {
                        text: 'Codigo',
                        dataIndex: 'CTP_PAGO',
                        sortable: false,
                        hideable: false,
                        width: 70
                    },
                    {
                        text: 'Producto',
                        dataIndex: 'COD_CMPR',
                        sortable: true,
                        hideable: false,
                        width: 90
                    },
                    {
                        text: 'Precio',
                        dataIndex: 'NCI_DOCUMENTO_PAGO_REL',
                        sortable: true,
                        hideable: false,
                        width: 90
                    },
                    {
                        text: 'Precio Iva',
                        dataIndex: 'NVA_PAGO',
                        sortable: false,
                        hideable: false,
                        width: 110,
                        align: 'right',
                        renderer: Ext.util.Format.usMoney
                    },
                    {
                        text: 'Cantidad',
                        dataIndex: 'NVA_PAGO_SIVA',
                        sortable: false,
                        hideable: false,
                        width: 110,
                        align: 'right',
                        renderer: Ext.util.Format.numberRenderer('$0.000000')
                    },
                    {
                        text: 'Subtotal',
                        dataIndex: 'NVA_VALOR_COMISION_VENTA',
                        sortable: false,
                        hideable: false,
                        align: 'right',
                        width: 110,
                        renderer: Ext.util.Format.numberRenderer('$0.000000')
                    },
                    {
                        text: 'Total',
                        dataIndex: 'NVA_VALOR_COMISION_COBRO',
                        sortable: false,
                        hideable: false,
                        align: 'right',
                        width: 110,
                        renderer: Ext.util.Format.numberRenderer('$ 0.000000')
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
                    //            //'->',
                    //            {
                    //                xtype: 'displayfield',
                    //                fieldLabel: '',
                    //                name: 'home_score',
                    //                value: '',
                    //                width: 120
                    //            },
//                    {
//                        id: 'txtValorPagoDP',
//                        fieldLabel: 'Valor Pago',
//                        labelWidth: 70,
//                        width: 165
//                    },
//                    {
//                        //xtype: 'numberfield',
//                        id: 'txtValorPagoSivaDP',
//                        fieldLabel: 'Valor P. SIVA',
//                        decimalPrecision: 6,
//                        labelWidth: 80,
//                        width: 175
//                    },
//                    {
//                        //xtype: 'numberfield',
//                        id: 'txtTotalComisionVentaDP',
//                        fieldLabel: 'Com. Vta',
//                        decimalPrecision: 6,
//                        labelWidth: 55,
//                        width: 150
//                    },
//                    {
//                        //xtype: 'numberfield',
//                        id: 'txtTotalComisionCobroDP',
//                        fieldLabel: 'Com. Cbr',
//                        decimalPrecision: 6,
//                        labelWidth: 55,
//                        width: 150
//                    },
//                    {
//                        //xtype: 'numberfield',
//                        id: 'txtTotalDescuentoVentaDP',
//                        fieldLabel: 'Dev. Vta',
//                        decimalPrecision: 6,
//                        labelWidth: 55,
//                        width: 150
//                    },
//                    {
//                        //xtype: 'numberfield',
//                        id: 'txtTotalDescuentoCobroDP',
//                        fieldLabel: 'Dev. Cbr',
//                        decimalPrecision: 6,
//                        labelWidth: 55,
//                        width: 150
//                    },
                    {
                        id: 'txtTotalComisionDP',
                        fieldLabel: 'Total',
                        decimalPrecision: 6,
                        labelWidth: 40,
                        width: 135
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});


Ext.define('TraspasoPedidosTopsy.view.WindowPedidoDetalle', {
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


