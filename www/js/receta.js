			/**
			 * @author Raul Hevia Casielles
			 */

			var grainList;
			var numGrain = 8;
			var textPlain = "";
			var textForum = "";

			function grainVO(name, ep, weight, percent) {
				this.name = name;
				this.ep = ep;
				this.weight = weight;
				this.percent = percent;
			}

			function populateGrainSeleccion() {
				writeGrainSelection();

				var options = ["", "", "Malta Pale", "80", "Malta Pilsen", "80", "Malta Crystal 120 EBC", "74", "Malta Chocolate 900 EBC", "65", "Malta Black 1000 EBC", "60", "Malta de Trigo", "84", "Malta Munich 16 EBC", "80", "Malta Ámbar 70 EBC", "70", "Copos de Maíz", "86", "Copos de Cebada", "70", "Azúcares", "100", "Otro", ""];

				for(var i = 0; i < (options.length / 2); i++) {
					for(var j = 1; j <= numGrain; j++) {
						document.getElementById("grain" + j).options[i] = new Option(options[i * 2], options[(i * 2) + 1]);
					}
				}
			}

			function writeGrainSelection() {
				var grainSelection = "<tr><td></td><td>Ingrediente</td><td><nobr>Extracto (%)</nobr></td><td><nobr>Porcentaje (%)</nobr></td><td><nobr>Peso (Kg)</nobr></td></tr>";

				for(var i = 1; i <= numGrain; i++) {
					grainSelection += "<tr><td><nobr>" + i + "</nobr></td><td><select id='grain" + i + "' name = 'grain" + i + "' onchange='onGrainOptionChange(this);'></select></td>" + "<td><input type='text' name = 'extract" + i + "' style='width: 50px' /></td>" + "<td><input type='text' class='option' name = 'percent" + i + "' style='width: 50px' /></td>" + "<td><input type='text' class='option' name = 'weight" + i + "' style='width: 70px' /></td></tr>";

				}
				$("#grainTable").empty();
				$("#grainTable").append(grainSelection);
			}

			function onGrainOptionChange(option) {
				var index = option.name.substring(5);
				document.recipeTool.elements["extract" + index].value = option.value;
				document.recipeTool.elements["weight" + index].value = "";
				document.recipeTool.elements["percent" + index].value = "";
				if(document.recipeTool.elements["extract" + index].value.length == 0)
					document.recipeTool.elements["extract" + index].focus();
				else
					document.recipeTool.elements["percent" + index].focus();
			}

			function recipeCalc() {
				var calculateMalt = true;

				if(!check(document.recipeTool.volume, "Volumen inicial en litros"))
					return;
				if(!check(document.recipeTool.efficiency, "Rendimiento del equipo (%)"))
					return;
				//if (!check(document.recipeTool.boilTime, "Tiempo de hervido (minuos)")) return;
				//if (!check(document.recipeTool.boilEvap, "Perdida por evaporación en una hora (litros)")) return;

				if(!getGrainValues())
					return;

				calculateGrainPercent();

				var efficiency = parseFloatEx(document.recipeTool.efficiency.value);
				var volume = parseFloatEx(document.recipeTool.volume.value);
				var boilTime = parseFloatEx(document.recipeTool.boilTime.value);
				var boilEvap = parseFloatEx(document.recipeTool.boilEvap.value);
				var og = parseFloatEx(document.recipeTool.hydrometer.value);
				var mashRel = parseFloatEx(document.recipeTool.mash.value);
				var volumePreBoil = "";
				var ig = "";

				if(isNumber(grainList[0].weight)) {
					if(og.length == 0 || isNaN(og)) {
						og = calculateOG(efficiency, volume);
						calculateMalt = false;
					}
				}

				if(og.toString().indexOf('.') != -1)
					og = og * 1000;
				og = round(og, 0);

				if(isNumber(boilEvap) && isNumber(boilTime)) {
					//Volumen antes de hervir
					volumePreBoil = volume + boilEvap * (boilTime / 60);
					//Densidad antes de hervir
					ig = (og * volume + 1000 * (volumePreBoil - volume)) / volumePreBoil;
				}
				//Extracto necesario (gr/L)
				var eg = og * (259 - (259000 / og)) / 100;
				//Extracto necesario (Kg)
				var ek = volume * eg / (efficiency / 100) / 1000;
				//Calcular pesos de las maltas
				if(calculateMalt)
					calculateMaltWeight(ek);
				//Calcular peso total de las maltas
				var totalWeight = getTotalMaltWeight();

				//Calcular macerado si se ha indicado relacion de empaste
				var mashVolume = "";
				var mashBatchVolume = "";
				var spargeVolume = "";
				var totalWater = "";
				
				if(isNumber(mashRel)) {
					mashVolume = totalWeight * mashRel;
					mashBatchVolume = totalWeight * (mashRel + 0.67);
					spargeVolume = volumePreBoil + (totalWeight * 1.08) - mashVolume;
					totalWater = mashVolume + spargeVolume;
					mashVolume = round(mashVolume, 1);
					mashBatchVolume = round(mashBatchVolume, 1);
					spargeVolume = round(spargeVolume, 1);
					totalWater = round(totalWater, 1);
				}

				writeMaltResult(totalWeight);
				writeMashResult(mashVolume, mashBatchVolume, spargeVolume, totalWater);
				writeBoilResult(volumePreBoil, ig);
				writeFerResult(volume, og);

				setResultsVisible(true);
				
				setCopyText(totalWeight, mashVolume, mashBatchVolume, spargeVolume, totalWater, volumePreBoil, ig, volume, og);
			}

			function recipeCalcClear() {
				document.recipeTool.hydrometer.value = "";
				document.recipeTool.volume.value = "";
				document.recipeTool.efficiency.value = "";
				document.recipeTool.mash.value = "";
				document.recipeTool.boilTime.value = "";
				document.recipeTool.boilEvap.value = "";

				for(var i = 1; i <= 8; i++) {
					eval("document.recipeTool.grain" + i).selectedIndex = 0;
					eval("document.recipeTool.extract" + i).value = "";
					eval("document.recipeTool.weight" + i).value = "";
					eval("document.recipeTool.percent" + i).value = "";
				}
			}

			function writeMaltResult(totalWeight) {
				var table = "";

				table += "<tr><td><b>Ingrediente</b></td><td><b>Porcentaje(%)</b></td><td><b>Peso (kg)</b></td></tr>";

				for(var i = 0; i < grainList.length; i++) {
					table += "<tr><td>" + grainList[i].name + "</td>" + "<td>" + grainList[i].percent + "</td>" + "<td>" + round(grainList[i].weight, 2) + "</td></tr>";
				}

				table += "<tr></tr><tr><td><b>Total:</b></td><td>&nbsp;</td><td>" + round(totalWeight, 3) + "</td></tr>";

				$("#maltResult").empty();
				$("#maltResult").append(table);
			}

			function writeMashResult(mashVolume, mashBatchVolume, spargeVolume, totalWater) {
				if(isNumber(mashVolume)) {
					table = writeTr("Agua para el macerado:", mashVolume + " litros.");
					table += writeTr("Volumen que ocupara el macerado:", mashBatchVolume + " litros.");
					table += writeTr("Agua para el lavado:", spargeVolume + " litros.");
					table += writeTr("Agua total necesaria:", totalWater + " litros.");
				} else {
					table = writeTr("Sin datos", "Debe indicar la relación de empaste.")
				}

				$("#mashResult").empty();
				$("#mashResult").append(table);
			}

			function writeBoilResult(volumePreBoil, ig) {
				if(isNumber(volumePreBoil)) {
					table = writeTr("Volumen de mosto en olla:", round(volumePreBoil, 1) + " litros.");
					table += writeTr("Densidad antes de hervir:", round(ig, 0));
				} else {
					table = writeTr("Sin datos", "Debe indicar evaporación y tiempo de hervido.");
				}

				$("#boilResult").empty();
				$("#boilResult").append(table);
			}

			function writeFerResult(volume, og) {
				table = writeTr("Volumen inicial:", round(volume, 1) + " litros.");
				table += writeTr("Densidad inicial:", round(og, 0));

				$("#ferResult").empty();
				$("#ferResult").append(table);
			}

			function writeTr(label, value) {
				return "<tr><td><b>" + label + "</b></td><td>" + value + "</td></tr>";
			}

			function getTotalMaltWeight() {
				var w = 0;
				for(var i = 0; i < grainList.length; i++) {
					w += grainList[i].weight;
				}
				return w;
			}

			function calculateMaltWeight(ek) {
				for(var i = 0; i < grainList.length; i++) {
					var w = (ek * grainList[i].percent) / grainList[i].ep;
					grainList[i].weight = w;
				}
			}

			function calculateOG(efficiency, volume) {
				var et = 0;

				for(var i = 0; i < grainList.length; i++) {
					et += ((grainList[i].weight * 1000) * (grainList[i].ep / 100) * (efficiency / 100));
				}

				var c = et / volume;
				var og = (0.3838 * c) + 1000;
				return round(og, 0);
			}

			function getGrainValues() {
				var numWeight = 0;
				var numPercent = 0;

				grainList = new Array();

				for(var i = 1; i <= numGrain; i++) {
					var name = getSelectedText("grain" + i);
					var ep = parseFloatEx(eval("document.recipeTool.extract" + i).value);
					var weight = parseFloatEx(eval("document.recipeTool.weight" + i).value);
					var percent = parseFloatEx(eval("document.recipeTool.percent" + i).value);

					if(ep.length != 0 && !isNaN(ep) && ((weight.length != 0 && !isNaN(weight)) || (percent.length != 0 && !isNaN(percent)) )) {
						grainList[grainList.length] = new grainVO(name, ep, weight, percent);
						if(weight.length != 0 && !isNaN(weight))
							numWeight++;
						if(percent.length != 0 && !isNaN(percent))
							numPercent++;
					}
				}

				if(grainList.length == 0) {
					alert("Debe indicar almenos un ingrediente para realizar el cálculo");
					return false;
				}

				if(numPercent > 0 && numWeight > 0) {
					alert("Para todos los ingredientes debe indicar o porcentajes o pesos, no es posible una mezcla de datos.");
					return false;
				}

				var og = parseFloatEx(document.recipeTool.hydrometer.value);

				if(numWeight == 0 && (og.length == 0 || isNaN(og))) {
					alert("Si la cantidad se indica en porcentajes la densidad inicial es un dato necesario para realizar el cálculo.");
					return;
				}

				var totalPercent = 0;

				if(numPercent > 0) {
					for(var i = 0; i < grainList.length; i++) {
						totalPercent += parseFloatEx(grainList[i].percent);
					}
					if(totalPercent != 100) {
						alert("La suma de los porcentajes de los ingredientes debe de ser el 100% [Suma = " + totalPercent + "]");
						return false;
					}
				}

				return true;
			}

			function calculateGrainPercent() {

				if(grainList[0].percent.length == 0 || isNaN(grainList[0].percent)) {
					var totalWeight = 0;

					for(var i = 0; i < grainList.length; i++) {
						totalWeight += grainList[i].weight;
					}

					for(var i = 0; i < grainList.length; i++) {
						grainList[i].percent = round((grainList[i].weight * 100) / totalWeight, 0);
					}
				}

			}

			function getSelectedText(elementId) {
				var elt = document.getElementById(elementId);

				if(elt.selectedIndex == -1)
					return null;

				return elt.options[elt.selectedIndex].text;
			}

			function getPotential(index) {
				var extract = document.efficiencyTool.elements["extract" + index].value.replace(",", ".");
				var weight = document.efficiencyTool.elements["weight" + index].value.replace(",", ".");

				if(extract.length == 0 || isNaN(extract) || weight.length == 0 || isNaN(weight))
					return 0;

				return parseFloat(weight) * (parseFloat(extract) / 100);
			}

			function getWeight(index) {
				var weight = document.efficiencyTool.elements["weight" + index].value.replace(",", ".");

				if(weight.length == 0 || isNaN(weight))
					return 0;
				return parseFloat(weight);
			}

			function check(input, text) {
				if(input.value.length == 0 || isNaN(input.value.toString().replace(",", "."))) {
					alert("El valor de [" + text + "] no es correcto.");
					input.focus();
					input.select();
					return false;
				}
				return true;
			}

			function round(number, off) {
				i = Math.pow(10, off)
				return (Math.round(number * i) / i).toFixed(off).replace(".", ",");
			}

			function parseFloatEx(value) {
				if(!isNumber(value))
					return "";

				return parseFloat(value.toString().replace(",", "."));
			}

			function getPlato(density) {
				return 260 - (260 / parseFloatEx(density));
			}

			function setResultsVisible(visible) {
				if(visible) {
					$("#fade").removeClass('invisible').addClass('fadeMe');
					$("#results").removeClass('invisible').addClass('visible');
				} else {
					$("#fade").removeClass('fadeMe').addClass('invisible');
					$("#results").removeClass('visible').addClass('invisible');
				}
			}

			function setHelpVisible(visible) {
				if(visible) {
					$("#fade").removeClass('invisible').addClass('fadeMe');
					$("#help").removeClass('invisible').addClass('help');
				} else {
					$("#fade").removeClass('fadeMe').addClass('invisible');
					$("#help").removeClass('visible').addClass('invisible');
				}
			}

			function isNumber(value) {
				value = value.toString().replace(",", ".");
				return value.toString().length != 0 && !isNaN(value);
			}

			function setFormTextVisible(visible, text) {
				if(visible) {
					$("#results").removeClass('visible').addClass('invisible');
					$("#formtext").removeClass('invisible').addClass('formtext');
					$("#copytext").text(eval(text));
					$("#copytext").focus();
					$("#copytext").select();
				} else {
					$("#results").removeClass('invisible').addClass('visible');
					$("#formtext").removeClass('formtext').addClass('invisible');
				}				
			}
			
			function setCopyText(totalWeight, mashVolume, mashBatchVolume, spargeVolume, totalWater, volumePreBoil, ig, volume, og)
			{
				var rt = "\r\n";
				
				textPlain = "> Ingredientes" + rt + rt;
				
				for (var i = 0; i < grainList.length; i++) 
				{
					textPlain += round(grainList[i].weight, 2) + " Kg    (" + grainList[i].percent + "%) " + grainList[i].name + rt;
				}
				
				textPlain += "----------------------" + rt;
				textPlain += "Total: " + round(totalWeight, 2) + " Kg" + rt;
				
				if (isNumber(mashVolume)) 
				{
					textPlain += rt + "> Macerado" + rt + rt;
					
					textPlain += "Agua para el macerado:  " + mashVolume + " litros." + rt;
					textPlain += "Volumen que ocupara el macerado:  " + mashBatchVolume + " litros." + rt;
					textPlain += "Agua para el lavado:  " + spargeVolume + " litros." + rt;
					textPlain += "Agua total necesaria:  " + totalWater + " litros." + rt;
				}
				
				if(isNumber(volumePreBoil)) 
				{
					textPlain += rt + "> Olla hervido" + rt + rt;
					
					textPlain += "Volumen de mosto en olla:  " + round(volumePreBoil, 1) + " litros." + rt;
					textPlain += "Densidad antes de hervir:  " + round(ig, 0) + rt;
				}
				
				textPlain += rt + "> Fermentador" + rt + rt;
					
				textPlain += "Volumen inicial:  " + round(volume, 1) + " litros." + rt;
				textPlain += "Densidad inicial:  " + round(og, 0);			
			}
