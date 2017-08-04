function notificationEvent(){
	div_empty("#tables");
	div_empty("#titleModal");
	ajax('/notification/event','',null,true,function(response){
		if(response.event){
			event = response.event;
			html = '<table class="table table-bordered table-striped table-hover"><thead>'+
					'<tr class="success"><th>Nombre del evento</th><th>Información del solicitante</th>'+
					'<th>Próximo evento</th><th>Dirección del evento</th><th>Responsable</th>'+
					'<th>Acciones</th></tr></thead><tbody>';
			for(i in event){
				html += '<tr>'+
							'<td>'+event[i].name_event+'</td>'+
							'<td>'+event[i].contact+' '+event[i].phone_contact+'</td>'+
							'<td>'+event[i].date+'</td>'+
							'<td>'+event[i].address_event+'</td>'+
							'<td>'+event[i].name_employe+'</td>'+
							'<td><a href="#" onclick="downLoadEvent('+"'"+event[i].id_event+"'"+');"><span class="icon-file-pdf">&nbsp;Descargar informe</span></a></td>'+
						'</tr>';
			}
			html += '</table>';
			add_DOM("#tables",html);
			add_DOM("#titleModal","Eventos activos");
		}else{
			$.notify({
				title: "<strong>Upps:</strong> ",
				message: ""+response
			});
		}
	});
}
function notificationComplaint(){
	div_empty("#tables");
	div_empty("#titleModal");
	ajax('/notification/complaint','',null,true,function(response){
		if(response.complaint){
			console.log(response.complaint);
			complaint = response.complaint;
			html = '<table class="table table-bordered table-striped table-hover"><thead>'+
					'<tr><th>No.</th><th>Mensaje</th><th>Acciones</th></tr></thead><tbody>';
			n = 1;
			for(i in complaint){
				html += '<tr>'+
							'<td>'+n+'</td>'+
							'<td>'+complaint[i].description+'</td>'+
							'<td><a href="#" onclick="deleteComplaint('+"'"+complaint[i].id_complaint+"'"+');"><span class="icon-bin">&nbsp;Eliminar</span></a></td>'+
						'</tr>';
				n++;
			}
			html += '</table>';
			add_DOM("#tables",html);
			add_DOM("#titleModal","buzon de quejas");
		}else{
			$.notify({
				title: "<strong>Upps:</strong> ",
				message: ""+response
			});
		}
	});
}
function notificationAlert(){
	div_empty("#tables");
	div_empty("#titleModal");
	ajax('/notification/alert','',null,true,function(response){
		if(response.reports){
			console.log(response.reports);
			row = response.reports;
			html = '<table class="table table-bordered table-striped table-hover"><thead>'+
					'<tr><th>Reportado por</th><th>Reporte</th><th>Fecha de reporte</th><th>Acciones</th></tr></thead><tbody>';
			for(i in row){
				html += '<tr>'+
							'<td>'+row[i].name_employe+'</td>'+
							'<td>'+row[i].description+'</td>'+
							'<td>'+row[i].date+"_"+row[i].time+'</td>'+
							'<td><a href="#"><span class="icon-bin">&nbsp;</span></a></td>'+
						'</tr>';
			}
			html += '</table>';
			add_DOM("#tables",html);
			add_DOM("#titleModal","Reportes");
		}else{
			$.notify({
				title: "<strong>Upps:</strong> ",
				message: ""+response
			});
		}
	});
}
function notificationBinnacle(){
	div_empty("#reportBinnacle");
	div_empty("#titleModal");
	ajax('/notification/binnacle','',null,true,function(response){
		if(response.binnacles){
			console.log(response.binnacles);
			binnacles = response.binnacles;
			html = '<table class="table table-bordered table-striped table-hover"><thead>'+
					'<tr><th>Reporte de</th><th>Fecha</th><th>Hora de inició</th><th>Hora de cierre</th><th>Acciones</th></tr></thead><tbody>';
			for(i in binnacles){
				html += '<tr>'+
							'<td>'+binnacles[i].name_employe+'</td>'+
							'<td>'+binnacles[i].date+'</td>'+
							'<td>'+binnacles[i].start_time+'</td>'+
							'<td>'+binnacles[i].final_time+'</td>'+
							'<td><a href="#" onclick="downLoadBinnacle('+"'"+binnacles[i].id_control+"'"+');"><span class="icon-file-pdf">&nbsp;Descargar informe</span></a></td>'+
						'</tr>';
			}
			html += '</table>';
			add_DOM("#reportBinnacle",html);
		}else{
			$.notify({
				title: "<strong>Upps:</strong> ",
				message: ""+response
			});
		}
	});
}
function reports(){
	notificationBinnacle();
}
function deleteComplaint(idComplaint){
	if(confirm("¿Seguro que deseas eliminar este queja?,")){
		data = "idComplaint="+idComplaint;
		ajax('/administrador/deleteComplaint',data,null,true,function(response){
			alert(response);
		});
	}
}