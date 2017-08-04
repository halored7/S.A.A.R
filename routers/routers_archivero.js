var express = require("express"),
	cartridges = require("../models/cartridges"),
	event = require("../models/remoteControl"),
	spot = require("../models/spot"),
	binnacles = require("../models/binnacles"),
	date_to = require("../models/date"),
	text = new date_to(),
	router = express.Router();
router.get("/cartuchos",function(req,res){
	type = req.session.user_type;
	messageError = null;
	if(req.query.año && req.query.mes){
		if(!isNaN(req.query.año)){
			year = parseInt(req.query.año);
			title_year = year;
		}else{
			year = null;
			title_month = text.date_now();
			title_year = text.year_now();
		}
		month = text.date_toString(req.query.mes);
		if(isNaN(month) || month == false){
			month = null;
		}
	}else{
		year = null;
		month = null;
	}
	cartridges.show_this_month(year,month,function(error,arrayCartridges){
		if(error){
			arrayCartridges = null;
			messageError += "Ocurrió un problema al mostrar los cartuchos codigo de error: "+error;
		}
		cartridges.avalible_date(function(error,dates){
			if(error){
				messageError +="Ocurrió un problema al mostrar las fechas de los cartuchos codigo de error: "+error;
			}
			switch(type){
				case 1:
					res.render("archivero/cartuchos/administrador",{title:"Cartuchos",arrayCartridges:arrayCartridges,message:messageError,dates:dates,type:type});
				break;
				case 2:
					res.render("archivero/cartuchos/ventas",{title:"Cartuchos",arrayCartridges:arrayCartridges,message:messageError,dates:dates,type:type});
				break;
				case 3:
					res.render("archivero/cartuchos/productor",{title:"Cartuchos",arrayCartridges:arrayCartridges,message:messageError,dates:dates,type:type});
				break;
				case 4:
					res.render("archivero/cartuchos/locutor",{title:"Cartuchos",arrayCartridges:arrayCartridges,message:messageError,dates:dates,type:type});
				break;
				default:
					res.send("Tienes que iniciar session");
				break;
			}
		});
	});
});
router.get("/Spot",function(req,res){
	type = req.session.user_type;
	page = null;
	message = null;
	if(!req.query.page || isNaN(req.query.page) || req.query.page == 1){
		page = 1
	}else{
		page = req.query.page;
	}
	spot.getAll(page,function(error,spots,count){
		if(error){
			message = "Ocurrió un problema al mostrar los Spot codigo de error: "+error;
			spots = null;
			count = null;
		}
		intpage = parseInt(page);
		var paint;
		if(count <= 5 || page <= 5){
			paint = [1,2,3,4,5];
		}else{
			paint = [intpage-2,intpage-1,intpage,intpage+1,intpage+2];
		}
		switch(type){
			case 1:
				res.render("archivero/spot/administrador",{title:"Spot",spots:spots,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			case 2:
				res.render("archivero/spot/ventas",{title:"Spot",spots:spots,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			case 3:
				res.render("archivero/spot/productor",{title:"Spot",spots:spots,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			case 4:
				res.render("archivero/spot/locutor",{title:"Spot",spots:spots,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			default:
				res.send("Tienes que iniciar session");
			break;
		}
	});
});

router.get("/eventos",function(req,res){
	type = req.session.user_type;
	page = null;
	message = null;
	if(!req.query.page || isNaN(req.query.page) || req.query == 1){
		page = 1
	}else{
		page = req.query.page;
	}
	event.getAll(page,function(error,events,count){
		if(error){
			message = "Ocurrió un problema al mostrar los eventos codigo de error: "+error;
			events = null;
			count = null;
		}
		intpage = parseInt(page);
		if(count <= 5 || page <= 5){
			paint = [1,2,3,4,5];
		}else{
			paint = [intpage-2,intpage-1,intpage,intpage+1,intpage+2];
		}
		switch(type){
			case 1:
				res.render("archivero/eventos/administrador",{title:"eventos",events:events,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			case 2:
				res.render("archivero/eventos/ventas",{title:"eventos",events:events,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			case 3:
				res.render("archivero/eventos/productor",{title:"eventos",events:events,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			case 4:
				res.render("archivero/eventos/locutor",{title:"eventos",events:events,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			default:
				res.send("Tienes que iniciar session");
			break;
		}
	});
});
router.get("/bitacoras",function(req,res){
	type = req.session.user_type;
	page = null;
	message = null;
	if(!req.query.page || isNaN(req.query.page) || req.query.page == 1){
		page = 1
	}else{
		page = req.query.page;
	}
	binnacles.getAll(page,function(error,reports,count){
		if(error){
			reports = null;
			count = null;
			message = "Ocurrió un problema al mostrar los reportes de bitacoras codigo de error: "+error;
		}
		intpage = parseInt(page);
		if(count <= 5 || page <= 5){
			paint = [1,2,3,4,5];
		}else{
			paint = [intpage-2,intpage-1,intpage,intpage+1,intpage+2];
		}
		switch(type){
			case 1:
				res.render("archivero/bitacoras/administrador",{title:"Bitacoras",reports:reports,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			case 2:
				res.render("archivero/bitacoras/ventas",{title:"Bitacoras",reports:reports,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			case 3:
				res.render("archivero/bitacoras/productor",{title:"Bitacoras",reports:reports,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			case 4:
				res.render("archivero/bitacoras/locutor",{title:"Bitacoras",reports:reports,num_pages:count,
																	position:intpage,
																	paint:paint,message:message,type:type});
			break;
			default:
				res.send("Tienes que iniciar session");
			break;
		}
	});
});
module.exports = router;