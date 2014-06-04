        	/**
			 * @author Raul Hevia Casielles
			 */
			
			//window.onload = populateGrainSeleccion;
         //addLoadEvent(populateGrainSeleccion);
			
 
			
			function dilutionCalc()
			{		
				if (!check(document.dilutionTool.DO, "Densidad actual")) return;
				if (!check(document.dilutionTool.DF, "Densidad objetivo")) return;
				if (!check(document.dilutionTool.volume, "Volumen en litros")) return;	
				
				var DO = parseFloatEx(document.dilutionTool.DO.value);
				var DF = parseFloatEx(document.dilutionTool.DF.value);
				var volume = parseFloatEx(document.dilutionTool.volume.value);
				
				if (DO.toString().indexOf(".") != -1) DO = DO.toFixed(3).toString().replace(".","");
				if (DF.toString().indexOf(".") != -1) DF = DF.toFixed(3).toString().replace(".","");
						
				DO = parseFloat(DO) - 1000;
				DF = parseFloat(DF) - 1000;

				var water = ((DO * volume) / DF) - volume;
				
				document.getElementById("dilutionCalcValue").innerHTML = parseFloat(water).toFixed(3) + " L";
				
				
			}	
				
			function dilutionCalcClear()
			{
				document.densityTool.DO.value = "";
			    document.densityTool.DF.value = "";
			    document.densityTool.Volume.value = "";
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
