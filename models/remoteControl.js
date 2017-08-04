var mysql = require('./mysql'),
modelRemote = {}
modelRemote.add_event = function(id_employe,name_event, orderedby, contact, phone, address_event, place_installation, date, times, timef,
								support, commercial, form, note, resource, announcer,cb){
	stmt_confirm = "select id_employe from user_employes where type_employe = 4 and sha1(id_employe) = ?;";
	id_event_new = null;
	stmt_contact = "call rc_add(?,?,?,?,?,?,?,@status,@id_event,@id); select @status as status,@id_event as id_event,@id as id;";
	stmt_date = "";
	stmt_data = "call rc_add_data(?,?,?,?,?);";
	stmt_resource = "";
	stmt_announcers = "";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt_confirm,[announcer[0]],function(error,results){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			if(results.length == 0 || results == null){
				mysql.close();
				cb(null,"Error","No se pudo comprobar la identidad del los locutores asignados");
				return;
			}
			mysql.secure_query(stmt_contact,[id_employe, name_event, orderedby, contact, phone, address_event, place_installation],function(error,contact){
				if(error){
					mysql.close();
					cb(error);
					return;
				}
				if(contact[1][0].status == 2){
					id_event_new = contact[1][0].id_event;
					id_encrypt = contact[1][0].id;
					for(i in date){
						stmt_date += "call rc_add_date("+id_event_new+",'"+date[i]+"','"+times[i]+"','"+timef[i]+"');";
					}
					mysql.simple_query(stmt_date,function(error,dates){
						if(error){
							mysql.close();
							cb(error);
							return;
						}
						mysql.secure_query(stmt_data,[id_event_new,support,commercial,form,note],function(error,data){
							if(error){
								mysql.close();
								cb(error);
								return;
							}
							for(i in announcer){
								stmt_announcers += "call rc_add_announcer("+id_event_new+",'"+announcer[i]+"');";
							}
							mysql.simple_query(stmt_announcers,function(error,a){
								if(error){
									mysql.close();
									cb(error);
									return;
								}
								if(resource == null || resource.length == 0){
									mysql.close();
									cb(null,"Correcto","Se registró el evento",id_encrypt);
									return;
								}else{
									for(i in resource){
										stmt_resource += "call rc_add_resource("+id_event_new+",'"+resource[i]+"');";
									}
									mysql.simple_query(stmt_resource,function(error,r){
										mysql.close();
										if(error){
											cb(error);
											return;
										}
										cb(null,"Correcto","Se resgistró el evento",id_encrypt);
										return;
									});
								}
							});
						});
					});
				}else{
					mysql.close();
					cb(null,"Error","No tienes los permisos necesarios para realizar esta operación");
					return;
				}
			});
		});
	});
}
modelRemote.getRemotecontrol = function(page,cb){
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	stmt = "select sha1(ev.id_event) as id_event,ev.name_event,ev.contact,ev.phone_contact,ev.address_event,e.name_employe,ev.date_create"+
			" from event_contact ev inner join user_employes e on e.id_employe = ev.id_employe_creator"+
			" order by ev.date_create desc limit "+start+","+limit+";";
	stmt_count = "select count(*) as count from (select distinct d.id_event from event_date d inner join"+
				" event_contact c on c.id_event=d.id_event where d.date_event>=curdate()   and c.status=1  group by d.id_event) as ne;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.simple_query(stmt_count,function(error,count){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			mysql.simple_query(stmt,function(error,binnacles){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				num_pages = parseInt((count[0].count/show)+1);
				cb(null,binnacles,num_pages);
			});
		});
	});
}
modelRemote.getContact = function(id_event,cb){
	stmt = 'select u.name_employe,ec.name_event,ec.ordered_by,ec.contact,ec.phone_contact,ec.address_event,ec.place_installation,ec.date_create'+
' from event_contact ec inner join user_employes u on ec.id_employe_creator = u.id_employe where sha1(id_event) = ?;';
	values = [id_event];
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,values,function(error,contact){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,contact);
		});
	});
}
modelRemote.getDate = function(id_event,cb){
	stmt = "select date_event,time_start,time_final from event_date where sha1(id_event) = ? and date_event >= curdate();"
	values = [id_event]
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,values,function(error,dates){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,dates);
		});
	});
}
modelRemote.getAlldate = function(id_event,cb){
	stmt = "select date_event,time_start,time_final from event_date where sha1(id_event) = ?;"
	values = [id_event]
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,values,function(error,dates){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,dates);
		});
	});
}
modelRemote.getData = function(id_event,cb){
	stmt = "select support,commercial,form,observations from event_data where sha1(id_event) = ?;";
	values = [id_event]
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,values,function(error,data){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,data);
		});
	});
}
modelRemote.getResource = function(id_event,cb){
	stmt = "select sha1(id_resource) as id_resource,resoucer from event_resource where sha1(id_event) = ?;";
	values = [id_event]
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,values,function(error,resources){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,resources);
		});
	});
}
modelRemote.getAnnouncers = function(id_event,cb){
	stmt = "select sha1(u.id_employe) as id_employe,u.name_employe "+
			" from event_announcer ea inner join user_employes u on u.id_employe = ea.id_announcer where sha1(id_event) = ?";
	values = [id_event]
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,values,function(error,announcers){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,announcers);
		});
	});
}
modelRemote.updateContact = function(id_event, id_employe, name_event, ordered_by, contact, phone_contact, 
	address_event, place_installation, cb){
	stmt = "call rc_update_contact(?,?,?,?,?,?,?,?,@status); select @status as output;";
	values = [id_event, id_employe, name_event, ordered_by, contact, phone_contact, 
	address_event, place_installation];
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,values,function(error,result){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,result[1][0].output);
		});
	});
}
modelRemote.updateDate = function(id_event,id_employe,dates,start_time,final_time,cb){
	stmt_exist = "select * from user_employes where sha1(id_employe) = ? and type_employe = 2";
	stmt_delete = "delete from event_date where sha1(id_event) = ? and date_event >= curdate();";
	stmt_date = "";
	for(i in dates){
		stmt_date += " call rc_update_date('"+id_event+"','"+dates[i]+"','"+start_time[i]+"','"+final_time[i]+"');"
	}
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt_exist,[id_employe],function(error,count){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			if(count.length > 0){
				mysql.secure_query(stmt_delete,[id_event],function(error,purge){
					if(error){
						mysql.close();
						cb(error);
						return;
					}
					if(dates == null || dates.length == 0){
						mysql.close();
						cb(null,"correct","canceló el evento");
						return;
					}else{
						mysql.simple_query(stmt_date,function(error,update){
							mysql.close();
							if(error){
								cb(error);
								return;
							}
							row = false;
							cb(null,"correct","Se actualizaron las fechas");
						});
					}
				});
			}else{
				mysql.close();
				cb(null,"error","NO tienes los permisos necesarios para actualizar el contenido");
			}
		});
	});
}
modelRemote.updateData = function(id_event,id_employe,support,commercial,from,note,cb){
	stmt = "call rc_update_data(?,?,?,?,?,?,@status); select @status as output;";
	values = [id_event,id_employe,support,commercial,from,note];
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,values,function(error,result){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,result[1][0].output);
		});
	});
}
modelRemote.updateResources = function(id_event,id_employe,resources,cb){
	stmt_exist = "select * from user_employes where sha1(id_employe) = ? and type_employe = 2";
	stmt_delete = "delete from event_resource where sha1(id_event) = ?;"
	stmt_resource = "";
	for(i in resources){
		stmt_resource += "call rc_update_resource('"+id_event+"','"+resources[i]+"');";
	}
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt_exist,[id_employe],function(error,count){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			if(count.length > 0){
				mysql.secure_query(stmt_delete,[id_event],function(error,purge){
					if(error){
						mysql.close();
						cb(error);
						return;
					}
					if(resources == null || resources.length == 0){
						mysql.close();
						cb(null,"correct","Se eliminaron los recursos");
						return;	
					}else{
						mysql.simple_query(stmt_resource,function(error,update){
							if(error){
								cb(error);
								return;
							}
							cb(null,"correct","Se actualizarón los recursos");
						});
					}
				});
			}else{
				mysql.close();
				cb(null,"error","NO tienes los permisos necesarios para actualizar el contenido");
			}
		});
	});
}
modelRemote.updateAnnouncers = function(id_event,id_employe,announcers,cb){
	stmt_exist = "select * from user_employes where sha1(id_employe) = ? and type_employe = 2";
	stmt_confirm = "select id_employe from user_employes where type_employe = 4 and sha1(id_employe) = ?;";
	stmt_delete = "delete from event_announcer where sha1(id_event) = ?;"
	stmt_announcers = "";
	if(announcers.length == 0 || announcers == 0){
		cb(null,"error","Operación no permitida el reporte de control remoto debe tener por lo menos 1 locutor");
	}
	for(i in announcers){
		stmt_announcers += "call rc_update_announcers('"+id_event+"','"+announcers[i]+"');"; 
	}
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt_confirm,[announcers[1]],function(error,confirm){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			if(confirm.length == 0 || confirm == null){
				mysql.close();
				cb(null,"error","No se pudo comprobar la identidad del locutor");
				return;
			}else{
				mysql.secure_query(stmt_exist,[id_employe],function(error,count){
					if(error){
						mysql.close();
						cb(error);
						return;
					}
					if(count.length == 0){
						mysql.close();
						cb(null,"error","No tienes los permisos necesarios para modificar");
					}else{
						mysql.secure_query(stmt_delete,[id_event],function(error,purge){
							if(error){
								mysql.close()
								cb(error);
								return;
							}
							mysql.simple_query(stmt_announcers,function(error,announcers){
								mysql.close();
								if(error){
									mysql.close();
									cb(error);
									return;
								}
								cb(null,"correct","Se actualizó el locutor");
							});
						});
					}
				});
			}
		});
	});
}
modelRemote.getAll = function(page,cb){
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	stmt_count = "select count(id_event) as count from event_contact;";
	stmt_event = "select sha1(ev.id_event) as id_event,ev.name_event,ev.contact,ev.phone_contact,e.name_employe,ev.date_create"+ 
	" from event_contact ev inner join user_employes e on e.id_employe = ev.id_employe_creator inner join event_date d on d.id_event = ev.id_event"+
 	" group by d.id_event limit "+start+","+limit+";";
 	mysql.get_connection(function(gerror){
 		if(gerror){
 			cb(gerror);
 			return;
 		}
 		mysql.simple_query(stmt_count,function(error,count){
 			if(error){
 				mysql.close();
 				cb(error);
 				return;
 			}
 			mysql.simple_query(stmt_event,function(error,events){
 				mysql.close();
 				if(error){
 					cb(error);
 					return;
 				}
 				num_pages = parseInt((count[0].count/show)+1);
 				cb(null,events,num_pages);
 			});
 		});
 	});
}
modelRemote.notificacion = function(cb){
	stmt = "select count(*) as count from (select distinct d.id_event from event_date d inner join "+
			" event_contact c on c.id_event=d.id_event where d.date_event>=curdate()   and c.status=1  group by d.id_event) as ne;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(null);
			return;
		}
		mysql.simple_query(stmt,function(error,count){
			mysql.close();
			if(error){
				cb(null);
				return;
			}
			cb(count[0].count);
		});
	});
}
modelRemote.viewEvent = function(cb){
	stmt = "select sha1(ev.id_event) as id_event,ev.name_event,min(d.date_event) as date,ev.contact,ev.phone_contact,ev.address_event,e.name_employe"+
			" from event_contact ev inner join user_employes e on e.id_employe = ev.id_employe_creator inner join event_date d on d.id_event = ev.id_event"+
			" where d.date_event>=curdate() and ev.status = 1 group by d.id_event limit 50;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.simple_query(stmt,function(error,events){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,events);
		});
	});
}
module.exports = modelRemote;