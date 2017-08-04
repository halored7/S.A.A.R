var socket = io();
socket.on('newEvent',function(data){
	num = parseInt($("#event").text());
	num+1;
	$("#event").text(num);

	$.notify({
		title: "<strong>"+data.employe+":</strong> ",
		message: "Creo un nuevo informe de evento control remoto",
		type: 'info'
	});
});