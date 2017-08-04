function add_cartridge(idDiv){
	data = "option=1";
	ajax('/ventas/control_spot/get_cartridge',data,null,true,function(response){
		if(response.cartridges){
			console.log(response);
			result = response.cartridges;
			option = ""
			for(i in result){
				option += '<option value="'+result[i].id_control+'">' +result[i].number_day +' | '+result[i].type_c+'_'+result[i].name_c+'_'+result[i].validity+' | '+result[i].serie +'</option>';
			}
			html = '<div class="alert alert-default">'+
						'<button class="close" data-dismiss="alert">'+
							'<span>&times;</span>'+
						'</button>'+
						'<div class="form-group">'+
							'<label for="cartridge" class="control-label col-xs-5">'+
							'Seleccione cartucho:</label>'+
							'<div class="col-xs-5">'+
								'<select id="cartridge" name="cartridge[]" class="form-control">'+option+
								'</select>'+
							'</div>'+
						'</div>'+
						'<div class="form-group">'+
							'<label for="idea" class="control-label col-xs-5">Idea para Spot:'+
							'</label>'+
							'<div class="col-xs-5">'+
								'<textarea name="idea[]" id="idea" class="form-control"></textarea>'+
							'</div>'+
						'</div>'+
					'</div>';
			add_DOM(idDiv,html);
		}else{
			alert(response);
		}
	});
}
function span(){
	num = parseInt($("#spot").text());
	alert(num+1+1);
}

function add_spot(){
	$("#send_spot").unbind("click");
	if(cartridge.value == "" || idea.value == ""){
		alert("Complete el formulario");
	}else{
		data = $("#form_spot_data").serialize();
		$("#spotdata").modal("hide");
		$("#spotinformation").modal("toggle");
		$("#send_spot").bind("click",function(weq){
			information = $("#form_spot_information").serialize();
			over = data+"&"+information;
			ajax('/ventas/control_spot/add_spot',over,"#send_spot",false,function(response){
				if(response.id){
					socket.emit('addSpot', response.id);
					alert("Evento agregado");
					reset_form("#form_spot_data");
					reset_form("#form_spot_information");
				}else{
					alert(response);
				}
			});
			
			data = "";
		});
	}
}
function show_information(id_spot){
	$("#updateInformation").unbind("click");
	reset_form("#form_spot_information");
	data = "id_spot="+id_spot;
	ajax('/ventas/control_spot/get_information',data,null,true,function(response){
		console.log(response);
		if(response.information){
			information = response.information;
			if(information[0].priority == 1){
				priority = 1
			}else{
				priority = 2
			}
			$("#datestartup").val(information[0].date_start);
			$("#typeup").val(information[0].type);
			$("#priorityup").val(priority);
			$("#durationup").val(information[0].duration);
			$("#musicup").val(information[0].type_music);
			$("#noteup").val(information[0].note);
			r = "";
			if(information[0].recorded == null){
				r = 1;
			}else{
				r = information[0].recorded;
			}
			$("#announcerup").val(r);
			$("#updateInformation").bind("click",function(weq){
				update = data+"&"+$("#form_spot_information_update").serialize();
				alert(update);
				ajax('/ventas/control_spot/update_information',update,"updateInformation",false,function(response){
					alert(response);
				});
			});
		}else if(response.error){
			alert(response.error);
		}else{
			alert("Ocurrió un problema");
		}
	});
}
function show_data(id_spot){
	$("#btnspotdata").unbind("click");
	div_empty('#contenedor2');
	data = "id_spot="+id_spot;
	ajax('/ventas/control_spot/get_data',data,null,true,function(response){
		if(response.data){
			result = response.data;
			console.log(result);
			html = "";
			for(i in result){
				html += '<div class="alert alert-default">'+
						'<button class="close" data-dismiss="alert">'+
							'<span>&times;</span>'+
						'</button>'+
						'<div class="form-group">'+
							'<label for="cartridge" class="control-label col-xs-5">'+
							'Seleccione cartucho:</label>'+
							'<div class="col-xs-5">'+
								'<select id="cartridge" name="cartridge[]" class="form-control">'+
									'<option value="'+result[i].id_cartridge+'">' +result[i].number_day +' | '+result[i].type_c+'_'+result[i].name_c+'_'+result[i].validity+' | '+result[i].serie +'</option>'+
								'</select>'+
							'</div>'+
						'</div>'+
						'<div class="form-group">'+
							'<label for="idea" class="control-label col-xs-5">Idea para Spot:'+
							'</label>'+
							'<div class="col-xs-5">'+
								'<textarea name="idea[]" id="idea" class="form-control">'+result[i].idea+'</textarea>'+
							'</div>'+
						'</div>'+
					'</div>';
			}
			add_DOM('#contenedor2',html);
			$("#btnspotdata").bind("click",function(weq){
				update = "id_spot="+id_spot+"&"+$("#form_spot_data_update").serialize();
				alert(update);
				ajax('/ventas/control_spot/update_data',update,"#btn-spotdata",false,function(response){
					alert(response);
				});
			});
		}else if(response.error){
			alert(response.error);
		}else{
			alert("Ocurrio un problema");
		}
	});
}