var express = require("express"),
	router_archivero = require("./routers_archivero"),	
	binnacles = require("../models/binnacles"),
	reports = require("../models/report"),
	cartridges = require("../models/cartridges"),
	router = express.Router();
router.use("/archivero",router_archivero);
function check_last(session,cb){
	message = null;
	binnacles.check(session,function(error,count,limit){
		if(error){
			cb("Ocurrió un problema al verificar tu ultima bitacóra codigo de error: "+error);
			return;
		}
		if(count > 0){
			cb("Tu ultima bitacóra te respalda hasta "+limit);
			return;
		}else{
			cb(null);
			return;
		}
	});
}
router.get("/",function(req,res){
	check_last(req.session.user_id,function(status){
		if(!status){
			res.redirect("bitacora");
		}else{
			res.render("locutor/index",{title:"Locutor",message:status});
		}
	});
});
router.get("/bitacora",function(req,res){
	binnacles.check(req.session.user_id,function(error,count,limit){
		if(error){
			res.render("locutor/index",{title:"Locutor",message:"Ocurrió un problema al verificar tu ultima bitacóra codigo de error: "+error});
		}else{	
			if(count > 0){
				res.render("locutor/index",{title:"Locutor",message:"Tu ultima bitacóra te respalda hasta "+limit});
			}else{
				binnacles.getRequirement(function(error,requirement){
					message = null;
					if(error){
						requirement = null;
						message = "Ocurrió un problema al obtener los requisitos de bitacora codigó: "+error;
					}
					res.render("locutor/bitacora",{title:"Bitacora",message:message,requirement:requirement});
				});
			}	
		}
	});
});
router.post("/getSerie",function(req,res){
	message = null
	serie = req.body.serie;
	cartridges.getCartridgebySerie(serie,function(error,car){
		if(error){
			message = "Ocurrió un problema al solicitar los cartuchos: "+error;
			res.send(message);
		}else{
			res.json({cartridges:car});
		}
	});
});
router.post("/addBinnacle",function(req,res){
	if(!req.body.timeF){
		res.send("No recibimos todos los parametros");
	}else{
		var lapsed;
		idEmploye = req.session.user_id;
		timeF = req.body.timeF;
		requirement = req.body.res;
		if(!req.body.c || req.body.c == null){
			lapsed = null;
		}else{
			lapsed = req.body.c;	
		}
		observations = req.body.note;
		binnacles.add_report(idEmploye,timeF,requirement,lapsed,observations,function(error,message,result){
			if(error){
				res.send("Ocurrió un problema "+error);
			}else{
				res.json({message:message,result:result});
			}
		});	
	}
})
router.get("/reportar_problema",function(req,res){
	page = 1;
	if(!req.query.page || isNaN(req.query.page)){
		page = 1;
	}else{
		page = req.query.page;
	}
	reports.getReport(page,req.session.user_id,function(error,count,results){
		if(error){
			count = null;
			results = null;
		}
		intpage = parseInt(page);
		var paint;
		if(count <= 5 || page <= 5){
			paint = [1,2,3,4,5];
		}else{
			paint = [intpage-2,intpage-1,intpage,intpage+1,intpage+2];
		}
		res.render("locutor/reportProblem",{title:"Reportar problema",num_pages:count,
											position:intpage,
											paint:paint,
											reports:results});
	});
});
router.post("/newReport",function(req,res){
	if(req.body.argument || req.body.argument != null){
		reports.addReport(req.session.user_id,req.body.argument,function(error,status){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				if(status == 1){
					res.send("No se puedo realizar el reporte");
				}else if(status == 2){
					res.json({status:true});
				}
			}
		});
	}else{
		res.send("No se recibieron todos los parametros");
	}
});
router.get("/reportar_cartucho",function(req,res){

});
module.exports = router;