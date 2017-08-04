function binnacle_add(){
	loading('#btn-addbinnacle');
	if(Name_r.value == ""){
		alert("Introduzca el requisito");
	}else{
		var data_addb = $("#form_addbinnacle").serialize();
		$.ajax({
			url: '/administrador/control_bitacora/add_binnacle',
			type: 'POST',
			data: data_addb
		})
		.done(function(response){
			loading_stop('#btn-addbinnacle');
			alert = "";
			if(response.result == 'error'){
				alert = '<div class="alert alert-danger alert-dismissible" role="alert">'+
							'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
								'<span aria-hidden="true">&times;</span>'+
							'</button>'+
							'<strong>Advertencia: </strong> ocurrio un problema al actualizar el nombre del requisito'+
						'</div>';
			}else if(response.result == 'correct'){
				alert = '<div class="alert alert-success alert-dismissible" role="alert">'+
							'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
								'<span aria-hidden="true">&times;</span>'+
							'</button>'+
							'<strong>Exito: </strong> se actualizo correctamente el nombre del requisito'+
						'</div>';
				reset_form("#form_addbinnacle");
			}else{
				alert = '<div class="alert alert-danger alert-dismissible" role="alert">'+
							'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
								'<span aria-hidden="true">&times;</span>'+
							'</button>'+
							'<strong>Error: </strong> No se pudo completar la operacion'+
						'</div>';
			}
			message("#messagebinnacle",alert);
		});
	}
}
function binnacle_update(id,requirement){
	reset_form("#form_updatebinnacle");
	$("#Name_rupdate").val(requirement);
	$("#btn-updatebinnacle").bind("click",function(){
		loading("#btn-updatebinnacle");
		var datab = $("#form_updatebinnacle").serialize();
		datab = datab+"&idb="+id;
		alert(datab);
		if(Name_rupdate.value == ""){
			alert("Introduzca el requisito");
		}else{
			$.ajax({
				url: '/administrador/control_bitacora/update_binnacle',
				type: 'POST',
				data: datab
			})
			.done(function(response){
				loading_stop('#btn-updatebinnacle');
				if(response.result == 'correct'){
					alert = '<div class="alert alert-success alert-dismissible" role="alert">'+
								'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
									'<span aria-hidden="true">&times;</span>'+
								'</button>'+
								'<strong>Exito: </strong>se actualizo el nombre del requisito'+
							'</div>';
				}else if(response.result == 'error'){
					alert = '<div class="alert alert-danger alert-dismissible" role="alert">'+
								'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
									'<span aria-hidden="true">&times;</span>'+
								'</button>'+
								'<strong>Advertencia: </strong> ocurrio un problema al actualizar los datos'+
							'</div>';
				}
				message("#messageupdate",alert);
			});
		}
		$("#btn-updatebinnacle").unbind("click");
	});
}
function binnacle_rd(id, status){
	var message = "";
	if(status == 0){
		message = "desactivar";
	}else{
		message = "habilitar";
	}
	if(confirm("¿Seguro que deseas "+message+" este requisito?,")){
		data="status="+status+"&idb="+id;
		alert(data);
		$.ajax({url:'/administrador/control_bitacora/ed_binnacle',
				type:'POST',
				data:data}).done(function(res){
				alert(res);
		});
	}
}