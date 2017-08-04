var month = [];
	month[0]="Enero";
	month[1]="Febrero";
	month[2]="Marzo";
	month[3]="Abril";
	month[4]="Mayo";
	month[5]="Junio";
	month[6]="Julio";
	month[7]="Agosto";
	month[8]="Semptimbre";
	month[9]="Octubre";
	month[10]="Noviembre";
	month[11]="Diciembre";

function historial(id_cartridge){
	div_empty("#historyCartridge");
	data = "id_cartridge="+id_cartridge;
	ajax('/cartridge/get_history',data,null,true,function(response){
		if(response.info){
			console.log(response.info);
			console.log(response.data);
			info = response.info;
			cartridge = response.data;
			state = "";
			if(info[0].in_use == 0){
				state = "Disponible";
			}else{
				state = "En uso";
			}
			date_day = info[0].date_day;
			time_day = info[0].time_day;
			date = new Date(date_day+" "+time_day);
			final = date.getDate()+" "+month[date.getMonth()]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
			$("#num").val(info[0].number_day);
			$("#dateCreate").val(final);
			$("#state").val(state);
			html = '<table class="table table-bordered table-striped table-hover"><thead><tr class="success"><th>Creado por(ventas)</th><th>Para(productor)</th><th>Tipo</th><th>Nombre cartucho</th><th>Fecha de validación</th><th>Serie</th><th>Fecha de actualización</th></tr></thead>';
			for(i in cartridge){
				html += '<tr>'+
							'<td>'+cartridge[i].sale+'</td>'+
							'<td>'+cartridge[i].producer+'</td>'+
							'<td>'+cartridge[i].type_c+'</td>'+
							'<td>'+cartridge[i].name_c+'</td>'+
							'<td>'+cartridge[i].validity+'</td>'+
							'<td>'+cartridge[i].serie+'</td>'+
							'<td>'+cartridge[i].date_create+'</td>'+
						'</tr>';
			}
			html += '</table>';
			add_DOM("#historyCartridge",html);
		}else{
			alert(response);
		}
	});
}
function searchCartridgebyserie(serie){
	data = "serie="+serie;
	ajax('/cartridge/getByserie',data,null,false,function(response){
		if(response.cartridges){
			console.log(response.cartridges);
			cartridges = response.cartridges;
			html = '<table class="table table-bordered table-striped table-hover"><thead><tr class="success"><th>Num.</th><th>Tipo</th><th>Concepto</th><th>Fecha de validació</th><th>Serie</th><th>Acciones</th></tr></thead><tbody>';
			for(i in cartridges){
				html += '<tr>'+
					'<td>'+cartridges[i].number_day+'</td>'+
					'<td>'+cartridges[i].type_c+'</td>'+
					'<td>'+cartridges[i].name_c+'</td>'+
					'<td>'+cartridges[i].validity+'</td>'+
					'<td>'+cartridges[i].serie+'</td>'+
					'<td><a href="#" onclick="this_cartridge('+"'"+cartridges[i].id_control+"','"+cartridges[i].number_day+"','"+cartridges[i].type_c+"','"+cartridges[i].name_c+"','"+cartridges[i].validity+"','"+cartridges[i].serie+"'"+');"><span class="icon-pushpin"></span> Marcar</a>'+
					'</td></tr>';
			}
			html += '</tbody></table>';
			div_empty("#resultSearch");
			add_DOM("#resultSearch",html);
		}else{
			alert(response);
		}
	});
}
function informationSpot(idSpot){
	div_empty("#spotData");
	data = "id_spot="+idSpot;
	ajax('/spot/getInformation',data,null,false,function(response){
		if(response.information){
			console.log(response.information);
			console.log(response.data);
			console.log(response.recorded);
			information = response.information;
			cartridges = response.data;
			recorded = response.recorded;
			priority = "";
			if(information[0].priority == 1){
				priority = "Normal";
			}else{
				priority = "Urgente";
			}

			$("#datestart").val(information[0].date_start);
			$("#type").val(information[0].type);
			$("#priority").val(priority);
			$("#duration").val(information[0].duration);
			if(recorded.length == 0){
				$("#announcer").val("Cualquiera disponible");
			}else{
				$("#announcer").val(recorded[0].name_employe);
			}
			$("#music").val(information[0].type_music);
			$("#note").val(information[0].note);
			html = "";
			for(i in cartridges){
				var text = cartridges[i].idea;
				var rExp = /[^A-Za-z0-9]/gi;
				var contar_espacios = text.replace(rExp, " ");
				var libres = contar_espacios + " ";
				var contador_palabras = null
				do {
					var antigua_cadena = libres;
					libres = libres.replace("  ", " ");
				} while(antigua_cadena != libres);
					var juntar_cadenas = libres.split(" ");
					contador_palabras = juntar_cadenas.length -1;
				if (text.length <1) {
					contador_palabras = 0;
				}
				html += '<div class="panel panel-default">'+
							'<div class="panel-heading">'+cartridges[i].number_day+' | '+cartridges[i].type_c+'_'+cartridges[i].name_c+'_'+cartridges[i].validity+' | '+cartridges[i].serie+'</div>'+
							'<div class="panel-body">'+
								cartridges[i].idea+
  							'</div>'+
  							'<div class="panel-footer">'+contador_palabras+' palabra(s)</div>'
						'</div>';
			}
			add_DOM("#spotData",html);
		}else{
			alert(response);
		}
	});
}
function informationEvent(idEvent){
	div_empty("#formDate");
	div_empty("#resource");
	div_empty("#announcers");
	data = "id_event="+idEvent;
	ajax('/event/getInformation',data,null,true,function(response){
		if(response.contact){
			console.log(response.contact);
			console.log(response.dates);
			console.log(response.data);
			console.log(response.resources);
			console.log(response.announcers);
			contact = response.contact;
			dates = response.dates;
			data = response.data;
			resources = response.resources;
			announcers = response.announcers;
			$("#name").val(contact[0].name_employe);
			$("#name_event").val(contact[0].name_event);
			$("#orderedby").val(contact[0].ordered_by);
			$("#contact").val(contact[0].contact);
			$("#phone").val(contact[0].phone_contact);
			$("#address").val(contact[0].address_event);
			$("#palce").val(contact[0].place_installation);
			htmldates = "";
			for(i in dates){
				htmldates +='<div class="alert alert-default">'+
            	'<button class="close" data-dismiss="alert">'+
            	'<span>&times;</span>'+
            	'</button>'+
            	'<div class="form-group">'+
            	'<label for="date" class="control-label col-xs-1">Dia</label>'+
            	'<div class="col-xs-3">'+
            	'<input type="date" name="date[]" value="'+dates[i].date_event+'" class="form-control"/>'+
            	'</div>'+
            	'<label for="time_s" class="control-label col-xs-1">de</label>'+
            	'<div class="col-xs-2">'+
            	'<input type="time" name="time_s[]" value="'+dates[i].time_start+'" class="form-control"/>'+
            	'</div>'+
            	'<label for="time_f" class="control-label col-xs-1"> a</label>'+
            	'<div class="col-xs-2">'+
            	'<input type="time" name="time_f[]" value="'+dates[i].time_final+'" class="form-control"/></div>'+
            	'</div>'+
            	'</div>';
			}
			add_DOM("#formDate",htmldates);
			$("#support").val(data[0].support);
			$("#commercial").val(data[0].commercial);
			$("#form").val(data[0].form);
			$("#observations").val(data[0].observations);
			htmlresources = "";
			for(i in resources){
				htmlresources +='<div class="alert alert-default">'+
						'<button class="close" data-dismiss="alert"><span>&times;</span></button>'+
						'<div class="form-group">'+
						'<label for="titulo" class="control-label col-xs-5">Recurso :</label>'+
						'<div class="col-xs-5">'+
						'<input type="text" name="resource[]" value="'+resources[i].resoucer+'">'+
						'</div>'+
						'</div>'+
						'</div>';
			}
			add_DOM("#resource",htmlresources);
			htmlannouncers = "";
			for(i in announcers){
				htmlannouncers +='<div class="alert alert-default">'+
							'<button class="close" data-dismiss="alert"><span>&times;</span></button>'+
							'<div class="form-group">'+
								'<label for="titulo" class="control-label col-xs-5">Locutor :</label>'+
								'<div class="col-xs-5">'+
									'<input type="text" value="'+announcers[i].name_employe+'">'+
								'</div>'+
							'</div>'+
						'</div>';
			}
			add_DOM("#announcers",htmlannouncers);
		}else{
			alert(response);
		}
	});
}
function informationBinnacle(idBinnacle){
	div_empty("#material");
	div_empty("#lapsed");
	reset_form("#form_control");
	reset_form("#resource");
	data = "id_binnacle="+idBinnacle;
	ajax('/binnacle/getInformation',data,null,true,function(response){
		if(response.control){
			console.log(response.control);
			console.log(response.material);
			console.log(response.lapsed);
			console.log(response.comment);
			control = response.control;
			material = response.material;
			lapsed = response.lapsed;
			comment = response.comment;
			$("#name").val(control[0].name_employe);
			$("#date").val(control[0].date);
			$("#times").val(control[0].start_time);
			$("#timef").val(control[0].final_time);
			htmlmaterial = '<ul class="list-group">';
			for(i in material){
				htmlmaterial += '<li class="list-group-item">'+material[i].requirement+'</li>';
			}
			htmlmaterial += '</ul>';
			add_DOM("#material",htmlmaterial);
			htmllapsed = '<ul class="list-group">';
			for(i in lapsed){
				htmllapsed += '<li class="list-group-item">'+lapsed[i].number_day+' | '+lapsed[i].type_c+'_'+lapsed[i].name_c+'_'+lapsed[i].validity+' | '+lapsed[i].serie+'</li>';
			}
			htmllapsed += '<ul class="list-group">';
			add_DOM("#lapsed",htmllapsed);
			if(!comment[0]){

			}else{
				$("#note").val(comment[0].comment);
			}
		}else{
			alert(response);
		}
	});
}
function downLoadEvent(idEvent){
	$(location).attr('href','http://localhost:8000/event/'+idEvent);
}
function downLoadSpot(idSpot){
	$(location).attr('href','http://localhost:8000/spot/'+idSpot);
}
function downLoadBinnacle(idBinnacle){
	$(location).attr('href','http://localhost:8000/binnacle/'+idBinnacle);
}