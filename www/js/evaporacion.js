        	/**
			 * @author Raul Hevia Casielles
			 */

			function evaporationCalc() {
				
				if (!check(document.evaporationTool.density1, "Densidad inicial")) return;
				if (!check(document.evaporationTool.volume, "Volumen inicial")) return;
				if (!check(document.evaporationTool.timeValue, "Tiempo hervido")) return;
				if (!check(document.evaporationTool.timeValue, "Tiempo hervido")) return;
				
				
				var density1 = parseFloatEx(document.evaporationTool.density1.value);
				var volume = parseFloatEx(document.evaporationTool.volume.value);
				var timeValue = parseFloatEx(document.evaporationTool.timeValue.value);
				var density2 = parseFloatEx(document.evaporationTool.density2.value);
				

				
				if (density1.toString().indexOf(".") != -1) density1 = density1.toFixed(3).toString().replace(".","")
     			density1 = parseFloat(density1) - 1000;
				if (density2.toString().indexOf(".") != -1) density2 = density2.toFixed(3).toString().replace(".","")
				density2 = parseFloat(density2) - 1000;
				
				var endVolume = (density1 * volume) / density2;
				var lostVolume = volume - endVolume;
				var lostMinute = (lostVolume / timeValue);
				var lostHour = lostMinute * 60;
				            
				document.getElementById("evaporationResult").innerHTML = round(lostHour, 2)  + "  L/h";
            document.getElementById("volumeEevaporationResult").innerHTML = round(endVolume, 1) + "L";
			}
			
			function evaporationCalcClear() {
				document.evaporationTool.density1.value = "";
				document.evaporationTool.volume.value = "";
				document.evaporationTool.timeValue.value = "";
				document.evaporationTool.density2.value = "";
				document.getElementById("evaporationResult").innerHTML = "";
			}
	
			function initialCalc() {

				if (!check(document.initialTool.density, "Densidad después de hervir")) return;
				if (!check(document.initialTool.volume, "Volumen después de hervir")) return;
				if (!check(document.initialTool.timeValue, "Tiempo hervido")) return;
				if (!check(document.initialTool.evaporation, "Perdida de volumen en l/h")) return;

				var density = parseFloatEx(document.initialTool.density.value);
				var volume = parseFloatEx(document.initialTool.volume.value);
				var timeValue = parseFloatEx(document.initialTool.timeValue.value);
				var evaporation = parseFloatEx(document.initialTool.evaporation.value);

				if (density.toString().indexOf(".") != -1) density = density.toFixed(3).toString().replace(".","")
     			density = parseFloat(density) - 1000;

     			var initialVolume = volume + ((evaporation * timeValue) / 60);
     			var initialDensity = (volume * density) / initialVolume;

 				document.getElementById("densityResult").innerHTML = parseFloat(1000 + initialDensity).toFixed(0);
 				document.getElementById("volumeResult").innerHTML = round(initialVolume, 2) + "L";
			}
			
			function initialCalcClear() {
				document.initialTool.density.value = "";
				document.initialTool.volume.value = "";
				document.initialTool.timeValue.value = "";
				document.initialTool.evaporation.value = "";
			}
	
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
			     
			function CalculateTempCorrection(temp)
			{   
			    return 1 - (temp + 288.9414) / (508929.2 * (temp + 68.12963)) * Math.pow(temp - 3.9863, 2);
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
			
			function round(number, off)
			{
			    i=Math.pow(10,off)
			    return (Math.round(number*i)/i).toFixed(off).replace(".", ",");
			}
			
			function getPlato(density)
			{
				return 260 - (260 / parseFloatEx(density));
			}
