        	/**
			 * @author Raul Hevia Casielles
			 */  
			function populateHopSeleccion()
			{	
				var options = ["Flor","1",
				               "Pellets", "1.10"];
				
				for (var i = 0; i < (options.length / 2); i++)
				{
					document.bitterTool.hop1.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.bitterTool.hop2.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.bitterTool.hop3.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.bitterTool.hop4.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.bitterTool.hop5.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
				}
			}
			
			
			function calcBitter() {

				var totalIbu = 0;

				checkNumber(document.bitterTool.hydrometer);
				checkNumber(document.bitterTool.volume);

				if (!check(document.bitterTool.hydrometer, "Lectura densidad original")) return;
				if (!check(document.bitterTool.volume, "Volumen en litros finales")) return;
				var volume = document.bitterTool.volume.value;
				for (var index = 1; index < 6; index++) {
				
					var U = calcUtilization(index);

					checkNumber(document.bitterTool.elements["alpha" + index]);
					checkNumber(document.bitterTool.elements["weight" + index]);
					checkNumber(document.bitterTool.elements["ibu" + index]);

					var alpha = document.bitterTool.elements["alpha" + index].value;
					var weight = document.bitterTool.elements["weight" + index].value;
					var ibu = document.bitterTool.elements["ibu" + index].value;
				
					if (alpha.length != 0 && (weight.length != 0 || ibu.length != 0) && U > 0) {
						if (weight.length != 0) {
							ibu = U * (weight * (alpha / 100) * 1000) / volume;
							document.bitterTool.elements["ibu" + index].value = round(ibu,1);
						} else {
							weight = (ibu * volume) / (U * (alpha / 100) * 1000);
							document.bitterTool.elements["weight" + index].value = round(weight,1);
						}
					} else {
						ibu = "";
						document.bitterTool.elements["ibu" + index].value = ibu;
					}

					if (ibu.length != 0) {
						totalIbu = parseFloat(totalIbu) + parseFloat(ibu);
					} 
				}
				
				document.getElementById("bitterResult").innerHTML = round(totalIbu,1);
			}
			
			function clearCalcBitter() {
				document.bitterTool.hydrometer.value = "";
				document.bitterTool.volume.value = "";
				
				for (var i = 1; i < 6; i++) {
					document.bitterTool.elements["alpha" + i].value = "";
					document.bitterTool.elements["weight" + i].value = "";
					document.bitterTool.elements["time" + i].value = "";
					document.bitterTool.elements["ibu" + i].value = "";
				}
				
				document.getElementById("bitterResult").innerHTML = "";
			}
			
			
			function calcUtilization(index) {
				
				var hydrometer = parseFloatEx(document.bitterTool.hydrometer.value);
				if (hydrometer.toString().indexOf('.') == -1) hydrometer = hydrometer / 1000;
				checkNumber(document.bitterTool.elements["time" + index]);
				var time = document.bitterTool.elements["time" + index].value;
				
				if (time.length == 0 || parseFloat(time) == 0) return 0; //Si no hay tiempo no habrá cálculo de IBU's
				time = parseFloatEx(time);
		
				var fg = 1.65 * Math.pow(0.000125, hydrometer - 1);
				
				var ft = (1 - Math.exp(-0.04 * time)) / 4.15;
				
				var U = (fg * ft) * parseFloat(document.bitterTool.elements["hop" + index].value);
				
				return U;
                
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
			    
			function round(number, off)
			{
			    i=Math.pow(10,off)
			    return (Math.round(number*i)/i).toFixed(off);
			}
			
			function parseFloatEx(value)
			{
				return parseFloat(value.toString().replace(",","."));
			}
			
			function checkNumber(input) {
				input.value = parseFloatEx(input.value);
				if(input.value == null ||          
				   input.value.length == 0 ||
				   input.value == "NaN" ||
				   input.value <= 0) {
				        input.value = "";
				}
				//calcBitter();
			}

			function checkAlpha(input) {
				input.value = parseFloatEx(input.value);
				if(input.value == null ||          
				   input.value.length == 0 ||
				   input.value == "NaN" ||
				   input.value <= 0 || 
				   input.value > 100) {
				        input.value = "";
				}
				//calcBitter();
			}
