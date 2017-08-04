user = require("./users");
event = require("./remoteControl");
binnacles = require("./binnacles");
spot = require("./spot");
cartridges = require("./cartridges");
console.log("esta iniciando");
spot.updateSpotinformation();
/*
spot.avaliableCartridge(['af3e133428b9e25c55bc59fe534248e6a0c0f17b'],function(err,res){
console.log(res);
});
/*
spot.addSpot('632667547e7cd3e0466547863e1207a8c0c0c549','2017-06-01',"spot",1,"12",'',
	"espero que sea dubstep","algo de texto por a qui",['827bfc458708f0b442009c9c9836f7e4b65557fb',
'64e095fe763fc62418378753f9402623bea9e227'
],['la idea para el cartucho 1',"la otro idea jajaja jejej jajaj jjennininin"],function(error,results){
		console.log(results);
});
/*
binnacles.add_report('887309d048beef83ad3eabf2a79a64a389ab1c9f','18:00',['356a192b7913b04c54574d18c28d46e6395428ab',
'da4b9237bacccdf19c0760cab7aec4a8359010b0',
'77de68daecd823babbb58edb1c8e14d7106e83bb',
'1b6453892473a467d07372d45eb05abc2031647a',
'ac3478d69a3c81fa62e60f5c3696165a4e5e6ac4',
'c1dfd96eea8cc2b62785275bca38ac261256e278',
'902ba3cda1883801594b6e1b452790cc53948fda',
],['b4c96d80854dd27e76d8cc9e21960eebda52e962',
'a72b20062ec2c47ab2ceb97ac1bee818f8b6c6cb',
'b7103ca278a75cad8f7d065acda0c2e80da0b7dc',
],'nope nope',function(error,message,status){
	if(error){
		console.log(error);
	}
	if(message){
		console.log(message);
	}
	if(status){
		console.log(status);
	}

});
/*
event.add_event('632667547e7cd3e0466547863e1207a8c0c0c549',"name_event", "orderedby", "contact", "phone", "address_event", "place_installation",
 ["2017-05-26","2017-05-27"], ["09:00:00","10:00:00"], ["12:00:00","14:00:00"],"support", 1, 1, "note", [], ["22d200f8670dbdb3e253a90eee5098477c95c23d"],function(error,result,message,id_encrypt){
 	if(id_encrypt){
 		console.log(id_encrypt);
 	}
 });
/*values = [null];
dates = ["2017-05-23","2017-05-24","2017-05-25","2017-05-26"];
ts = ["13:00","13:00","13:00","13:00"];
tf = ["15:00","15:00","15:00","15:00"];
event.updateDate('c1dfd96eea8cc2b62785275bca38ac261256e278','f6e1126cedebf23e1463aee73f9df08783640400',dates,ts,tf,function(error,status,message){
	console.log(error)
	console.log(status);
	console.log(message);
});
/*event.getRemotecontrol(1,function(error,remotes,count){
	if(error){
		 console.log(error)
	}
});

/*user.reset_password("8effee409c625e1a2d8f5033631840e6ce1dcb64","minuevacontr",function(error,results){
	if(error){
		console.log("ocurrio un problema "+error);
		results = null
	}
	console.log(results);
});*/