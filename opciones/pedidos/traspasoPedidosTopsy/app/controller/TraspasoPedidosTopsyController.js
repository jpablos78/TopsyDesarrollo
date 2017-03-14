Ext.define('TraspasoPedidosTopsy.controller.TraspasoPedidosTopsyController', {
    extend: 'Ext.app.Controller',
    views: ['TraspasoPedidosTopsy', 'PedidoDetalle'],
    stores: ['Filtro', 'Pedidos', 'PedidoDetalle'],
    init: function () {
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'side';

        this.control({
            'traspasopedidostopsy': {
                afterrender: this.onAfterrender
            },
            'traspasopedidostopsy combobox[id=cmbFiltro]': {
                change: this.onChangeCmbFiltro
            },
            'traspasopedidostopsy textfield': {
                change: this.onChange
            },
            'traspasopedidostopsy datefield': {
                change: this.onChangeDate
            },
            'traspasopedidostopsy checkbox': {
                change: this.onChangeCheckbox
            },
            'traspasopedidostopsy button[id=btnBuscar]': {
                click: this.onClickBtnBuscar
            },
            'traspasopedidostopsy button[id=btnGrabar]': {
                click: this.onClickBtnGrabar
            },
            'traspasopedidostopsy button[id=btnExcel]': {
                click: this.onClickBtnExcel
            },
            'traspasopedidostopsy button[id=btnActualizar]': {
                click: this.onClickBtnActualizar
            },
            'traspasopedidostopsy grid': {
                itemdblclick: this.consultaPedidoDetalle
            },
            'traspasopedidostopsy grid checkcolumn': {
                checkchange: this.onCheckchangeCheckcolumn
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
    onChangeCheckbox: function (field, newValue, oldValue, eOpts) {
        var storePedidos = this.getStore('Pedidos');

        storePedidos.each(function (record) {
            record.set('sel', field.getValue());
        });
        storePedidos.commitChanges();

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
    onClickBtnGrabar: function (button, e, options) {
        var me = this;
        var storePedidos = this.getStore('Pedidos');

        var S_se_codigo = Ext.get("S_se_codigo").dom.value;
        var S_pe_codigo = Ext.get("S_pe_codigo").dom.value;
        var S_mn_codigo = Ext.get("S_mn_codigo").dom.value;
        var S_us_codigo = Ext.get("S_us_codigo").dom.value;

        if (storePedidos.getCount() <= 0) {
            Ext.Msg.show({
                title: 'Mensaje del Sistema', //<- el título del diálogo
                msg: 'No existen registros, revise', //<- El mensaje
                buttons: Ext.Msg.OK, //<- Botones de SI
                icon: Ext.Msg.ERROR // <- un ícono de error
            });

            return;
        }

        var datosStorePedidos = [];
        var contador = 0;

        storePedidos.each(function (record) {
            if (record.get('sel')) {
                contador++;

                datosStorePedidos.push(Ext.apply({
                    id: record.id
                }, record.data));
            }
        });

        if (contador <= 0) {
            Ext.Msg.show({
                title: 'Mensaje del Sistema', //<- el título del diálogo
                msg: 'No ha seleccionado ningun registro, revise', //<- El mensaje
                buttons: Ext.Msg.OK, //<- Botones de SI
                icon: Ext.Msg.ERROR // <- un ícono de error
            });

            return;
        }

        Ext.Msg.confirm('Mensaje del Sistema', 'Esta Seguro de que desea procesar los pedidos seleccionados ?', function (btn) {
            if (btn == 'yes') {
                datosStorePedidos = Ext.encode(datosStorePedidos);

                button.up('form').getForm().submit({
                    method: 'POST',
                    timeout: 90000,
                    waitTitle: 'Procesando ...',
                    waitMsg: 'Enviando Datos',
                    url: 'app/data/pedidos.php',
                    submitEmptyText: false,
                    params: {
                        action: 'procesarPedidos',
                        datosStorePedidos: datosStorePedidos,
                        S_us_codigo: S_us_codigo
                    },
                    success: function (form, action) {
                        Ext.Msg.show({
                            title: 'Mensaje del Sistema', //<- el título del diálogo
                            msg: action.result.message.reason, //<- El mensaje
                            buttons: Ext.Msg.OK, //<- Botones de SI
                            icon: Ext.Msg.INFO,
                            fn: function () {
                                storePedidos.removeAll();
                                me.cargarPedidos(Ext.getCmp('cmbFiltro').getValue());
                            }
                        });
                    },
                    failure: function (form, action) {
                        Ext.Msg.show({
                            title: 'Mensaje del Sistema', //<- el título del diálogo
                            msg: action.result.message.reason, //<- El mensaje
                            buttons: Ext.Msg.OK, //<- Botones de SI
                            icon: Ext.Msg.ERROR // <- un ícono de error
                        });

                        Ext.getCmp('btnGrabar').disable();
                    }
                });
            }
        });
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
    onCheckchangeCheckcolumn: function (field, rowIndex, checked, eOpts) {
        this.calcularTotales();
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
        var numeroPedidosSel = 0;
        var numeroPedidosFiltro = 0;

        storePedidos.each(function (record) {
            if (record.get('sel')) {
                numeroPedidosSel++;
                totalPedidoC = totalPedidoC + record.get('total');
            }
        });

        numeroPedidosFiltro = storePedidos.count();

        Ext.getCmp('txtNumeroPedidosFiltro').setValue(numeroPedidosFiltro);
        Ext.getCmp('txtNumeroPedidosSel').setValue(numeroPedidosSel);
        Ext.getCmp('txtTotalPedidoC').setValue(totalPedidoC);
    }
});


