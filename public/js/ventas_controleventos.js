function add_resource(name,to){
	html = '<div class="alert alert-default">'+
				'<button class="close" data-dismiss="alert"><span>&times;</span></button>'+
				'<div class="form-group">'+
					'<label for="titulo" class="control-label col-xs-5">Recurso :</label>'+
					'<div class="col-xs-5">'+
						'<input type="text" name="'+name+'">'+
					'</div>'+
				'</div>'+
			'</div>';
	add_DOM(to,html);
} 
function add_announcer(name,to){
	ajax('/ventas/control_eventos/getAllannouncers',data,null,true,function(response){
		if(response.announcers){
			console.log(response.announcers);
			result = response.announcers;
			option = ""
			for(i in result){
				option += '<option value="'+result[i].id_employe+'">' +result[i].name_employe +'</option>';
			}
			html = '<div class="alert alert-default">'+
						'<button class="close" data-dismiss="alert">'+
							'<span>&times;</span>'+
						'</button>'+
						'<div class="form-group">'+
							'<label for="cartridge" class="control-label col-xs-5">'+
							'Locutor:</label>'+
							'<div class="col-xs-5">'+
								'<select name="'+name+'" class="form-control">'+option+
								'</select>'+
							'</div>'+
						'</div>'+
					'</div>';
			add_DOM(to,html);
		}else{
			alert(response);
		}
	});
}
function add_date(to){
	html = '<div class="alert alert-default">'+
            	'<button class="close" data-dismiss="alert">'+
            		'<span>&times;</span>'+
            	'</button>'+
            	
	            	'<div class="form-group">'+
	            		'<label for="date" class="control-label col-xs-1">Dia</label>'+
	            		'<div class="col-xs-3">'+
	            			'<input type="date" name="date[]" class="form-control"/>'+
	            		'</div>'+
	            	
	            		'<label for="time_s" class="control-label col-xs-1">de</label>'+
	            		'<div class="col-xs-2">'+
	            			'<input type="time" name="time_s[]" class="form-control"/>'+
	            		'</div>'+
	            
	            		'<label for="time_s" class="control-label col-xs-1">a</label>'+
	            		'<div class="col-xs-2">'+
	            			'<input type="time" name="time_f[]" class="form-control"/>'+
	            		'</div>'+
	            	'</div>'+

            '</div>';
    add_DOM(to,html);
}
function resource_for_update(){
	add_resource("up_resource[]","#containerResource");
}
function resource_for_new(){
	add_resource("resource[]","#containerResourceadd")
}
function announcer_for_update(){
	add_announcer("up_announcers[]","#containerAnnouncers");
}
function announcer_for_new(){
	add_announcer("announcer[]","#containerAnnouncersadd")
}
function date_for_new(){
	add_date("#containerdateadd");
}
function date_for_update(){
	add_date("#containerdate");
}
function getContact(id_event){
	data = null;
	reset_form("#form_update_contact");
	$("#update_contact").unbind("click");
	data = "id_event="+id_event
	ajax('/ventas/control_eventos/getContact',data,null,true,function(response){
		if(response.error){
			alert(response.error);
			$("#eventContactupdate").modal("hide");
		}else if(response.contact){
			result = response.contact
			$("#up_name_event").val(result[0].name_event);
			$("#up_orderedby").val(result[0].ordered_by);
			$("#up_contact").val(result[0].contact);
			$("#up_phone").val(result[0].phone_contact);
			$("#up_address").val(result[0].address_event);
			$("#up_palce").val(result[0].place_installation);
			$("#update_contact").bind("click",function(weq){
				concact = null;
				concatc = "id_event="+id_event+"&"+$("#form_update_contact").serialize();
				ajax('/ventas/control_eventos/update_contact',concatc,"update_contact",false,function(response){
					if(response.status){
						if(response.status == 1){
							alert("No tienes los permisos necesarios para realizar esta operación");
						}else if(response.status == 2){
							alert("Se actualizaron los datos");
						}
					}else{
						alert(response);
					}
				});
			});
		}else{
			alert("Ocurrio un error desconocido");
		}
		data = null;
	});
}
function getDate(id_event){
	data = null;
	div_empty("#containerdate");
	$("#update_date").unbind("click");
	data = "id_event="+id_event;
	ajax('/ventas/control_eventos/getDate',data,null,true,function(response){
		if(response.error){
			alert(response.error);
		}else if(response.dates){
			dates = response.dates
			html = ""
			for(i in dates){
				html +='<div class="alert alert-default">'+
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
			add_DOM("#containerdate",html);
			$("#update_date").bind("click",function(weq){
				var update = "";
				update += "id_event="+id_event+"&"+$("#form_update_date").serialize();
				alert(update);
				ajax('/ventas/control_eventos/update_date',update,"update_date",false,function(response){
					if(response.status){
						alert(response.status+" "+response.message);
					}else{
						alert(response);
					}
				});
			});
		}else{
			alert("Ocurrio un problema inesperado");
		}
	});
}
function getData(id_event){
	data = null;
	data = "id_event="+id_event;
	$("#update_data").unbind("click");
	ajax('/ventas/control_eventos/getData',data,null,true,function(response){
		statuss = null
		statussf = null
		c = null
		if(response.error){
			alert(response.error);
			$("#update_data").modal("hide");
		}else if(response.data){
			console.log(response.data)
			result = response.data
			if(result[0].commercial == 1){
				statuss = true;
				c = false
			}else{
				statuss = false
				c = true
			}
			if(result[0].form){
				statussf = true
			}else{
				statussf = false;
			}
			$("#up_support").val(result[0].support);
			$('#up_commercial').bootstrapSwitch('state',statuss);
			$('#up_form').bootstrapSwitch('state',statussf);
			$('#up_form').bootstrapSwitch('disabled',c);
			$("#up_observations").val(result[0].observations);
			$("#update_data").bind("click",function(weq){
				update = null;
				update = "id_event="+id_event+"&"+$("#form_update_data").serialize();
				ajax('/ventas/control_eventos/update_data',update,"update_data",false,function(response){
					if(response.status){
						if(response.status == 1){
							alert("No tienes los permisos necesarios para realizar esta operación")
						}else if(response.status == 2){
							alert("Se actualizarón los datos")
						}
					}else{
						alert(response);
					}
				});
			});
		}else{
			alert("Ocurrio un error desconocido");
		}
		data = null;
	});
}
function getResources(id_event){
	div_empty("#containerResource");
	data = null;
	$("#update_resource").unbind("click");
	data = "id_event="+id_event;
	ajax('/ventas/control_eventos/getResource',data,null,true,function(response){
		console.log(response);
		if(response.error){
			alert(response.error);
		}else if(response.resources){
			results = response.resources
			html = ""
			for(i in results){
				html +='<div class="alert alert-default">'+
						'<button class="close" data-dismiss="alert"><span>&times;</span></button>'+
						'<div class="form-group">'+
						'<label for="titulo" class="control-label col-xs-5">Recurso :</label>'+
						'<div class="col-xs-5">'+
						'<input type="text" name="up_resource[]" value="'+results[i].resoucer+'">'+
						'</div>'+
						'</div>'+
						'</div>';
			}
			add_DOM("#containerResource",html);
			$("#update_resource").bind("click",function(weq){
				update = null;
				update = "id_event="+id_event+"&"+$("#form_update_resource").serialize();
				ajax('/ventas/control_eventos/update_resources',update,"update_resource",false,function(response){
					if(response.status){
						alert(response.status+" "+response.message);
					}else{
						alert(response)
					}
				});
			});
		}else{
			alert("Ocurrio un problema inesperado");
		}
		data = null;
	});
}
function getAnnouncers(id_event){
	div_empty("#containerAnnouncers");
	data = null;
	data = "id_event="+id_event;
	$("#update_announcers").unbind("click");
	ajax('/ventas/control_eventos/getAnnouncers',data,null,true,function(response){
		console.log(response);
		if(response.error){
			alert(response.error);
		}else if(response.announcers){
			results = response.announcers
			html = ""
			for(i in results){
				html +='<div class="alert alert-default">'+
							'<button class="close" data-dismiss="alert"><span>&times;</span></button>'+
							'<div class="form-group">'+
								'<label for="titulo" class="control-label col-xs-5">Locutor :</label>'+
								'<div class="col-xs-5">'+
									'<select name="up_announcers[]" class="form-control">'+
										'<option value="'+results[i].id_employe+'">'+results[i].name_employe+
									'</select>'+
								'</div>'+
							'</div>'+
						'</div>';
			}
			add_DOM("#containerAnnouncers",html);
			$("#update_announcers").bind("click",function(weq){
				update = null;
				update = "id_event="+id_event+"&"+$("#form_update_announcers").serialize();
				alert(update);
				ajax('/ventas/control_eventos/update_announcers',update,"update_announcers",false,function(response){
					if(response.status){
						alert(response.status+" "+response.message);
					}else{
						alert(response)
					}
				});
			});
		}else{
			alert("Ocurrio un problema inesperado");
		}
	});
}
function add_event(){
	cancel();
	if(name_event.value == "" || orderedby.value == "" || phone.value == ""){
		alert("nombre del evento, ordenado por y telefonó no deben estar vacios");
	}else{
		contact = $("#form_contact").serialize();
		$("#eventContact").modal("hide");
		$("#eventDate").modal("toggle");
		$("#date").bind("click",function(weq){
			$("#eventDate").modal("hide");
			$("#eventData").modal("toggle");
			date = $("#form_date").serialize();
			$("#data").bind("click",function(weq){
				$("#eventData").modal("hide");
				$("#eventResource").modal("toggle");
				data = $("#form_data").serialize();
				$("#resource").bind("click",function(weq){
					$("#eventResource").modal("hide");
					$("#eventAnnouncers").modal("toggle");
					resource = $("#form_resource").serialize();
					$("#announcers").bind("click",function(weq){
						announcer = $("#form_announcers").serialize();
						event = contact+"&"+date+"&"+data+"&"+resource+"&"+announcer;
						ajax('/ventas/control_eventos/add_event',event,"announcers",false,function(response){
							if(response.status){
								alert(response.status+" "+response.message+" "+response.id);
								socket.emit('addEvent', response.id);
							}else{
								alert(response);
							}
						});
					});
				});
			});
		});
	}
}
function cancel(){
	$("#date").unbind("click");
	$("#data").unbind("click");
	$("#resource").unbind("click");
	$("#announcers").unbind("click");
	reset_form("#form_date");
	reset_form("#form_data");
	reset_form("#form_resource");
	reset_form("#form_announcers");
}