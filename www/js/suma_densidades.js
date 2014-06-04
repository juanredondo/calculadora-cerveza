        	/**
			 * @author Raul Hevia Casielles
			 */  
			 
			function calcSum() {
				var totalPoints = 0;
				var totalVolume = 0;
				
				for (var i = 1; i < 5; i++) {
					var density = parseFloatEx(document.sumTool.elements["density" + i].value);
					var volume = parseFloatEx(document.sumTool.elements["volume" + i].value);
					if (density != 0 && volume != 0) {

						if (density.toString().indexOf('.') != -1) density = (density - 1) * 1000;
					    density = density - 1000; 
						totalPoints += (density * volume);
						totalVolume += volume;
					}
				}
				
				if (totalPoints != 0 && totalVolume != 0) {
					var density = parseFloat(round(totalPoints / totalVolume, 0)) + 1000;
					document.getElementById("volumeResult").innerHTML = totalVolume + " L";
					document.getElementById("densityResult").innerHTML = density;
				} else {
					document.getElementById("volumeResult").innerHTML = "";
					document.getElementById("densityResult").innerHTML = ""
				}
				

			}
			
	
			
			function clearCalcSum() {
				document.getElementById("volumeResult").innerHTML = "";
				document.getElementById("densityResult").innerHTML = ""
				
				for (var i = 1; i < 5; i++) {
					document.sumTool.elements["density" + i].value = "";
					document.sumTool.elements["volume" + i].value = "";
				}
			}
					
		 
			function round(number, off)
			{
			    i=Math.pow(10,off)
			    return (Math.round(number*i)/i).toFixed(off);
			}
			
			function parseFloatEx(value)
			{
				if (value.length == 0 || isNaN(value.toString().replace(",","."))) {
					return 0;
				}
				return parseFloat(value.toString().replace(",","."));
			}
