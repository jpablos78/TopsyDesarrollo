Ext.define('PedidosProcesados.view.PedidosProcesados', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.form.Field'],
    defaultType: 'textfield',
    frame: true,
    width: 1100,
    //layout: 'auto',
    defaults: {
        allowBlank: false,
        labelAlign: 'left',
        labelWidth: 100,
        enableKeyEvents: true
    },
    alias: 'widget.pedidosprocesados',
    padding: 5,
    border: true,
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [  
                '->',
                {
                    id: 'btnActualizar',
                    text: 'Actualizar',
                    iconCls: 'icon-reload',
                    action: 'grabar',
                    formBind: true
                },                                
                {
                    text: 'Cancelar',
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
                xtype: 'container',
                id: 'cntItem',
                layout: 'hbox',
                hidden: false,
                items: [
                    {
                        xtype: 'combobox',
                        id: 'cmbFiltro',
                        itemId: 'cmbFiltro',
                        name: 'cmbFiltro',
                        fieldLabel: 'Filtro',
                        labelWidth: 50,
                        margins: '0 5 5 0',
                        store: 'Filtro',
                        queryMode: 'local',
                        displayField: 'filtro_descripcion',
                        valueField: 'filtro',
                        value: 'C',
                        allowBlank: false,
                        readOnly: false,
                        width: 220
                    },
                    {
                        xtype: 'textfield',
                        labelWidth: 100,
                        margins: '0 5 5 0',
                        id: 'txtBusqueda',
                        name: 'busqueda',
                        readOnly: false,
                        allowBlank: true,
                        enableKeyEvents: true,
                        emptyText: 'Ingrese el dato a buscar',
                        submitValue: true,
                        hidden: false,
                        width: 300
                    },
                    {
                        xtype: 'datefield',
                        id: 'txtFechaInicial',
                        labelWidth: 85,
                        width: 200,
                        margins: '0 5 5 0',
                        fieldLabel: 'Fecha Inicio',
                        format: 'd/m/Y',
                        submitFormat: 'd/m/Y',
                        value: new Date()
                    },
                    {
                        xtype: 'datefield',
                        id: 'txtFechaFinal',
                        labelWidth: 85,
                        width: 200,
                        margins: '0 5 5 0',
                        fieldLabel: 'Fecha Fin',
                        format: 'd/m/Y',
                        submitFormat: 'd/m/Y',
                        value: new Date()
                    },
                    {
                        xtype: 'button',
                        id: 'btnBuscar',
                        text: 'Buscar'
                    }
                ]
            },            
            {
                xtype: 'gridpanel',
                id: 'gridpanelcomision',
                store: 'Pedidos',
                title: 'Pedidos',
                height: 400,
                plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                    pluginId: 'cellEditing',
                    clicksToEdit: 1,
                    listeners: {
                        'beforeedit': function (editor, context, eOpts) {
                            if (context.record.get('MODIFICA_PORC') == 'N') {
                                return false;
                            }
                        }
                    }
                }),
                columns: [
                    {
                        xtype: 'rownumberer'
                    },
                    {
                        text: 'Pedido',
                        dataIndex: 'id',
                        sortable: true,
                        hideable: false,
                        align: 'right',
                        width: 40
                    },
                    {
                        text: 'Fono',
                        dataIndex: 'id_pedido_fono',
                        sortable: true,
                        hideable: false,
                        align: 'right',
                        width: 40
                    },
                    {
                        text: 'Cliente',
                        dataIndex: 'nombre_cliente',
                        sortable: true,
                        hideable: false,
                        width: 150
                    },
                    {
                        text: 'Vendedor',
                        dataIndex: 'nombre_vendedor',
                        sortable: true,
                        hideable: false,
                        width: 150
                    },
                    {
                        text: 'Ruta',
                        dataIndex: 'nombre_ruta',
                        sortable: true,
                        hideable: false,
                        width: 100
                    },
                    {
                        text: 'Fecha Proc',
                        dataIndex: 'fecha_proceso_caracter',
                        sortable: true,
                        hideable: false,
                        width: 115,
                        align: 'center'
                    },
                    {
                        text: 'Fecha Pedido',
                        dataIndex: 'fecha_pedido_caracter',
                        sortable: true,
                        hideable: false,
                        width: 115,
                        align: 'center'
                    },
                    {
                        text: 'Observacion',
                        dataIndex: 'observacion',
                        sortable: false,
                        hideable: false,
                        width: 230
                    },
                    {
                        text: 'Total',
                        dataIndex: 'total',
                        sortable: false,
                        hideable: false,
                        width: 70,
                        align: 'right',
                        renderer: Ext.util.Format.usMoney
                    },
                    {
                        text: 'Nrodoc',
                        dataIndex: 'nrodoc',
                        sortable: false,
                        hideable: false,
                        width: 50,
                        align: 'right'                        
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
                        width: 705
                    },
                    {
                        xtype: 'numberfield',
                        id: 'txtNumeroPedidosFiltro',
                        fieldLabel: 'Num. Pedidos',                        
                        labelWidth: 85,
                        width: 180
                    },                    
                    {
                        id: 'txtTotalPedidoC',
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

Ext.define('PedidosProcesados.view.Window', {
    extend: 'Ext.window.Window',
    title: 'Pedidos Procesados Topsy',
    //width: '99%',
    //width: 500,
    //height: 400,
    layout: 'fit',
    autoShow: true,
    closable: true,
    iconCls: 'icon-network',
    bodyStyle: 'background-color:#dfe8f5;padding:5px',
    //modal: true,       
    //bodyStyle: 'padding:5px;background-color:#fff',

    alias: 'widget.window',
    initComponent: function () {
        this.items = [
            Ext.widget('pedidosprocesados')
        ];
        this.callParent(arguments);
    },
    listeners: {
        close: function () {
            parent[0].content.tabPanel.remove(parent[0].content.tabPanel.getActiveTab().getId());
        }
    }
});