function roundNumber(rnum, rlength) { // Arguments: number to round, number of decimal places
    var newnumber = (Math.round(rnum*Math.pow(10,rlength))/Math.pow(10,rlength)).toFixed(2);
    //    document.roundform.numberfield.value = parseFloat(newnumber); // Output the result to the form field (change for your purposes)
    //alert(newnumber);
    return parseFloat(newnumber);
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function validarNumero(num){
    //num = document.form1.numero.value;
    if(isNaN(num)){
        //alert("'" + num + "' No es un número");
        return false
    }else{
        return true
    //alert(num + " Si es un número");
    }
}