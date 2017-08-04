function add_employe(){
	loading('#btn-add');
	if(Name.value == ""){
		alert("Introduzca el nombre del usuario");
	}else{
		var data_addemploye = $("#form_addemploye").serialize();
		ajax('/administrador/control_cuentas/add_employe',data_addemploye,'#btn-add',false,function(res){
			console.log(res);
			messageu = "";
			if(res.result && res.user){
				user = res.user;
				type = null
				switch(user[2]){
					case 2:
						type = "Ventas";
					break;
					case 3:
						type = "Productor";
					break;
					case 4:
						type = "Locutor";
					break;
				}
				messageu = '<div class="alert alert-success alert-dismissible" role="alert">'+
							'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
								'<span aria-hidden="true">&times;</span>'+
							'</button>'+
							'<strong>Advertencia: </strong>'+
							res.result+
						'</div>';
				/*html = '<tr class="info">'+
						'<td>'+user[1]+'</td>'+
						'<td>'+type+'</td>'+
						'<td>'+user[3]+'</td>'+
						'<td>'+user[4]+'</td>'+
						'<td>---</td>'+
						'<td><a href="#" onclick="employe_rd('+"'"+user[0]+"'"+',0);"><span class="icon-user-minus"></span>Desabilitar</a></td>'+
						'<td><a href="#" data-toggle="modal" data-target="#modalupdate" onclick="view_employe('+"'"+user[0]+"'"+','+"'"+user[1]+"'"+');"><span class="icon-pencil2">Modificar</span></a></td>'+
						'<td><a href="#" onclick="recovery('+"'"+user[0]+"'"+')"><span class="icon-key2">Resetear contraseña</span></a></td>'+
						'<tr>';*/
				message("#message",messageu);
				reset_form("#form_addemploye");
				//add_DOM("#user",html);
				$(location).attr('href','/administrador/control_cuentas/'+user[0]+'/pdf');
			}else{
				alert(res);
			}
		});
	}
}
function view_employe(id,name,type,level,dataeliminate){
	$("#btn-update").unbind("click");
	reset_form("#form_update");
	if(type == "Ventas") type=2;
	if(type == "Productor") type=3;
	if(type == "Locutor") type=4;

	$("#Name_update").val(name);
	$("#deparment_update").val(type);
	$("#level_update").val(level);
	$("#Expire_update").val(dataeliminate);

	$("#btn-update").bind("click",function(){
		loading("#btn-update");
		var datae = $("#form_update").serialize();
		datae = datae+"&ide="+id;
		if(Name_update.value == ""){
			alert("Introduzca el nuevo nombre del empleado");
		}else{
			var datae = $("#form_update").serialize();
			datae = datae+"&ide="+id;
			ajax('/administrador/control_cuentas/update_employe',datae,'#btn-update',false,function(res){
				console.log(res);
				messageu = null;
				if(res.result == 'correct'){
					messageu = '<div class="alert alert-success alert-dismissible" role="alert">'+
								'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
									'<span aria-hidden="true">&times;</span>'+
								'</button>'+
								'<strong>Exito: </strong>se actualizo la informacion del empleado'+
							'</div>';
					message("#messageupdate",messageu);
				}else{
					alert(res);
				}
			});
		}
	});
}
function employe_rd(id,status){
	var message = "";
	if(status == 0){
		message = "desactivar";
	}else{
		message = "habilitar";
	}
	if(confirm("¿Seguro que deseas "+message+" esta cuenta?,")){
		data="status="+status+"&ide="+id;
		$.ajax({url:'/administrador/control_cuentas/employe_rd',
				type:'POST',
				data:data}).done(function(res){
				alert(res);
		});
	}
}
function employeReset(id){
	if(confirm("¿Seguro que deseas reiniciar la contraseña de la cuenta?")){
		data="idEmploye="+id;
		ajax('/administrador/control_cuentas/reset',data,null,true,function(response){
			$(location).attr('href','/administrador/control_cuentas/'+id+'/pdf');
			alert(response);
		});
	}
}