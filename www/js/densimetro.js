        	/**
			 * @author Raul Hevia Casielles
			 */
			
			//window.onload = populateGrainSeleccion;
         //addLoadEvent(populateGrainSeleccion);
			
         function addLoadEvent(func) {
            var oldonload = window.onload;
            if (typeof window.onload != 'function') {
               window.onload = func;
            } 
            else {
               window.onload = function() {
                  if (oldonload) {
                     oldonload();
                  }
                  func();
              }
            }
         }
         
			function hydrometerCorrection()
			{            
			    if (!check(document.hydrometerTool.hydrometer, "Lectura densidad")) return;
			    if (!check(document.hydrometerTool.temp, "Temperatura")) return;
			    if (!check(document.hydrometerTool.cTemp, "Temperatura ajuste densimetro")) return;
			    
			    var hydrometer = parseFloatEx(document.hydrometerTool.hydrometer.value);
			    if (hydrometer.toString().indexOf('.') == -1) hydrometer = hydrometer / 1000;
			    var temp = parseFloatEx (document.hydrometerTool.temp.value);
			    var correctionTemp = parseFloatEx(document.hydrometerTool.cTemp.value);        
			    
			    var value = round(hydrometer + ((CalculateTempCorrection(correctionTemp) / CalculateTempCorrection(temp)) - 1), 3);
			    document.getElementById("hydrometerCorrectionValue").innerHTML = value;
			    document.hydrometerTool.hydrometer.focus();
			    document.hydrometerTool.hydrometer.select();
			}
			
			function hydrometerCorrectionClear()
			{
			    document.hydrometerTool.hydrometer.value = "";
			    document.hydrometerTool.temp.value = "";
			    document.hydrometerTool.hydrometer.focus();
			}
			
			function strikeCalc()
			{
				if (!check(document.strikeTool.thick, "Litros de agua por Kg de grano")) return;
				if (!check(document.strikeTool.strtemp, "Temperatura objetivo del macerado")) return;
				if (!check(document.strikeTool.grntemp, "Temperatura del grano")) return;
				
				var thick = parseFloatEx(document.strikeTool.thick.value);
				var strtemp = parseFloatEx(document.strikeTool.strtemp.value);
				var grntemp = parseFloatEx(document.strikeTool.grntemp.value);
				
				var strikeTemp = strtemp + .4 * (strtemp - grntemp) / thick + 1.7;
				
				document.getElementById("strikeCalcValue").innerHTML = round(strikeTemp, 1) + " ºC";
			}
			
			function strikeCalcClear()
			{
				document.strikeTool.thick.value = "";
				document.strikeTool.strtemp.value = "";
				document.strikeTool.grntemp.value = "";
				document.strikeTool.thick.focus();
			}
			
			function restCalc()
			{
				if (!check(document.restTool.weight, "Peso del grano en Kg")) return;
				if (!check(document.restTool.thick, "Litros de agua por Kg de grano")) return;
				if (!check(document.restTool.curtemp, "Temperatura actual")) return;
			    if (!check(document.restTool.tartemp, "Temperatura objetivo")) return;
				
				var weight = parseFloatEx(document.restTool.weight.value);
				var thick = parseFloatEx(document.restTool.thick.value);
				var curtemp = parseFloatEx(document.restTool.curtemp.value);
				var tartemp = parseFloatEx(document.restTool.tartemp.value);
				
				var strikeTemp = (weight *  (.4 + thick)) * (tartemp - curtemp) / (100 - tartemp);
				
				document.getElementById("restCalcValue").innerHTML = round(strikeTemp, 1);
			}
			
			function restCalcClear()
			{
				document.restTool.weight.value = "";
				document.restTool.thick.value = "";
				document.restTool.curtemp.value = "";
				document.restTool.tartemp.value = "";
				document.restTool.weight.focus();
			}
			
			function mashVolCalc()
			{
				if (!check(document.mashVolTool.weight, "Peso del grano en Kg")) return;
				if (!check(document.mashVolTool.thick, "Litros de agua por Kg de grano")) return;
				
				var weight = parseFloatEx(document.mashVolTool.weight.value);
				var thick = parseFloatEx(document.mashVolTool.thick.value);
				
				var vol = weight * (.67 + thick);
				
				document.getElementById("mashVolCalcValue").innerHTML = round(vol, 2) + " L";
			}
			
			function mashVolCalcClear()
			{
				document.mashVolTool.weight.value = "";
				document.mashVolTool.thick.value = "";
			
				document.mashVolTool.weight.focus();
			}
			
			function alcoholCalc()
			{
				if (!check(document.alcoholTool.DO, "Densidad inicial")) return;
				if (!check(document.alcoholTool.DF, "Densidad final")) return;
				
				var DO = parseFloatEx(document.alcoholTool.DO.value);
				var DF = parseFloatEx(document.alcoholTool.DF.value);
			
				if (DO.toString().indexOf(".") != -1) DO = DO.toFixed(3).toString().replace(".","");
				if (DF.toString().indexOf(".") != -1) DF = DF.toFixed(3).toString().replace(".","");
			
				var alcohol = (DO - DF) / 7.4;
				
				DO = parseFloat(DO.toString().substring(2));
				DF = parseFloat(DF.toString().substring(2));
				
				var attenuation = ((DO - DF) / DO) * 100;
				
				document.getElementById("alcoholCalcValue").innerHTML = round(alcohol,2) + " %";
				document.getElementById("attenuationCalcValue").innerHTML = round(attenuation, 2) + " %";
			}
			
			function alcoholCalcClear()
			{
				document.alcoholTool.DO.value = "";
				document.alcoholTool.DF.value = "";
			
				document.alcoholTool.DO.focus();
			}
			
			function platoCalc1()
			{
				if (!check(document.platoTool.density, "Peso Específico (Densidad)")) return;
				var density = parseFloatEx(document.platoTool.density.value);
				if (density.toString().indexOf('.') == -1) density = density / 1000;
				var plato = 260 - (260 / density);
				document.platoTool.plato.value = round(plato, 2);
			}
			
			function platoCalc2()
			{
				if (!check(document.platoTool.plato, "Grados Plato")) return;
				var plato = parseFloatEx(document.platoTool.plato.value);
				
				var density = 260 / (260 - plato);
				
				document.platoTool.density.value = round(density, 3);
			}
			         
			function populateGrainSeleccion()
			{	
				var options = ["","",
				               "Malta Pale", "80", 
							   "Malta Pilsen", "80", 
							   "Malta Crystal 120 EBC", "74",
							   "Malta Chocolate 900 EBC", "65",
							   "Malta Black 1000 EBC", "60",
							   "Malta de Trigo", "84",
							   "Malta Munich 16 EBC", "80",
							   "Malta Ámbar 70 EBC", "70",
							   "Copos de Maíz", "86",
							   "Copos de Cebada", "70",
							   "Azúcares", "100"];
				
				for (var i = 0; i < (options.length / 2); i++)
				{
					document.efficiencyTool.grain1.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.efficiencyTool.grain2.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.efficiencyTool.grain3.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.efficiencyTool.grain4.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.efficiencyTool.grain5.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.efficiencyTool.grain6.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.efficiencyTool.grain7.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
					document.efficiencyTool.grain8.options[i] = new Option(options[i * 2], options[(i*2) + 1]);
				}
			}
			
			function onGrainOptionChange(option)
			{
				var index = option.name.substring(5);
				document.efficiencyTool.elements["extract" + index].value = option.value;
				document.efficiencyTool.elements["weight" + index].value = "";
				if (document.efficiencyTool.elements["extract" + index].value.length == 0) 
					document.efficiencyTool.elements["extract" + index].focus();
				else
					document.efficiencyTool.elements["weight" + index].focus();
			}
			
			function efficiencyCalc()
			{
				if (!check(document.efficiencyTool.hydrometer, "Lectura densidad")) return;
				if (!check(document.efficiencyTool.volume, "Volumen en litros")) return;
				
				var hydrometer = parseFloatEx(document.efficiencyTool.hydrometer.value);
				var volume = parseFloatEx(document.efficiencyTool.volume.value);
				var potential = 0;
				var weight = 0;
				
				if (hydrometer.toString().indexOf('.') == -1) hydrometer = hydrometer / 1000;
				
				for (var i = 1; i <= 8; i++)
				{
					potential += getPotential(i); 
					weight += getWeight(i);
				}
				
				if (weight == 0)
				{
					alert("Debe indicar las cantidades de grano para realizar el cálculo.");
					return;
				}
				
				if (potential == 0)
				{
					alert("Falta el extracto potencial del grano para realizar el cálculo.");
					return;
				}
				
				var extract = ((hydrometer * getPlato(hydrometer) * 10) * volume) / 1000;
				var gross = (100 * extract) / weight;
				var net = (100 * extract) / potential;
				
				document.getElementById("efficiencyExtract").innerHTML = round(extract, 3) + " kg";
				document.getElementById("efficiencyGross").innerHTML = round(gross, 2) + " %";
				document.getElementById("efficiencyNet").innerHTML = round(net, 2) + " %";
			}
			
			function efficiencyCalcClear()
			{
				document.efficiencyTool.hydrometer.value = "";
				document.efficiencyTool.volume.value = "";
				
				for (var i = 1; i <= 8; i++)
				{
					eval("document.efficiencyTool.grain" + i).selectedIndex = 0;
					eval("document.efficiencyTool.extract" + i).value = "";
					eval("document.efficiencyTool.weight" + i).value = "";
				}
			}
			
			function sugarCalc()
			{
				if (!check(document.sugarTool.DO, "Densidad actual")) return;
				if (!check(document.sugarTool.DF, "Densidad objetivo")) return;
				if (!check(document.sugarTool.volume, "Volumen en litros")) return;
				
				var DO = parseFloatEx(document.sugarTool.DO.value);
				var DF = parseFloatEx(document.sugarTool.DF.value);
				var volume = parseFloatEx(document.sugarTool.volume.value);
				
				if (DO.toString().indexOf(".") != -1) DO = DO.toFixed(3).toString().replace(".","");
				if (DF.toString().indexOf(".") != -1) DF = DF.toFixed(3).toString().replace(".","");
				
				
				DO = parseFloat(DO) / 1000;
				DF = parseFloat(DF) / 1000;
			
			
				var bi = 261.3 * (1 - (1 / DO));
				var bf = 261.3 * (1 - (1 / DF));
				
				
				var sugar = (volume * DO * (bf - bi)) / (100 - bf);
				
				document.getElementById("sugarCalcValue").innerHTML = (parseFloat(sugar).toFixed(3) * 1000) + " gr";
				
				
			}	
				
			
			function sugarCalcClear()
			{
				
			}
			
			function getPotential(index)
			{
				var extract = document.efficiencyTool.elements["extract" + index].value.replace(",",".");
				var weight = document.efficiencyTool.elements["weight" + index].value.replace(",",".");
			
				
				if (extract.length == 0 || isNaN(extract) || weight.length == 0 || isNaN(weight)) return 0;
				
				return parseFloat(weight) * (parseFloat(extract) / 100);
			}
			
			function getWeight(index)
			{
				var weight = document.efficiencyTool.elements["weight" + index].value.replace(",",".");
			
				if (weight.length == 0 || isNaN(weight)) return 0;
				return parseFloat(weight);
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
			
			
			function getPlato(density)
			{
				return 260 - (260 / parseFloatEx(density));
			}

			