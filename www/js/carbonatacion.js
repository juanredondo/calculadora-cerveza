        	/**
			 * @author Raul Hevia Casielles
			 */
			
			// ****************************************************************************************************
			
			function primingCalc()
			{	
				if (!check(document.primingTool.volumeCO2, "Volúmenes de CO2 deseados")) return;
				if (!check(document.primingTool.volume, "Volumen en litros")) return;
				if (!check(document.primingTool.temp, "Temperatura de la cerveza")) return;	
				
				var volumeCO2 = parseFloatEx(document.primingTool.volumeCO2.value);
				var volume = parseFloatEx(document.primingTool.volume.value);
				var temp = parseFloatEx(document.primingTool.temp.value);
				var ingredient = document.primingTool.ingredient.value;
				
				if (temp < 0 || temp > 30) {
					alert("La temperatura tiene que estar entre 0ºC y 30ºC\n\nCorriga el valor");
					return;
				}

			    var rco2 = residualCO2(temp);
			    var gco2 = volumeCO2 - rco2;
			    
			    if (gco2 <= 0) {
			    	alert("Los volúmenes de CO2 residuales ya son superiores a los volúmenes deseados.\n\nCO2 residual: " + round(rco2,1));
			    	return;
			    }

				var label = "";
                var result = "";

				if (ingredient == "dme") {
					label = " gr de extracto de malta en polvo.";
					result = ((gco2 / 0.5) * volume) / (0.5 * 0.82 * 0.80);
				} else {
					var prate = 15.195; //Para el azucar
					label = " gr de azúcar";
					if (ingredient == "dextrose") {
						prate = 17.475;
						label = " gr de dextrosa";
					}
					result = prate * (volume / 3.7854) * gco2; // https://www.homebrewersassociation.org/attachments/0000/2497/Math_in_Mash_SummerZym95.pdf
				}
				
				document.getElementById("primingResultValue").innerHTML = round(result, 0) + label + " (" + round(result / volume, 1) + " gr/l)";
				
				
			}	
				
			function primingCalcClear()
			{
				document.primingTool.volumeCO2.value = "";
				document.primingTool.volume.value = "";
				document.primingTool.temp.value = "";
			}
			
			function residualCO2(temp) {

			    temp = temp * 1.8 + 32; //Para el calculo de la temperatura residual se usa ºF
			    return 3.0378
			        - 5.0062e-2 * temp
			        + 2.6555e-4 * temp * temp;
			}
			
			// ****************************************************************************************************
			
			function residualCacl() {
				
				if (!check(document.residualTool.temp, "Temperatura de la cerveza")) return;	
				
				var temp = parseFloatEx(document.residualTool.temp.value);
				
				if (temp < 0 || temp > 30) {
					alert("La temperatura tiene que estar entre 0ºC y 30ºC\n\nCorriga el valor");
					return;
				}
				
				var rco2 = residualCO2(temp);
				
				document.getElementById("residualResultValue").innerHTML = parseFloat(rco2).toFixed(2);

			}
			
			function residualCalcClear() {
				document.residualTool.temp.value = "";
			}
			
			// ****************************************************************************************************
			
			function volumesCalc() {

				var valueType = document.volumesTool.valueType.value;
				var label = "Presión en bares";
				if (valueType == "volumes") label = "Volúmenes de CO2 deseados";

				if (!check(document.volumesTool.valueInput, label)) return;
				if (!check(document.volumesTool.temp, "Temperatura de la cerveza")) return;	
				
				var valueInput = parseFloatEx(document.volumesTool.valueInput.value);
				var Tbeer = parseFloatEx(document.volumesTool.temp.value);
				
				
			    var T = -10.73797+(2617.25/(Tbeer+273.15));				
				var result = 0;

				if (valueType == "bar") {
					Phead = valueInput;
					result = (Phead + 1.013) * Math.exp(T) * 10;		
			    	result = result / 2;	
			
				} else {
					Cbeer = valueInput * 2;
			    	result = (Cbeer  / (Math.exp(T) * 10)) - 1.013;	
			
				} 

			    label = "Volúmenes de CO2: ";
				if (valueType == "volumes") label = "Presión en bares:";

			    document.getElementById("volumesResultValue").innerHTML = parseFloat(result).toFixed(2);
			    document.getElementById("volumesResultLabel").innerHTML = label;
			}
			
			function volumesCalcClear() {
				document.volumesTool.temp.value = "";
				document.volumesTool.valueInput.value = "";
				onChangeType();
			}
			
			function onChangeType() {
				var valueType = document.volumesTool.valueType.value;
				if (valueType == "bar") {
					document.volumesTool.valueInput.setAttribute('placeholder', "Ej: 0.5");
				} else {
					document.volumesTool.valueInput.setAttribute('placeholder', "Ej: 2.2");
				}
			}
			
			// ****************************************************************************************************
			
			function check(input, text)
			{
			    if (input.value.length == 0 || isNaN(input.value.toString().replace(",",".")))
			    {
			        alert("El valor de [" + text + "] no es correcto.");
			        input.focus();    
			        input.select();   
			        return false;
			    }
			    return true;
			}
			    
			function round(number, off)
			{
			    i=Math.pow(10,off)
			    return (Math.round(number*i)/i).toFixed(off).replace(".", ",");
			}
			
			function parseFloatEx(value)
			{
				return parseFloat(value.toString().replace(",","."));
			}
