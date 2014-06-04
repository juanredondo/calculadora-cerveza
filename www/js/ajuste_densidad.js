        	/**
			 * @author Raul Hevia Casielles
			 */
			
			function densityCalc() 
			{
				var option = document.densityTool.ingredient.value;
				
				if (option == "sugar") {
					sugarCalc();
				} else {
					extractCalc();
				}
			}

			function sugarCalc()
			{
				if (!check(document.densityTool.DO, "Densidad actual")) return;
				if (!check(document.densityTool.DF, "Densidad objetivo")) return;
				if (!check(document.densityTool.volume, "Volumen en litros")) return;
				
				var DO = parseFloatEx(document.densityTool.DO.value);
				var DF = parseFloatEx(document.densityTool.DF.value);
				var volume = parseFloatEx(document.densityTool.volume.value);
				
				if (DO.toString().indexOf(".") != -1) DO = DO.toFixed(3).toString().replace(".","");
				if (DF.toString().indexOf(".") != -1) DF = DF.toFixed(3).toString().replace(".","");
				
				
				DO = parseFloat(DO) / 1000;
				DF = parseFloat(DF) / 1000;
			
			
				var bi = 261.3 * (1 - (1 / DO));
				var bf = 261.3 * (1 - (1 / DF));
				
				
				var sugar = (volume * DO * (bf - bi)) / (100 - bf);
				
				document.getElementById("labelValue").innerHTML = "Añadir azucar:"
				document.getElementById("calcValue").innerHTML = (parseFloat(sugar).toFixed(3) * 1000) + " gr";
				
				
			}	
			
			function extractCalc()
			{
				if (!check(document.densityTool.DO, "Densidad actual")) return;
				if (!check(document.densityTool.DF, "Densidad objetivo")) return;
				if (!check(document.densityTool.volume, "Volumen en litros")) return;
				
				var DO = parseFloatEx(document.densityTool.DO.value);
				var DF = parseFloatEx(document.densityTool.DF.value);
				var volume = parseFloatEx(document.densityTool.volume.value);
				
				if (DO.toString().indexOf(".") != -1) DO = DO.toFixed(3).toString().replace(".","");
				if (DF.toString().indexOf(".") != -1) DF = DF.toFixed(3).toString().replace(".","");
				
				
				DO = parseFloat(DO) - 1000;
				DF = parseFloat(DF) - 1000;
				
				var ppg = 0.367; //Puntos de densidad de extracto en polvo por gramo y litro (36 punts de densidad por libra en galon de agua)
				var label = "extracto en polvo:";
				if (document.densityTool.ingredient.value == "lme") {
					label = "extracto líquido:";
					ppg = 0.3; //Puntos de densidad de extracto liquido por gramo y litro (44 puntos de densidad por libra en galon de agua)
				}
				
				var extract = (volume * (DF - DO)) / ppg;
				
				document.getElementById("labelValue").innerHTML = "Añadir " + label;
				document.getElementById("calcValue").innerHTML = parseFloat(extract).toFixed(0) + " gr";
					
			}	
				
			
			function densityCalcClear()
			{
				document.densityTool.DO.value = "";
			    document.densityTool.DF.value = "";
			    document.densityTool.volume.value = "";
			    document.getElementById("labelValue").innerHTML = "";
			    document.densityTool.DO.focus();
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
