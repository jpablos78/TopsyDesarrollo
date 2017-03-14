Ext.define('TraspasoPedidosTopsy.controller.TraspasoPedidosTopsyController', {
    extend: 'Ext.app.Controller',
    views: ['TraspasoPedidosTopsy', 'PedidoDetalle'],
    stores: ['Filtro', 'Pedidos'],
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
            'traspasopedidostopsy grid': {
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
    },
    onChangeCheckbox: function (field, newValue, oldValue, eOpts) {
        var storePedidos = this.getStore('Pedidos');

        storePedidos.each(function (record) {
            record.set('sel', field.getValue());
        });
        storePedidos.commitChanges();
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
    },
    onChangeDate: function (field, newValue, oldValue, eOpts) {
        if (field.id == 'txtFechaInicial') {
            Ext.getCmp('txtFechaFinal').setMinValue(Ext.getCmp('txtFechaInicial').getValue());
        }
    },
    onClickBtnBuscar: function (button, e, options) {
        this.cargarPedidos(Ext.getCmp('cmbFiltro').getValue());
    },
    onClickBtnGrabar: function (button, e, options) {
        var me = this;
        var storePedidos = this.getStore('Pedidos');

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
                        datosStorePedidos: datosStorePedidos
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
    consultaPedidoDetalle: function (grid, record, item, index, e, eOpts) {
        var window = Ext.widget('windowpedidodetalle');
        window.setTitle('Detalle del Pedido');
    },
    cargarPedidos: function (filtro) {
        var storePedidos = this.getStore('Pedidos');
        var cadena = Ext.util.Format.trim(Ext.getCmp('txtBusqueda').getValue());
        var fechaInicial = Ext.getCmp('txtFechaInicial').getRawValue();
        var fechaFinal = Ext.getCmp('txtFechaFinal').getRawValue();

        storePedidos.proxy.setExtraParam('action', 'getPedidos');
        storePedidos.proxy.setExtraParam('filtro', filtro);
        storePedidos.proxy.setExtraParam('cadena', cadena);
        storePedidos.proxy.setExtraParam('fechaInicial', fechaInicial);
        storePedidos.proxy.setExtraParam('fechaFinal', fechaFinal);

        storePedidos.load();
    }
});


