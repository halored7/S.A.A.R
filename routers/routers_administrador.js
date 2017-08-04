var express = require("express"),
	user = require("../models/users"),
	complaint = require("../models/complaint"),
	router_archivero = require("./routers_archivero"),
	binnacles = require("../models/binnacles"),
	pdf = require("../lib/pdf"),
	router = express.Router();
router.use("/archivero",router_archivero);
router.get("/",function(req,res){
	res.render("administrador/index",{title:"Administrador"});
});

router.get("/control_cuentas/",function(req,res){
	var page;
	var intpage;
	if(!req.query.page || req.query.page===1 || isNaN(req.query.page)){
		page = 1;
	}else{
		page = req.query.page;
	}
	user.get_users(page,function(error,result,count){
		messageerror = null;
		if(error){
			result = null;
			count = 0;
			messageerror = error;
		}
		intpage = parseInt(page);
		var paint;
		if(count <= 5 || page <= 5){
			paint = [1,2,3,4,5];
		}else{
			paint = [intpage-2,intpage-1,intpage,intpage+1,intpage+2];
		}
		res.render("administrador/control_cuentas/control_cuentas",{title:"Control empleados",
																	employes:result,
																	num_pages:count,
																	position:intpage,
																	paint:paint,
																	message:messageerror});
	});
});
router.post("/control_cuentas/add_employe",function(req,res){
	if(!req.body.Name || !req.body.Deparment || !req.body.Level){
		res.send("No recibimos parametros");
	}else{
		var Name = req.body.Name,
			Deparment = req.body.Deparment,
			Level = req.body.Level,
			Expire = null;
		if(req.body.Expire){
			Expire = req.body.Expire
		}
		var password = user.generate_password(15);
		console.log("este es el password para el empleado: "+password);
		user.add_employe(Name,password,Deparment,Level,Expire,function(error,status,newUser){
			if(error){
				res.send("Ocurrio un problema al registrar el usuario :"+error);
			}
			else if(status == 1){
				res.send("Ya existe un usuario con el mismo nombre");
			}else if(status == 2){
				res.json({result:"Usuario agregado correctamente",
						user:newUser});
			}
		});
	}
});
router.get("/control_cuentas/:id_employe/pdf",function(req,res){
	if(!req.params.id_employe){
		res.send("No computado");
	}else{
		file = req.params.id_employe;
		pdf.createpdf("user/"+file+"/pdf/4d134bc072212ace2df385dae143139da74ec0ef",file,function(rute){
			console.log(rute);
			res.download(rute);
			//pdf.deletepdf(rute);
		});
	}
});
router.get("/control_cuentas/:idEmploye/",function(req,res){
	if(!req.params.idEmploye){
		res.send("No computado");
	}else{
		console.log(req.params.idEmploye);
		user.getUser(req.params.idEmploye,function(error,employe){
			if(error){
				res.send("Ocurrió un problema: "+error);
			}else{
				res.render("administrador/usuario",{title:"Información empleado",employe:employe[0]});
			}
		});
	}
});
router.post("/control_cuentas/update_employe",function(req,res){
	if(!req.body.ide || !req.body.Name_update || !req.body.deparment_update || !req.body.level_update){
		res.send("No recibimos parametros");
	}else{
		var Nameup = req.body.Name_update,
			deparmentup = req.body.deparment_update,
			levelup = req.body.level_update,
			Expire = null,
			id = req.body.ide;
		if(req.body.Expire_update){
			Expire = req.body.Expire_update
		}
		user.update_employe(id,Nameup,deparmentup,levelup,Expire,function(error,results){
			if(error){
				res.send("Ocurrio un porblema al actualizar la información: "+error);
			}else if(results.affectedRows == 1){
				res.json({result:"correct"});
			}else if(results.affectedRows != 1){
				res.send("Ocurrio un error fatal");
			}
		});
	}
});
router.post("/control_cuentas/employe_rd",function(req,res){
	if(!req.body.ide){
		res.send("No recibimos los parametros");
	}else{
		var id = req.body.ide,
			status = req.body.status;
		user.disable_enable_employe(id,status,function(error,results){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else if(results.affectedRows == 1 && status == 1){
				res.send("Se habilito la cuenta");
			}else if(results.affectedRows == 1 && status == 0){
				res.send("Se desactivo la cuenta");
			}else{
				res.send("No se pudo completar la operación");
			}
		});
	}
});
router.post("/control_cuentas/reset",function(req,res){
	if(!req.body.idEmploye){
		res.send("No recibimos los parametros especificos");
	}else{
		var password = user.generate_password(15);
		user.reset(req.body.idEmploye,password,function(error,result){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				res.send("Operación completada");
			}
		});
	}
});
router.get("/control_bitacora/page/:page?",function(req,res){
	errormessage = null;
	var page;
	var intpage;
	if(!req.params.page || req.params.page===1 || isNaN(req.params.page)){
		page = 1;
	}else{
		page = req.params.page;
	}
	binnacles.get_binnacle(page,function(error,result,count){
		if(error){
			console.log(error);
			result = null;
			count = 0;
			errormessage = error;
		}
		intpage = parseInt(page);
		var paint;
		if(count <= 5 || page <= 5){
			paint = [1,2,3,4,5];
		}else{
			paint = [intpage-2,intpage-1,intpage,intpage+1,intpage+2];
		}
		console.log("-- count "+count+"--- intpage "+intpage+" ---- paint"+paint);
		res.render("administrador/control_bitacora/control_bitacora",{title:"Control bitácora",
																	binnacles:result,
																	num_pages:count,
																	position:intpage,
																	paint:paint,
																	message:errormessage});
	});
});
router.post("/control_bitacora/add_binnacle",function(req,res){
	if(!req.body.Name_r){
		res.send("No recibimos los parametros");
	}else{
		requirement = req.body.Name_r;
		binnacles.add_binnacle(requirement,function(error,results){
			if(error){
				console.log(error);
				res.json({result:"error"});
			}else if(results.affectedRows == 1){
				res.json({result:"correct"});
			}
		});
	}
});
router.post("/control_bitacora/update_binnacle",function(req,res){
	if(!req.body.idb || !req.body.Name_rupdate){
		res.send("No recibimos los parametros");
	}else{
		requirement = req.body.Name_rupdate;
		idb = req.body.idb;
		binnacles.update_binnacle(idb,requirement,function(error,results){
			if(error){
				res.json({result:"error"});
			}else if(results.affectedRows == 1){
				res.json({result:"correct"});
			}else{
				res.json({result:"error"});
			}
		});
	}
});
router.post("/control_bitacora/ed_binnacle",function(req,res){
	if(!req.body.status || !req.body.idb){
		res.send("No recibimos los parametros");
	}else{
		status = req.body.status;
		id = req.body.idb;
		binnacles.disable_enable_binnacle(id,status,function(error,results){
			if(error || results.affectedRows == 0){
				res.send("Ocurrio un problema");
			}else if(results.affectedRows == 1 && status == 0){
				res.send("Se desabilito el requisito");
			}else if(results.affectedRows == 1 && status == 1){
				res.send("Se habilito el requisito");
			}
		});
	}
});
router.post("/deleteComplaint",function(req,res){
	if(req.body.idComplaint){
		complaint.deleteComplaint(req.body.idComplaint,function(error,results){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				res.send("Operación completada");
			}
		});
	}else{
		res.send("No recibimos los parametros");
	}
});
module.exports = router;