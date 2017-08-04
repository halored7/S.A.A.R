module.exports = function(server,session){
	var io = require('socket.io')(server),
	sharesession = require('express-socket.io-session');

	io.use(function(socket,next){
		session(socket.request,socket.request.res,next);
	});
	io.sockets.on('connection',function(socket){

		if(!socket.request.session.user_id){
			console.log("aun no has iniciado session");
		}else{
			console.log("aqui desde socket.io: "+socket.request.session.user_id);
		}
		socket.on("addSpot",function(data){
			information = {idSpot:data,employe:socket.request.session.user_name};
			console.log("llego un esto "+data);
			io.sockets.emit("newSpot",information);
		});
		socket.on("addEvent",function(data){
			information = {idEvent:data,employe:socket.request.session.user_name};
			console.log("Nuevo evento de control remoto agregado: "+data);
			io.sockets.emit("newEvent",information);
		});
		socket.on("addBinnacle",function(data){
			information = {idSpot:data,employe:socket.request.session.user_name};
			console.log("llego un esto "+data);
			io.sockets.emit("newBinnacle",information);
		});
		socket.on("addReport",function(data){
			information = {idSpot:data,employe:socket.request.session.user_name};
			console.log("llego un esto "+data);
			io.sockets.emit("newReport",information);
		});
		socket.on("message",function(data){
			date = new Date();
			time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			//information = {idSpot:data,employe:socket.request.session.user_name};
			console.log(socket.request.session.user_name+" emitio "+data);
			io.sockets.emit("newMessage",{by:socket.request.session.user_name,message:data,time:time});
		});
		socket.on("finishSpot",function(data){
			console.log(socket.request.session.user_name+" emitio "+data);
			io.sockets.emit("finishedSpot",{by:socket.request.session.user_name,message:data});
		});
		socket.on("reportProblem",function(){
			console.log(socket.request.session.user_name+" emitio un reporte de problema");
			io.sockets.emit("problem",{by:socket.request.session.user_name});
		});
	});	
}