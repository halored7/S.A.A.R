function add_cartridge(){
	if(concept.value == "" || datev.value == "" || serie.value == ""){
		alert("Complete el formulario");
	}else{
		var data_addc = $("#form_addcartridge").serialize();
		ajax('/ventas/control_cartuchos/add_cartridge',data_addc,'#btn-addbcartridge',null,function(response){
			if(response.result == 'error'){
				alert = alert_message("e",response.message);
			}else if(response.result == 'correct'){
				alert = alert_message("c",response.message);
				reset_form("#form_addcartridge");
			}
			message("#message",alert);
			data_addc = "";
			alert = "";
			
		});
	}
}
function update_cartridge(id,type,concept,datev,serie,producer){
	reset_form("#form_upcartridge");
	$("#type_up").val(type);
	$("#concept_up").val(concept);
	$("#datev_up").val(datev);
	$("#serie_up").val(serie);
	$("#producer_up").val(producer);
	$("#btn-upcartridge").bind("click",function(){
		if(concept.value == "" || datev.value == "" || serie.value == "" || producer_up.value == ""){
			alert("Complete el formulario");
		}else{
			var data_addc = $("#form_upcartridge").serialize();
			data_addc +="&id_c="+id;
			ajax('/ventas/control_cartuchos/update_cartridge',data_addc,"#btn-upcartridge",null,function(response){
				if(response.result == 'error'){
					alert = alert_message("e",response.message);
				}else if(response.result == 'correct'){
					alert = alert_message("c",response.message);
					reset_form("#form_upcartridge");
				}
				message("#messageup",alert);
				$("#btn-upcartridge").unbind("click");
			});
		}
	});
}
function delete_cartridge(idc){
	if(confirm("¿Seguro que deseas eliminar este cartucho?,")){
		data="id_c="+idc;
		ajax('/ventas/control_cartuchos/delete_cartridge',data,null,null,function(response){
			alert(response);
		});
	}
}
function new_version(num,date){
	if(num.value == "" || date.value == ""){
		alert("La operacion no puede ser completada");
	}else{
		$("#btn-cartridgenewv").bind("click",function(){
			var data = $("#form_cartridgenewv").serialize();
			data += "&num="+num+"&datec="+date;
			ajax('/ventas/control_cartuchos/new_version',data,'#btn-cartridgenewv',null,function(response){
				if(response.result == 'error'){
					alert = alert_message("e",response.message);
				}else if(response.result == 'correct'){
					alert = alert_message("c",response.message);
					reset_form("#form_cartridgenewv");
				}
				message("#messagenewv",alert);
				$("#btn-cartridgenewv").unbind("click");
				data = "";
			});
		});
	}
}