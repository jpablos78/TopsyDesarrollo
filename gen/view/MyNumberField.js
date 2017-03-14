Ext.define('Gen.view.MyNumberField', {
    extend: 'Ext.form.NumberField',
    alias : 'widget.mynumberfield',
    decimalSeparator: '.',
    minValue: 0,
    hideTrigger: true,
    initComponent: function() {
        this.callParent(arguments);
   },
    setValue : function(v){
        v = typeof v == 'number' ? v : String(v).replace(this.decimalSeparator, ".");
        v = isNaN(v) ? '' : String(v).replace(".", this.decimalSeparator);
        v = isNaN(v) ? '' : this.fixPrecision(String(v).replace(".", this.decimalSeparator));
        return Ext.form.NumberField.superclass.setRawValue.call(this, v);
    }, 
    onSpinUp: function() {
        var me = this;
        if (!me.readOnly) {
            var val = parseFloat(me.step); 
            if(me.getValue() !== '') {
                val = parseFloat(me.getValue()); 
                me.setValue((val + parseFloat(me.step)));
            }   
        }   
    },
    fixPrecision : function(value){
            
        var nan = isNaN(value);
        if(!this.allowDecimals || this.decimalPrecision == -1 || nan || !value){
            return nan ? '' : value;
        }
        return parseFloat(value).toFixed(this.decimalPrecision);
    }
}); 
