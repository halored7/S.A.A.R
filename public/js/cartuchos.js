function get_info(id_cartridge){
	data = "id_cartridge="+id_cartridge;
	ajax('/administrador/archivero/cartuchos',data,null,true,function(response){
		if(response.data){
			data = response.data;
			html = '';
			for(i in data){
				html += '<tr>'+
							'<td>'+data[i].sale
			}
		}else{
			alert(response);
		}
	});
}