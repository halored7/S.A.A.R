socket.on('finishedSpot',function(data){
	$.notify({
		title: "<strong>"+data.by+":</strong> ",
		message: "termino un "+data.message,
		type: 'info'
	});
});