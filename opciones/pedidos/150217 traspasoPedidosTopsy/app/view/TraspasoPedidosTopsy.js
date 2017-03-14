Ext.define('TraspasoPedidosTopsy.view.TraspasoPedidosTopsy', {
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
    alias: 'widget.traspasopedidostopsy',
    padding: 5,
    border: true,
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
                '->',
                {
                    id: 'btnGrabar',
                    text: 'Grabar',
                    iconCls: 'icon-save',
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
                xtype: 'checkbox',
                id: 'chkSelAll',
                name: 'SELALL',
                fieldLabel: 'Sel. Todos',
                labelWidth: 65,
                labelAlign: 'left',
                margins: '0 5 5 0',
                value: '0',
                inputValue: 'S'
            },
            {
                xtype: 'gridpanel',
                id: 'gridpanelcomision',
                store: 'Pedidos',
                title: 'Pedidos',
                height: 250,
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
                        sortable: false,
                        hideable: false,
                        align: 'right',
                        width: 40
                    },
                    {
                        text: 'Fono',
                        dataIndex: 'id_pedido_fono',
                        sortable: false,
                        hideable: false,
                        align: 'right',
                        width: 40
                    },
                    {
                        text: 'Cliente',
                        dataIndex: 'nombre_cliente',
                        sortable: false,
                        hideable: false,
                        width: 150
                    },
                    {
                        text: 'Vendedor',
                        dataIndex: 'nombre_vendedor',
                        sortable: false,
                        hideable: false,
                        width: 150
                    },
                    {
                        text: 'Ruta',
                        dataIndex: 'nombre_ruta',
                        sortable: false,
                        hideable: false,
                        width: 100
                    },
                    {
                        text: 'Fecha',
                        dataIndex: 'fecha_caracter',
                        sortable: false,
                        hideable: false,
                        width: 115,
                        align: 'center'
                    },
                    {
                        text: 'Fecha Pedido',
                        dataIndex: 'fecha_pedido_caracter',
                        sortable: false,
                        hideable: false,
                        width: 115,
                        align: 'center'
                    },
                    {
                        text: 'Observacion',
                        dataIndex: 'observacion',
                        sortable: false,
                        hideable: false,
                        width: 240
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
                        xtype: 'checkcolumn',
                        id: 'chkSel',
                        text: 'Sel',
                        align: 'center',
                        dataIndex: 'sel',
                        hideable: false,
                        width: 30
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});

Ext.define('TraspasoPedidosTopsy.view.Window', {
    extend: 'Ext.window.Window',
    title: 'Traspaso de Pedidos Topsy',
    //width: '99%',
    //width: 500,
    //height: 400,
    layout: 'fit',
    autoShow: true,
    closable: true,
    iconCls: 'icon-money',
    bodyStyle: 'background-color:#dfe8f5;padding:5px',
    //modal: true,       
    //bodyStyle: 'padding:5px;background-color:#fff',

    alias: 'widget.window',
    initComponent: function () {
        this.items = [
            Ext.widget('traspasopedidostopsy')
        ];
        this.callParent(arguments);
    },
    listeners: {
        close: function () {
            parent[0].content.tabPanel.remove(parent[0].content.tabPanel.getActiveTab().getId());
        }
    }
});