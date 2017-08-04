function preview(id_spot){
	div_empty("#contenedorcartridge");
	div_empty("#date");
	data = "id_spot="+id_spot;
	ajax('/productor/control_spot/getSpot',data,null,true,function(response){
		if(response.cartridges && response.data){
			cartridges = response.cartridges;
			data = response.data[0];
			recorded = response.recorded;
			htmlserie = "";
			htmlidea = "";
			var mes=new Array();
			mes[0]="Enero";
			mes[1]="Febrero";
			mes[2]="Marzo";
			mes[3]="Abril";
			mes[4]="Mayo";
			mes[5]="Junio";
			mes[6]="Julio";
			mes[7]="Agosto";
			mes[8]="Semptimbre";
			mes[9]="Octubre";
			mes[10]="Noviembre";
			mes[11]="Diciembre";
			date = new Date(data.date_start+" 00:00:00");
			var m=mes[date.getMonth()];
			final = date.getDate()+" "+m+" "+date.getFullYear();
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
			priority = "";
			if(data.priority == 0){
				priority = "Normal";
			}else{
				priority = "Urgente"
			}
			$("#type").val(data.type);
			add_DOM("#date","Iniciá: "+final);
			$('#priority').val(priority);
			$("#duration").val(data.duration);
			$("#music").val(data.type_music);
			if(recorded.length == 0){
				$("#recorded").val("Cualquiera disponible");
			}else{
				$("#recorded").val(recorded[0].name_employe);
			}
			add_DOM("#contenedorcartridge",html);
		}else{
			$("#spotdata").modal("hide");
			alert(response);
		}
	});
}
function check(id_spot,serie){
	if(confirm("¿Seguro que deseas reportar este informe de Spot como terminado?, Se enviara una notificacion a Ventas sobre el trabajo realizadó")){
		data = "id_spot="+id_spot;
		ajax('/productor/control_spot/finished',data,null,false,function(response){
			if(response.status){
				socket.emit('finishSpot', "Spot "+serie);
			}else{
				alert(response);
			}
		});
	}
}