socket.on('newMessage', function(data) {
	console.log("llego un nuevo mensaje");
	num = $("#chat").text();
	console.log("esto es primero "+num);
	$("#chat").text(parseInt(num)+1);
	html = '<div class="direct-chat-msg doted-border">'+
				'<div class="direct-chat-info clearfix">'+
					'<span class="direct-chat-name pull-left">'+data.by+'</span>'+
				'</div>'+
				'<div class="direct-chat-text"><p>'+data.message+'</p>'+
				'</div>'+
				'<div class="direct-chat-info clearfix">'+
					'<span class="direct-chat-timestamp pull-right">'+data.time+'</span>'+
				'</div>'+
				'<div class="direct-chat-info clearfix">'+
					'<span class="direct-chat-img-reply-small pull-left"></span>'+
					'<span class="direct-chat-reply-name">----</span>'+
				'</div>'+
			'</div>';
	add_DOM("#areaMessage",html);
});
function sendMessage(){
	if(status_message.value == ''){

	}else{
		message = $("#status_message").val();
		$("#status_message").val('');
		socket.emit('message', message);
	}
}