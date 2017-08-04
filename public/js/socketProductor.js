socket.on('newSpot', function(data) {
	num = parseInt($("#spot").text());
	num+1;
	$("#spot").text(num);
	$.notify({
		title: "<strong>"+data.employe+":</strong> ",
		message: "Creo un nuevo Spot",
		type: 'info'
	});
});
socket.on('problem',function(data){
	num = parseInt($("#alerta").text());
	num+1;
	$("#alerta").text(num);
});