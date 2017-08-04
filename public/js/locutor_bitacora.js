function start(){
	final_time = $("#final").val(),
	lapsed,
	observation,
	requerimient;
	var lapsed = "";
	if(final_time == ""){
		alert("La hora de salida no puede estar vacia");
	}else{
		$('#collapse1').collapse('hide');
		$('#collapse2').collapse('show');
		$("#btn_requerimient").click(function(){
			requerimient = $("#requerimient").serialize();
			$('#collapse2').collapse('hide');
			$('#collapse3').collapse('show');
			$("#btn_report").click(function(){
				lapsed = $("#lapsed").serialize();
				$('#collapse3').collapse('hide');
				$('#collapse4').collapse('show');
				$("#btn_finished").click(function(){
					observation = $("#observation").serialize();
					data = "timeF="+final_time+"&"+requerimient+"&"+lapsed+"&"+observation;
					ajax('/locutor/addBinnacle',data,"#btn_finished",false,function(response){
						if(response.message || response.result){
							if(response.message != null) alert(message+" redireccionando espere porfavor");
							if(response.result == 1){
								setTimeout(function() {
									self.location="/locutor/";
								},3000);
							}
						}else{
							alert(response);
						}
					});
				});
			});
		});
	}
}
function list_cartridge(serie){
	div_empty("#list");
	data = "serie="+serie;
	ajax('/locutor/getSerie',data,null,false,function(response){
		if(response.cartridges){
			cartridges = response.cartridges;
			if(cartridges == null || cartridges.length == 0){
				add = '<h3>No sé encontraron cartuchos con ese numero de serie</h3>';
				add_DOM("#list",add);
			}else{
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
				html += '</tbody></table';
				add_DOM("#list",html);
			}
		}else{
			alert(response);
		}
	});
}
function this_cartridge(id_c,num,type,concept,validity,serie){
	html = '<div class="alert alert-default">'+
			'<button class="close" data-dismiss="alert">'+
			'<span>&times;</span></button>'+
			'<div class="col-xs-8">'+
			'<div class="input-group"><span class="input-group-addon"><input value="'+id_c+'" name="c[]" type="checkbox" checked="checked" readonly aria-label="..."></span><input type="text" value="'+num+" "+type+"_"+concept+"_"+validity+"_"+serie+'" readonly class="form-control" aria-label="..."></div>'+
			'</div>'+
        	'</div>'+
    		'</div>';
    add_DOM("#cartridges",html)
}