var express = require("express"),
	date_to = require("../models/date"),
	router_archivero = require("./routers_archivero"),
	cartridges = require("../models/cartridges"),
	users = require("../models/users"),
	spot = require("../models/spot"),
	events = require("../models/remoteControl"),
	text = new date_to(),
	router = express.Router();
router.use("/archivero",router_archivero);
router.get("/",function(req,res){
	res.render("ventas/index",{title:"Ventas"});
});

router.get("/control_cartuchos/fecha",function(req,res){
	messageerror = null;
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
	console.log("este es el año "+year+" este es el mes "+month);
	users.show_producer(function(error,producers){
		if(error){
			console.log(error);
			messageerror = "productor "+error;
			producers = null;
		}
		cartridges.avalible_date(function(errordate,dates){
			if(errordate){
				dates = null;
				messageerror += "dates "+errordate;
			}
			cartridges.show_this_month(year,month,function(errorcar,cartridge){
				if(errorcar){
					cartridge = null;
					messageerror += "cartridges "+errorcar;
				}
				res.render("ventas/control_cartuchos/control_cartuchos",{title:"control cartuchos",
																producers:producers,
																dates:dates,
																tables:cartridge,
																message:messageerror});
			});
		});

	});
});

router.post("/control_cartuchos/add_cartridge",function(req,res){
	if(!req.body.type || !req.body.concept || !req.body.datev || !req.body.serie || !req.body.producer){
		res.json({result:"error",message:"No recibimos los parametros necesarios"});
	}else{
		type = req.body.type;
		concept = req.body.concept;
		datev = req.body.datev;
		serie = req.body.serie;
		producer = req.body.producer;
		cartridges.add_cartridge(type,concept,datev,serie,producer,req.session.user_id,function(error,status){
			result = "";
			message = "";
			if(error){
				res.json({result:"error",message:error});
			}else{
				switch(status[1][0].output){
					case 1:
					result = "error";
					message = "Existe un cartucho con el mismo numero de serie";
					break;
					case 2:
					result = "error";
					message = "La fecha introducida debe ser igual o superior al dia de hoy";
					break;
					case 3:
					result = "error";
					message = "Hay un error con el productor";
					break;
					case 4:
					result = "error";
					message = "Ocurrio un problema con tu identidad";
					break;
					case 5:
					result = "correct";
					message = "Se agrego el cartucho correctamente";
					break;
					default:
					result = "error";
					message = "Ocurrio un error desconocido";
					break;
				}
				res.json({result:result,message:message,C:{id:status[1][0].idC,type:type,concept:concept,datev:datev,serie:serie}});
			}
		});
	}
});

router.post("/control_cartuchos/update_cartridge",function(req,res){
	if(!req.body.type_up || !req.body.concept_up || !req.body.datev_up || !req.body.serie_up || !req.body.producer_up || !req.body.id_c){
		res.json({result:"error",message:"No recibimos los parametros necesarios"});
	}else{
		cartridges.update_cartridge(req.body.id_c,req.body.type_up,req.body.concept_up,req.body.datev_up,req.body.serie_up,
			req.body.producer_up,req.session.user_id,function(error,status){
			if(error){
				res.json({result:"error",message:"Ocurrio un problema: "+error});
			}else{
				switch(status[1][0].output){
					case 1:
					result = "error";
					message = "Existe un cartucho con el mismo numero de serie";
					break;
					case 2:
					result = "error";
					message = "Ocurrio un problema con tu identidad";
					break;
					case 3:
					result = "error";
					message = "Hay un error con el productor";
					break;
					case 4:
					result = "error";
					message = "La fecha introducida debe ser igual o superior al dia de hoy";
					break;
					case 5:
					result = "correct";
					message = "Se actualizó el cartucho correctamente";
					break;
					default:
					result = "error";
					message = "Ocurrio un error desconocido";
					break;
				}
				res.json({result:result,message:message});
			}
		});
	}
});

router.post("/control_cartuchos/delete_cartridge",function(req,res){
	if(!req.body.id_c){
		res.send("No recibimos los parametros necesarios");
	}else{
		cartridges.delete_cartridge(req.body.id_c,req.session.user_id,function(error,status){
			if(error){
				res.send("Ocurrio un problema con la base de datos: "+error);
			}else{
				switch(status[1][0].output){
						case 1:

						message = "No tienes los permisos necesarios para realizar esta operación";
						break;
						case 2:

						message = "El cartucho no puede ser eliminado por que esta en uso";
						break;
						case 3:

						message = "Se elimino el cartucho";
						break;
						default:

						message = "Ocurrio un error desconocido";
						break;
				}
				res.send(message);
			}
		});
	}
});
router.post("/control_cartuchos/new_version",function(req,res){
	if(!req.body.num || !req.body.datec || !req.body.type_nv || !req.body.concept_nv || 
		!req.body.datev_nv || !req.body.serie_nv || !req.body.producer_nv){
		res.json({result:"error",message:"No recibimos todos los parametros"});
	}
	cartridges.new_version(req.body.num,req.body.datec,req.body.type_nv,req.body.concept_nv,
		req.body.datev_nv,req.body.serie_nv,req.body.producer_nv,req.session.user_id,function(error,status){
			if(error){
				res.json({result:"error",
					message:error});
			}else{
				switch(status[1][0].output){
					case 1:
						result = "error"
						message = "Ya existe un cartucho con el mismo numero de serie"
					break;
					case 2:
						result = "error"
						message = "La fecha introducida debe ser igual o superior al dia de hoy"
					break;
					case 3:
						result = "error"
						message = "Hay un problema con el productor"
					break;
					case 4:
						result = "error"
						message = "No tienes los permisos necesarios para realizar esta operación"
					break;
					case 5:
						result = "error"
						message = "Hay un error con la fecha del cartucho anterior"
					break;
					case 6:
						result = "correct"
						message = "Se creo la nueva version del cartucho"
					break;
					default:
						result = "error"
						message = "Ocurrio un problema desconocido"
					break;
				}
				res.json({result:result,message:message});
			}			
		});
});
router.get("/control_spot/",function(req,res){
	if(!req.query.page || isNaN(req.query.page) || req.query.page == 1){
		page = 1;
	}else{
		page = req.query.page;
	}
	spot.get_spot(page,function(error,spot,count){
		messageerror = null;
		if(error){
			spot = null;
			count = null;
			messageerror += "Spot "+error;
		}
		intpage = parseInt(page);
		var paint;
		if(count <= 5 || page <= 5){
			paint = [1,2,3,4,5];
		}else{
			paint = [intpage-2,intpage-1,intpage,intpage+1,intpage+2];
		}
		cartridges.show_select_cartridge(function(error,select){
			if(error){
				select = null;
				messageerror += " cartridges "+error;
			}
			users.show_announcer(function(error,announcers){
				if(error){
					announcers = null;
					messageerror += " announcers "+error;
				}
				res.render("ventas/control_spot/control_spot",{title:"control spot",
											spots:spot,
											num_pages:count,
											position:intpage,
											paint:paint,
											cartridges:select,
											announcers:announcers});
			});
		});
	});
});
router.post("/control_spot/add_spot",function(req,res){
	if(!req.body.datestart || !req.body.type || !req.body.priority || !req.body.duration || !req.body.announcer || !req.body.cartridge
		|| !req.body.idea){
		res.send("No sé recibieron todos los parametros");
	}else{
		datestart = req.body.datestart;
		type = req.body.type;
		priority = req.body.priority;
		duration = req.body.duration;
		recorded = req.body.announcer;
		music = req.body.music;
		note = req.body.note;
		date = new Date(datestart+" 00:00:00");
		today = new Date();
		if(recorded == 1){
			recorded = "";
		}
		if(date < today){
			res.send("compruebe la fecha de incio, debe ser igual o superior al dia en curso");
		}else{
			complete = false;
			car = req.body.cartridge;
			idea = req.body.idea;
			for(i in car){
				if(!car[i] || !idea[i]){
					complete = true;
				}
			}
			if(complete == true){
				res.send("compruebe que los cartuchos tengan una idea");
			}else{
				spot.avaliableCartridge(car,function(error,status){
					if(error){
						res.send("hubo un problema al verificar los cartuchos: "+error);
					}else if(status == false){
						res.send("uno o muchos cartuchos que seleccionastes esta siendo ocupado");
					}else if(status == true){
						spot.addSpot(req.session.user_id,datestart,type,priority,duration,recorded,music,note,car,idea,function(error,idSpot){
							if(error){
								res.send("Ocurrio un problema al resgistrar el spot");
							}else{
								res.json({id:idSpot});
							}
						});
					}
				});
			}
		}
	}
});
router.post("/control_spot/update_information",function(req,res){
	if(!req.body.datestartup || !req.body.typeup || !req.body.priorityup || !req.body.durationup || !req.body.announcerup
	 || !req.body.musicup || !req.body.noteup || !req.body.id_spot){
		res.send("No sé recibieron todos los parametros");
	}else{
		datestartup = req.body.datestartup;
		typeup = req.body.typeup;
		priorityup = req.body.priorityup;
		durationup = req.body.durationup;
		announcerup = req.body.announcerup;
		musicup = req.body.musicup;
		noteup = req.body.noteup;
		id_spot = req.body.id_spot;
		if(announcerup == 1){
			announcerup = "";
		}
		spot.updateSpotinformation(req.session.user_id,id_spot,datestartup,typeup,priorityup,durationup,announcerup,musicup,noteup,function(error,result){
			if(error){
				res.send("Ocurrió un problema "+error);
			}else{
				message = "";
				switch(result){
					case 1:
						message = "No tienes los permisos necesarios para realizar esta operación";
					break;
					case 2:
						message = "El locutor solicitado no se encontro en el sistema";
					break;
					case 3:
						message = "Sé actualizó la información";
					break;
				}
				res.send(message);
			}
		});
	}
});
router.post("/control_spot/update_data",function(req,res){
	if(!req.body.id_spot || !req.body.cartridge || !req.body.idea){
		res.send("No sé recibieron todos los parametros");
	}else{
		id_spot = req.body.id_spot;
		car = req.body.cartridge;
		idea = req.body.idea;
		error = false;
		for(i in car){
			if(!car[i] || !idea[i] || car[i] == null){
				error = true;
			}
		}
		if(error == true){
			res.send("Debe haber una idea por cada cartucho");
		}else{	
		console.log(idea);		
			spot.updateDatainformation(req.session.user_id,id_spot,car,idea,function(dataerror){
				if(dataerror){
					res.send(dataerror);
				}else{
					res.send("Se actualizó los cartuchos");
				}
			});	
		}
	}
});
router.post("/control_spot/get_cartridge",function(req,res){
	cartridges.show_select_cartridge(function(error,results){
		messageerror = null;
		if(error){
			message = "Ocurrió un problema: "+error;
			res.send(message);
		}else{
			result = "correct";
			message = null;
			res.json({cartridges:results});
		}
	});
});
router.post("/control_spot/get_information",function(req,res){
	if(req.body.id_spot){
		spot.get_information_spot(req.body.id_spot,function(error,information){
			if(error){
				res.json({error:"Ocurrio un problema "+error});
			}else{
				res.json({information:information});
			}
		});
	}else{
		res.json({error:"no se recibieron todos los parametros"});
	}
});
router.post("/control_spot/get_data",function(req,res){
	if(req.body.id_spot){
		messageerror = null;
		spot.get_data_spot(req.body.id_spot,function(error,results){
			if(error){
				results = null;
				messageerror = "Ocurrio un problema: "+error;
				res.json({error:messageerror});
			}else{
				res.json({data:results});
			}
		});
	}else{
		res.json({error:"no se recibieron todos los parametros"});	
	}
});
router.get("/control_eventos/",function(req,res){
	if(!req.query.page || isNaN(req.query.page) || req.query.page == 1){
		page = 1;
	}else{
		page = req.query.page;
	}
	events.getRemotecontrol(page,function(error,results,count){
		messageerror = null;
		if(error){
			results = null;
			count = null;
			messageerror += "control remoto "+error;
		}
		intpage = parseInt(page);
		if(count <= 5 || page <= 5){
			paint = [1,2,3,4,5];
		}else{
			paint = [intpage-2,intpage-1,intpage,intpage+1,intpage+2];
		}
		users.show_announcer(function(error,announcers){
				if(error){
					announcers = null;
					messageerror += " announcers "+error;
				}
				res.render("ventas/control_eventos/control_eventos",{title:"control remoto (eventos)",
											events:results,
											num_pages:count,
											position:intpage,
											paint:paint,
											announcers:announcers,
											message:messageerror});
			});
	});
});
router.get("/control_eventos/:id_event/documento_pdf",function(req,res){
	if(req.params.id_event){
		id = req.params.id_event;
		incontact = "";
		indate = "";
		indata = "";
		inresource = "";
		inannouncer = "";
		events.getContact(id,function(error,contact){
			if(error){
				res.send("Ocurrió un problema: "+error);
			}else{
				incontact = contact;
				events.getDate(id,function(error,date){
					if(error){
						res.send("Ocurrió un problema: "+error);
					}else{
						indate = date;
						events.getData(id,function(error,data){
							if(error){
								res.send("Ocurrió un problema: "+error);
							}else{
								indata = data
								events.getResource(id,function(error,resource){
									if(error){
										res.send("Ocurrió un problema: "+error);
									}else{
										inresource = resource;
										events.getAnnouncers(id,function(error,announcer){
											if(error){
												res.send("Ocurrió un problema: "+error);
											}else{
												inannouncer = announcer;
												console.log(incontact.name_employe);
												res.render("ventas/evento_pdf",{title:"evento "+id,contact:incontact[0],date:indate,data:indata[0],
																			resource:inresource,announcer:inannouncer});
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
	}else{
		res.send("No se recibio el parametro");
	}
});
router.post("/control_eventos/add_event",function(req,res){
	today = new Date();
	errormessage = null;
	if(req.body.name_event && req.body.orderedby && req.body.phone && req.body.date && req.body.time_s && 
		req.body.time_f && req.body.announcer){
		name_event = req.body.name_event;
		orderedby = req.body.orderedby;
		contact = "";
		phone = req.body.phone;
		address_event = "";
		place_installation = "";
		date = req.body.date;
		times = req.body.time_s;
		timef = req.body.time_f;
		support = "";
		commercial = 0;
		form = 0;
		note = "";
		resource = "";
		announcer = req.body.announcer;
		for(i in date){
			console.log(date[i]);
			console.log(times[i]);
			console.log(timef[i]);
			if(date[i] == "" || times[i] == "" || timef[i] == ""){
				errormessage = "Cada fecha debe con tener una hora de inició y final";
			}else{
				thisdate = new Date(date[i]+" "+times[i]);
				if(thisdate < today){
					errormessage = "Las fechas deben ser igual o superior al dia en curso y las horas asignadas superior al actual";
				}else{
					if(timef[i] < times[i]){
						errormessage = "La hora de finalización debe ser superior a la de inició";
					}
				}
			}
		}
		if(errormessage != null){
			res.send(errormessage);
		}else{
			if(req.body.contact){
			contact = req.body.contact;
			}
			if(req.body.address){
				address_event = req.body.address;
			}
			if(req.body.palce){
				place_installation = req.body.palce;
			}
			if(req.body.support){
				support = req.body.support;
			}
			if(req.body.commercial){
				commercial = 1;
			}
			if(req.body.form){
				form = 1;
			}
			if(req.body.observations){
				node = req.body.observations;
			}
			if(req.body.resource){
				resource = req.body.resource;
			}
			events.add_event(req.session.user_id,name_event, orderedby, contact, phone, address_event, place_installation, date,
			 times, timef, support, commercial, form, note, resource, announcer,function(error,status,message,id_encrypt){
			 	if(error){
			 		res.send("Ocurrió un problema: "+error);
			 	}else{
			 		id = null;
				 	if(id_encrypt){
				 		id = id_encrypt;
				 	}
				 	res.json({status:status,message:message,id:id});
			 	}
			 });
		}
	}else{
		res.send("No recibimos todos lo parametros necesarios");
	}
});
router.post("/control_eventos/getContact",function(req,res){
	if(req.body.id_event){
		events.getContact(req.body.id_event,function(error,contact){
			if(error){
				res.json({error:"Ocurrió un problema: "+error});
			}else{
				res.json({contact:contact});
			}
		});
	}else{
		res.send("No recibimos los parametros necesarios");
	}
});
router.post("/control_eventos/getDate",function(req,res){
	if(req.body.id_event){
		events.getDate(req.body.id_event,function(error,dates){
			if(error){
				res.json({error:"Ocurrió un problema: "+error});
			}else{
				res.json({dates:dates});
			}
		});
	}else{
		res.send("No recibimos los parametros necesarios");
	}
});
router.post("/control_eventos/getData",function(req,res){
	if(req.body.id_event){
		events.getData(req.body.id_event,function(error,data){
			if(error){
				res.json({error:"Ocurrió un problema: "+error});
			}else{
				res.json({data:data});
			}
		});
	}else{
		res.send("No recibimos los parametros necesarios");
	}
});
router.post("/control_eventos/getResource",function(req,res){
	if(req.body.id_event){
		events.getResource(req.body.id_event,function(error,resources){
			if(error){
				res.json({error:"Ocurrió un problema: "+error});
			}else{
				res.json({resources:resources});
			}
		});
	}else{
		res.send("No recibimos los parametros necesarios");
	}
});
router.post("/control_eventos/getAnnouncers",function(req,res){
	if(req.body.id_event){
		events.getAnnouncers(req.body.id_event,function(error,announcers){
			if(error){
				res.json({error:"Ocurrió un problema: "+error});
			}else{
				res.json({announcers:announcers});
			}
		});
	}else{
		res.send("No recibimos los parametros necesarios");
	}
});
router.post("/control_eventos/getAllannouncers",function(req,res){
	users.show_announcer(function(error,announcers){
		if(error){
			res.send("Ocurrió un problema "+error);
		}else{
			res.json({announcers:announcers})
		}
	});
});
router.post("/control_eventos/update_contact",function(req,res){
	if(req.body.id_event && req.body.up_name_event && req.body.up_orderedby && req.body.up_contact &&
		req.body.up_phone && req.body.up_address && req.body.up_palce){
		events.updateContact(req.body.id_event, req.session.user_id, req.body.up_name_event, 
			req.body.up_orderedby, req.body.up_contact, req.body.up_phone, 
			req.body.up_address, req.body.up_palce,function(error,status){
				if(error){
					res.send("Ocurrió un problema: "+error);
				}else{
					res.json({status:status});
				}
		});
	}else{
		res.send("No recibimos los parametros necesarios");
	}
});
router.post("/control_eventos/update_date",function(req,res){
	today = new Date();
	errormessage = null;
	console.log(req.body);
	if(req.body.id_event && req.body.date && req.body.time_s && req.body.time_f){
		dates = req.body.date;
		ts = req.body.time_s;
		tf = req.body.time_f;
		for(i in dates){
			console.log(dates[i]);
			console.log(ts[i]);
			console.log(tf[i]);
			if(dates[i] == "" || ts[i] == "" || tf[i] == ""){
				errormessage = "Cada fecha debe con tener una hora de inició y final";
			}else{
				thisdate = new Date(dates[i]+" "+ts[i]);
				if(thisdate < today){
					errormessage = "Las fechas deben ser igual o superior al dia en curso y las horas asignadas superior al actual";
				}else{
					if(tf[i] < ts[i]){
						errormessage = "La hora de finalización debe ser superior a la de inició";
					}
				}
			}
		}
		if(errormessage != null){
			res.send(errormessage);
		}else{
			events.updateDate(req.body.id_event, req.session.user_id, dates, ts, tf, function(error,status,message){
				if(error){
					res.send("Ocurrió un problema: "+error);
				}else{
					res.json({status:status,message:message});
				}
			});
		}
	}else{
		res.send("No recibimos los parametros necesarios");
	}
});
router.post("/control_eventos/update_data",function(req,res){
	if(req.body.id_event && req.body.up_support  && req.body.up_observations){
		commercial = 0;
		form = 0;
		if(req.body.up_commercial){
			commercial = 1;
		}
		if(req.body.up_form){
			form = 1;
		}
		events.updateData(req.body.id_event, req.session.user_id, req.body.up_support, commercial, 
			form, req.body.up_observations,function(error,status){
				if(error){
					res.send("Ocurrió un problema "+error);
				}else{
					res.json({status:status});
				}
			});
	}else{
		res.send("No recibimos los parametros necesarios");
	}
});
router.post("/control_eventos/update_resources",function(req,res){
	if(req.body.id_event){
		if(req.body.up_resource){
			resources = req.body.up_resource;
		}else{
			resources = null;
		}
		events.updateResources(req.body.id_event, req.session.user_id, resources, function(error,status,message){
			if(error){
				res.send("Ocurrió un problema "+error);
			}else{
				res.json({status:status,message:message});
			}
		});
	}else{
		res.send("No recibimos los parametros necesarios");
	}
});
router.post("/control_eventos/update_announcers",function(req,res){
	if(req.body.id_event && req.body.up_announcers){
		announcers = req.body.up_announcers;
		if(announcers == null && announcers.length == 0){
			res.send("El reporte debe contener por lo menos 1 locutor");
		}else{
			events.updateAnnouncers(req.body.id_event,req.session.user_id,announcers, function(error,status,message){
				if(error){
					res.send("Ocurrió un problema "+error)
				}else{
					res.json({status:status,message:message});
				}
			});
		}
	}else{
		res.send("No recibimos los parametros necesarios");	
	}
});
module.exports = router;