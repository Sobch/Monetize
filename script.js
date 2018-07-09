function ready(callback){
    if (document.readyState!='loading') callback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

let valueInput;
let value;

ready(function(){
    valueInput = document.getElementById("moneyValue");
    value = parseFloat(valueInput.value);
    Monetize.redraw(document.getElementById("moneySpace"), value);
	valueInput.onchange = function(){
		value = parseFloat(valueInput.value);
		Monetize.redraw(document.getElementById("moneySpace"), value);
	}
});


