function change(){
	data = $("#form_changeData").serialize();
	ajax('/changeData',data,"#changeData",false,function(response){
		alert(response);
	});
}