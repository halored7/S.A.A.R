function emitProblem(){
	data = $("#formReport").serialize();
	ajax('/locutor/newReport',data,"#btnReport",false,function(response){
		if(response.status){
			alert("Se emitio el reporte");
			socket.emit('reportProblem', null);
		}else{
			alert(response);
		}
	});
}