Ext.define('PedidosProcesados.controller.PedidosProcesadosController', {
    extend: 'Ext.app.Controller',
    views: ['PedidosProcesados', 'PedidoDetalle'],
    stores: ['Filtro', 'Pedidos', 'PedidoDetalle'],
    init: function () {
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'side';

        this.control({
            'pedidosprocesados': {
                afterrender: this.onAfterrender
            },
            'pedidosprocesados combobox[id=cmbFiltro]': {
                change: this.onChangeCmbFiltro
            },
            'pedidosprocesados textfield': {
                change: this.onChange
            },
            'pedidosprocesados datefield': {
                change: this.onChangeDate
            },
            'pedidosprocesados button[id=btnBuscar]': {
                click: this.onClickBtnBuscar
            },
            'pedidosprocesados button[id=btnActualizar]': {
                click: this.onClickBtnActualizar
            },
            'pedidosprocesados button[id=btnExcel]': {
                click: this.onClickBtnExcel
            },
            'pedidosprocesados grid': {
                itemdblclick: this.consultaPedidoDetalle
            }
        });
    },
    onAfterrender: function (abstractcomponent, options) {
        Ext.getCmp('cmbFiltro').setValue('T');
        Ext.getCmp('txtFechaInicial').setValue(new Date());
        Ext.getCmp('txtFechaFinal').setValue(new Date());
        Ext.getCmp('txtFechaFinal').setMinValue(Ext.getCmp('txtFechaInicial').getValue());
    },
    onChangeCmbFiltro: function (field, newValue, oldValue, eOpts) {
        var storePedidos = this.getStore('Pedidos');

        storePedidos.removeAll();
        Ext.getCmp('txtBusqueda').setValue('');

        Ext.getCmp('txtBusqueda').setVisible(true);
        Ext.getCmp('txtFechaInicial').setVisible(false);
        Ext.getCmp('txtFechaFinal').setVisible(false);
        Ext.getCmp('btnBuscar').setVisible(false);

        switch (field.getValue()) {
            case 'T':
                Ext.getCmp('txtBusqueda').setVisible(false);
                Ext.getCmp('txtFechaInicial').setVisible(false);
                Ext.getCmp('txtFechaFinal').setVisible(false);
                Ext.getCmp('btnBuscar').setVisible(false);
                this.cargarPedidos(field.getValue());
                break;
            case 'F':
                Ext.getCmp('txtBusqueda').setVisible(false);
                Ext.getCmp('txtFechaInicial').setVisible(true);
                Ext.getCmp('txtFechaFinal').setVisible(true);
                Ext.getCmp('btnBuscar').setVisible(true);
                break;
        }

        this.calcularTotales();
    },
    onChange: function (field, newValue, oldValue, eOpts) {
        if (field.id == 'txtBusqueda') {
            field.setRawValue(newValue.toUpperCase());

            if (Ext.util.Format.trim(Ext.getCmp('txtBusqueda').getValue()).length >= 3) {
                this.cargarPedidos(Ext.getCmp('cmbFiltro').getValue());
            } else {
                this.getStore('Pedidos').removeAll();
            }
        }

        this.calcularTotales();
    },
    onChangeDate: function (field, newValue, oldValue, eOpts) {
        if (field.id == 'txtFechaInicial') {
            Ext.getCmp('txtFechaFinal').setMinValue(Ext.getCmp('txtFechaInicial').getValue());
        }

        this.calcularTotales();
    },
    onClickBtnBuscar: function (button, e, options) {
        this.cargarPedidos(Ext.getCmp('cmbFiltro').getValue());
    },
    onClickBtnExcel: function (button, e, options) {
        var storePedidos = this.getStore('Pedidos');

        if (storePedidos.count() <= 0) {
            Ext.Msg.show({
                title: 'Mensaje del Sistema', //<- el título del diálogo
                msg: "No existen registros, revise", //<- El mensaje
                buttons: Ext.Msg.OK, //<- Botones de SI
                icon: Ext.Msg.INFO
            });
            return;
        }

        var datosStorePedidos = [];
        var contador = 0;

        storePedidos.each(function (record) {
            datosStorePedidos.push(Ext.apply({
                id: record.id
            }, record.data));
        });

        datosStorePedidos = Ext.encode(datosStorePedidos);

        var box = Ext.MessageBox.wait('Por favor espere procesando ...', 'Enviando');

        Ext.Ajax.request({
            url: 'app/data/pedidos.php',
            method: 'POST',
            timeout: 9000000,
            params: {
                action: 'generarPedidoCabeceraExcel',
                filtro: Ext.getCmp('cmbFiltro').getRawValue(),
                busqueda: Ext.getCmp('txtBusqueda').getValue(),
                fechaInicial: Ext.getCmp('txtFechaInicial').getRawValue(),
                fechaFinal: Ext.getCmp('txtFechaFinal').getRawValue(),
                datosStorePedidos: datosStorePedidos
            },
            success: function (response) {
                box.hide();
                var text = Ext.decode(response.responseText);
                var s = text.success;
                if (s) {
                    var ruta = text.message.reason;
                    window.open('../../../descargas/' + ruta);
                } else {
                    Ext.Msg.show({
                        title: 'Mensaje del Sistema: INFORMACION ', //<- el título del diálogo
                        msg: text.message.reason, //<- El mensaje
                        buttons: Ext.Msg.OK, //<- Botones de SI
                        icon: Ext.Msg.ERROR // <- un ícono de error
                    });
                }
            },
            failure: function (response, options) {
                box.hide();
                var text = Ext.decode(response.responseText);
                Ext.Msg.show({
                    title: 'Mensaje del Sistema: INFORMACION ', //<- el título del diálogo
                    msg: text.message.reason, //<- El mensaje
                    buttons: Ext.Msg.OK, //<- Botones de SI
                    icon: Ext.Msg.ERROR // <- un ícono de error
                });
            }
        });
    },
    onClickBtnActualizar: function (button, e, options) {
        this.cargarPedidos(Ext.getCmp('cmbFiltro').getValue());
    },
    consultaPedidoDetalle: function (grid, record, item, index, e, eOpts) {
        var window = Ext.widget('windowpedidodetalle');
        window.setTitle('Detalle del Pedido');

        Ext.getCmp('txtPedido').setValue(record.get('id'));
        Ext.getCmp('txtVendedor').setValue(record.get('nombre_vendedor'));
        Ext.getCmp('txtCliente').setValue(record.get('nombre_cliente'));
        Ext.getCmp('txtRuta').setValue(record.get('nombre_ruta'));

        var storePedidoDetalle = Ext.getCmp('gridpanelpd').getStore();

        storePedidoDetalle.removeAll();
        storePedidoDetalle.load({
            params: {
                id_pedido_cabecera: record.get('id'),
                action: 'getPedidoDetalle'
            },
            callback: function (rec, o, s) {
                if (s) {
                    Ext.getCmp('txtSubtotalPedido').setValue(record.get('subtotal'));
                    Ext.getCmp('txtIvaPedido').setValue(record.get('iva'));
                    Ext.getCmp('txtTotalPedido').setValue(record.get('total'));
                } else {
                    var text = o.request.proxy.reader.rawData;

                    Ext.Msg.show({
                        title: 'Mensaje del Sistema: INFORMACION ', //<- el título del diálogo  
                        msg: text.message.reason, //<- El mensaje  
                        buttons: Ext.Msg.OK, //<- Botones de SI  
                        icon: Ext.Msg.ERROR // <- un ícono de error                               
                    });
                }
            }
        });
    },
    cargarPedidos: function (filtro) {
        var me = this;
        var storePedidos = this.getStore('Pedidos');
        var cadena = Ext.util.Format.trim(Ext.getCmp('txtBusqueda').getValue());
        var fechaInicial = Ext.getCmp('txtFechaInicial').getRawValue();
        var fechaFinal = Ext.getCmp('txtFechaFinal').getRawValue();

        storePedidos.proxy.setExtraParam('action', 'getPedidos');
        storePedidos.proxy.setExtraParam('filtro', filtro);
        storePedidos.proxy.setExtraParam('cadena', cadena);
        storePedidos.proxy.setExtraParam('fechaInicial', fechaInicial);
        storePedidos.proxy.setExtraParam('fechaFinal', fechaFinal);

        storePedidos.load({
            callback: function (rec, o, s) {
                me.calcularTotales();
            }
        });
    },
    calcularTotales: function () {
        var storePedidos = this.getStore('Pedidos');
        var totalPedidoC = 0;
        var numeroPedidosFiltro = 0;

        storePedidos.each(function (record) {
            totalPedidoC = totalPedidoC + record.get('total');
        });

        numeroPedidosFiltro = storePedidos.count();

        Ext.getCmp('txtNumeroPedidosFiltro').setValue(numeroPedidosFiltro);
        Ext.getCmp('txtTotalPedidoC').setValue(totalPedidoC);
    }
});


