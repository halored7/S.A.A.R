// Declaracion de variables
var express = require('express'),
	app = express(),
	bodyparse=require("body-parser"),
	server = require('http').Server(app),
	session = require('express-session'),
	socket = require('./middlewares/socket'),
	user = require("./models/users"),
	cartridges = require("./models/cartridges"),
	spots = require("./models/spot"),
	events = require("./models/remoteControl"),
	binnacles = require("./models/binnacles"),
	reports = require("./models/report"),
	complaint = require("./models/complaint"),
	pdf = require("./lib/pdf"),
	cookieSession = require("cookie-session"),
	session_admin = require('./middlewares/session'),
	session_sale = require('./middlewares/session_ventas'),
	session_producer = require('./middlewares/session_productor'),
	session_announcer = require('./middlewares/session_locutor'),
	router_administrador = require('./routers/routers_administrador'),
	router_ventas = require('./routers/routers_ventas'),
	router_productor = require('./routers/routers_produccion'),
	router_locutor = require('./routers/routers_locutor'),
	method_overrider = require("method-override");
// motor de vistas
app.set("view engine","jade");
var msession = cookieSession({
		name: "session",
		keys: ["llave-1","llave-2"]
	});
/*var msession = session({
		secret: "victorsierra//5",
		resave: false,
		saveUninitialized: false
	})*/
// use
app.use('/public',express.static('public'));
app.use(bodyparse.json());
app.use(bodyparse.urlencoded({extended:true}));
app.use(method_overrider("_method"));
socket(server,msession);
app.use(msession);
app.use( (err, req, res, next) => {
  res.status(500);
  res.json({
    "error": '${err}'
  });
});
//use routers
app.use("/administrador",session_admin);
app.use("/administrador",router_administrador);
app.use("/ventas",session_sale);
app.use("/ventas",router_ventas);
app.use("/productor",session_producer);
app.use("/productor",router_productor);
app.use("/locutor",session_announcer);
app.use("/locutor",router_locutor);

// get
app.get("/:message?",function(req,res){
	console.log('User-Agent: ' + req.headers['user-agent']);
	var message = null;
	if(req.params.message) message = req.params.message;
	res.render("login",{title:"S.A.A.R",message:message});
});
app.get("/user/:id_employe/pdf/:id_administrator",function(req,res){
	if(!req.params.id_employe || !req.params.id_administrator){
		res.send("No computado");
	}else{
		user.checkadministrador(req.params.id_administrator,function(error,results){
			if(error){
				res.send("Ocurrió un problema: "+error);
			}else{
				if(results == null || results.length == 0){
					res.send("Inicia sesion");
				}else{
					user.getUser(req.params.id_employe,function(error,employe){
						if(error){
							res.send("Ocurrió un problema: "+error);
						}else{
							res.render("administrador/usuario",{title:"Información empleado",employe:employe[0]});
						}
					});
				}
			}
		});
	}
});
app.get("/spot/:idSpot/pdf",function(req,res){
	idSpot = req.params.idSpot;
	spots.get_information_spot(idSpot,function(error,information){
		if(error){
			res.send("Ocurrio un problema "+error);
		}else{
			spots.get_data_spot(idSpot,function(error,data){
				if(error){
					res.send("Ocurrio un problema "+error);
				}else{
					spots.getRecorded(idSpot,function(error,recorded){
						if(error){
							res.send("Ocurrio un problema "+error);
						}else{
							res.render("archivero/spot.jade",{title:"Informe de Spot",information:information[0],
														data:data,recorded:recorded[0]});
						}
					});
				}
			});
		}
	});
});
app.get("/spot/:idSpot",function(req,res){
	file = req.params.idSpot;
	rute = pdf.createpdf("spot/"+file+"/pdf",file,function(rute){
		res.download(rute);
		//pdf.deletepdf(rute);
	});
});
app.get("/event/:idEvent/pdf",function(req,res){
	idEvent = req.params.idEvent;
	events.getContact(idEvent,function(error,contact){
		if(error){
			res.send("Ocurrió un problema: "+error);
		}else{
			events.getAlldate(idEvent,function(error,dates){
				if(error){
					res.send("Ocurrió un problema: "+error);
				}else{
					events.getData(idEvent,function(error,data){
						if(error){
							res.send("Ocurrió un problema: "+error);
						}else{
							events.getResource(idEvent,function(error,resources){
								if(error){
									res.send("Ocurrió un problema: "+error);
								}else{
									events.getAnnouncers(idEvent,function(error,announcers){
										if(error){
											res.send("Ocurrió un problema: "+error);
										}else{
											res.render("archivero/event",{title:"Informe de evento",contact:contact[0],dates:dates,data:data[0],resources:resources,announcers:announcers});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});
app.get("/event/:idEvent",function(req,res){
	file = req.params.idEvent;
	rute = pdf.createpdf("event/"+file+"/pdf",file,function(rute){
		res.download(rute);
		//pdf.deletepdf(rute);
	});
});
app.get("/binnacle/:idBinnacle/pdf",function(req,res){
	idBinnacle = req.params.idBinnacle;
	binnacles.getControl(idBinnacle,function(error,control){
		if(error){
			res.send("Ocurrio un problema: "+error);
		}else{
			binnacles.getMaterial(idBinnacle,function(error,material){
				if(error){
					res.send("Ocurrio un problema: "+error);
				}else{
					binnacles.getLapsed(idBinnacle,function(error,lapsed){
						if(error){
							res.send("Ocurrio un problema: "+error);
						}else{
							binnacles.getComment(idBinnacle,function(error,comment){
								if(error){
									res.send("Ocurrio un problema: "+error);
								}else{
									res.render("archivero/binnacles",{title:"Informe de bitacora",control:control[0],material:material,lapsed:lapsed,comment:comment[0]});
								}
							});
						}
					});
				}
			});
		}
	});
});
app.get("/binnacle/:idBinnacle",function(req,res){
	file = req.params.idBinnacle;
	rute = pdf.createpdf("binnacle/"+file+"/pdf",file,function(rute){
		res.download(rute);
		//pdf.deletepdf(rute);
	});
});
app.post("/cartridge/get_history",function(req,res){
	if(!req.session.user_id || !req.body.id_cartridge){
		res.send("Información no disponible");
	}else{
		cartridges.getAllinfo(req.body.id_cartridge,function(error,info,data){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				res.json({data:data,info:info});
			}
		});
	}
});
app.post("/cartridge/getByserie",function(req,res){
	if(!req.session.user_id || !req.body.serie){
		res.send("Información no disponible");
	}else{
		cartridges.getCartridgebySerie(req.body.serie,function(error,results){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				res.json({cartridges:results});
			}
		});
	}
});
app.post("/spot/getInformation",function(req,res){
	if(!req.session.user_id || !req.body.id_spot){
		res.send("Informacion no disponible");
	}else{
		spots.get_information_spot(req.body.id_spot,function(error,information){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				spots.get_data_spot(req.body.id_spot,function(error,data){
					if(error){
						res.send("Ocurrio un problema "+error);
					}else{
						spots.getRecorded(req.body.id_spot,function(error,recorded){
							if(error){
								res.send("Ocurrio un problema "+error);
							}else{
								res.json({information:information,data:data,recorded:recorded});
							}
						});
					}
				});
			}
		});
	}
});
app.post("/event/getInformation",function(req,res){
	if(!req.session.user_id || !req.body.id_event){
		res.send("Información no disponible");
	}else{
		events.getContact(req.body.id_event,function(error,contact){
			if(error){
				res.send("Ocurrió un problema: "+error);
			}else{
				events.getAlldate(req.body.id_event,function(error,dates){
					if(error){
						res.send("Ocurrió un problema: "+error);
					}else{
						events.getData(req.body.id_event,function(error,data){
							if(error){
								res.send("Ocurrió un problema: "+error);
							}else{
								events.getResource(req.body.id_event,function(error,resources){
									if(error){
										res.send("Ocurrió un problema: "+error);
									}else{
										events.getAnnouncers(req.body.id_event,function(error,announcers){
											if(error){
												res.send("Ocurrió un problema: "+error);
											}else{
												res.json({contact:contact,dates:dates,data:data,resources:resources,announcers:announcers});
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
});
app.post("/binnacle/getInformation",function(req,res){
	if(!req.session.user_id || !req.body.id_binnacle){
		res.send("Información no disponible");
	}else{
		binnacles.getControl(req.body.id_binnacle,function(error,control){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				binnacles.getMaterial(req.body.id_binnacle,function(error,material){
					if(error){
						res.send("Ocurrio un problema: "+error);
					}else{
						binnacles.getLapsed(req.body.id_binnacle,function(error,lapsed){
							if(error){
								res.send("Ocurrio un problema: "+error);
							}else{
								binnacles.getComment(req.body.id_binnacle,function(error,comment){
									if(error){
										res.send("Ocurrio un problema: "+error);
									}else{
										res.json({control:control,material:material,lapsed:lapsed,comment:comment});
									}
								});
							}
						});
					}
				});
			}
		});
	}
});
app.post("/notification/event",function(req,res){
	if(req.session.user_id){
		events.viewEvent(function(error,vevent){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				res.json({event:vevent});
			}
		});
	}else{
		res.send("No se puede mostrar la información");
	}
});
app.post("/notification/alert",function(req,res){
	if(req.session.user_id){
		reports.viewReport(function(error,vreports){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				res.json({reports:vreports});
			}
		});
	}else{
		res.send("No se puede mostrar la información");
	}
});
app.post("/notification/complaint",function(req,res){
	if(req.session.user_id && req.session.user_type == 1){
		complaint.viewComplaint(function(error,vcomplaint){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				res.json({complaint:vcomplaint});
			}
		});
	}else{
		res.send("No se puede mostrar la información");
	}
});
app.post("/notification/binnacle",function(req,res){
	if(req.session.user_id){
		binnacles.viewBinnacle(function(error,vbinnacles){
			if(error){
				res.send("Ocurrio un problema: "+error);
			}else{
				res.json({binnacles:vbinnacles});
			}
		});
	}else{
		res.send("No se puede mostrar la información");
	}
});
app.post("/changeData",function(req,res){
	if(req.session.user_id){
		if(req.body.name || req.body.password){
			name = '';
			password = '';
			if(req.body.name){
				name = req.body.name;
			}
			if(req.body.password){
				password = req.body.password;
			}
			user.changeData(req.session.user_id,name,password,function(error,results){
				if(error){
					res.send("Ocurrio un problema: "+error);
				}else{
					res.send("Correcto");
				}
			});
		}else{
			res.send("what?");
		}
	}else{
		res.send("what?");
	}
});
app.get("/closeSession/user",function(req,res){
	req.session.user_id = null;
	req.session.user_name = null;
	req.session.user_type = null;
	res.redirect("/");
});
app.post("/session",function(req,res){
	console.log("Usuario: "+req.body.user);
	console.log("Password: "+req.body.password);
	user.session(req.body.user,req.body.password,function(error,user){
		if(error){
			res.redirect("/error_bd");
		}else{
			if(user[0] != null){
				if(user[0].active == 1){
					req.session.user_id = user[0].id_employe;
					req.session.user_name = user[0].name_employe;
					req.session.user_type = user[0].type_employe;
					switch(user[0].type_employe){
						case 1:
						res.redirect("administrador/");
						break;
						case 2:
						res.redirect("ventas/");
						break;
						case 3:
						res.redirect("productor/");
						break;
						case 4:
						res.redirect("locutor/");
						break;
						default:
						res.redirect("/error_user_type");
						break;
					}
				}else{
					res.redirect("/error_user_disable");
				}
			}else{
				res.redirect("/error_user_not_found")
			}
		}
	});
});

server.listen(8000,"127.0.0.1");
console.log("Server running...");