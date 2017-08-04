var mysql = require('./mysql'),
modelSpot = {}
modelSpot.get_spot = function(page,cb){
	page = parseInt(page);
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	var stmt_count = "select count(id_spot) as count from spot_control;";
	var stmt = "select sha1(sc.id_spot) as id_spot,u.name_employe,sc.sent_date,sc.sent_time,sc.received_date,sc.received_time,sc.finished_date,sc.finished_time,group_concat(DISTINCT c.serie SEPARATOR '-') as serie"+
				" from spot_control sc inner join user_employes u on sc.id_employe_c = u.id_employe inner join spot_data sd on sd.id_spot=sc.id_spot inner join"+
				" cartridge c on c.id_control_c=sd.id_cartridge group by sc.id_spot order by sc.sent_date desc limit "+start+","+limit+";";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
		}else{
			mysql.simple_query(stmt_count,function(error,count){
				if(error){
					mysql.close();
					cb(error.code);
					return;
				}
				mysql.simple_query(stmt,function(error,spot){
					mysql.close();
					if(error){
						cb(error.code);
						return;
					}
					num_pages = parseInt((count[0].count/show)+1);
					cb(null,spot,num_pages);
				});
			});
		}
	});
}
modelSpot.get_spot_producer = function(page,cb){
	page = parseInt(page);
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	stmt_count = "select count(id_spot) as count from spot_control where finished = 0;";
	stmt = "select sha1(sc.id_spot) as id_spot,sc.id_employe_c,u.name_employe,sc.sent_date,sc.sent_time,sc.finished,sc.received_date,"+
	"sc.received_time,group_concat(DISTINCT c.serie SEPARATOR '-') as serie"+
		" from spot_control sc inner join user_employes u on u.id_employe=sc.id_employe_c inner join spot_data sd on "+
		"sd.id_spot=sc.id_spot inner join cartridge c on c.id_control_c=sd.id_cartridge"+
		" group by sc.id_spot order by sc.sent_date desc limit "+start+","+limit+";";
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
			num_pages = parseInt((count[0].count/show)+1);
			mysql.simple_query(stmt,function(error,spot){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null,spot,num_pages);
			});
		});
	});
}
modelSpot.get_information_spot = function(id_spot,cb){
	stmt = "select date_start,type,priority,duration,sha1(recorded) as recorded,type_music,note from spot_information where sha1(id_spot)=?;";
	id = [id_spot];
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,id,function(error,information){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,information);
		});
	});
}
modelSpot.get_data_spot = function(id_spot,cb){
	stmt = "select sha1(sd.id_cartridge) as id_cartridge,sd.idea,cc.number_day,c.type_c,c.name_c,c.validity,c.serie"+
		" from spot_data sd inner join control_cartridge cc on cc.id_control=sd.id_cartridge inner join cartridge c on c.id_control_c=sd.id_cartridge"+
		" where c.state=1 and sha1(sd.id_spot)=?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[id_spot],function(error,data){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,data);
		});
	});
}
modelSpot.getRecorded = function(idSpot,cb){
	stmt = "select u.name_employe from spot_information si inner join user_employes u on u.id_employe = si.recorded where sha1(id_spot) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[idSpot],function(error,results){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,results);
		});
	});
}
modelSpot.finished = function(id_spot,cb){
	stmt = "call spot_finished(?);"
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[id_spot],function(error,results){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,results);
		});
	});
}
modelSpot.getAll = function(page,cb){
	var show = 15;
	var start = show*(page-1);
	var limit = start+show;
	stmt_count = "select count(id_spot) as count from spot_control;";
	stmt_spot = "select sha1(sc.id_spot) as id_spot,u.name_employe,sc.sent_date,sc.sent_time,sc.finished,sc.received_date,sc.received_time,group_concat(DISTINCT c.serie SEPARATOR '-') as serie"+
				" from spot_control sc inner join user_employes u on u.id_employe=sc.id_employe_c inner join spot_data"+
				" sd on sd.id_spot=sc.id_spot inner join cartridge c on c.id_control_c=sd.id_cartridge"+
				" group by sc.id_spot order by sc.sent_date desc limit "+start+","+limit+";";
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
			mysql.simple_query(stmt_spot,function(error,spots){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				num_pages = parseInt((count[0].count/show)+1);
				cb(null,spots,num_pages);
			});
		});
	});
}
modelSpot.avaliableCartridge = function(cartridge,cb){
	avaliable = true;
	stmt = "";
	for(i in cartridge){
		stmt += "select id_control from control_cartridge where in_use = 0 and sha1(id_control) = '"+cartridge[i]+"';"
	}
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.simple_query(stmt,function(error,results){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			if(results.length > 0){
				for(i in results){
					if(results[i] == null || results[i].length == 0){
						avaliable = false
					}
				}
			}else{
				avaliable = false;
			}
			cb(null,avaliable);
		});
	});
}
modelSpot.addSpot = function(employe,date_start,type,priority,duration,recorded,music,note,cartridges,ideas,cb){
	stmtControl = "call spot_control(?,@control,@id); select @control as control, @id as newid;";
	stmtData = "";
	stmtInformation = "call spot_control_information(?,?,?,?,?,?,?,?);";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmtControl,[employe],function(error,control){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			if(control[1][0].control == 0){
				mysql.close();
				cb("No tienes los permisos necesarios");
				return;
			}
			for(i in cartridges){
				stmtData += "call spot_control_data("+control[1][0].control+",'"+cartridges[i]+"','"+ideas[i]+"');";
			}
			mysql.simple_query(stmtData,function(error,data){
				if(error){
					mysql.close();
					cb(error);
					return;
				}
				mysql.secure_query(stmtInformation,[control[1][0].control,date_start,type,parseInt(priority),duration,recorded,music,note],function(error,information){
					mysql.close();
					if(error){
						mysql.close();
						cb(error);
						return;
					}
					cb(null,control[1][0].newid);
				});
			});
		});
	});
}
modelSpot.updateSpotinformation = function(idEmploye,idSpot,date_start,type,priority,duration,recorded,music,note,cb){
	stmt = "call spot_update_information(?,?,?,?,?,?,?,?,?,@stmt); select @stmt as stmt;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[idEmploye,idSpot,date_start,type,parseInt(priority),duration,recorded,music,note],function(error,results){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,results[1][0].stmt);
		});
	});
}
modelSpot.updateDatainformation = function(idEmploye,idSpot,cartridges,ideas,cb){
	stmtCheck = "select count(id_employe) as count from user_employes where sha1(id_employe) = ?;";
	stmtDelete = "delete from spot_data where sha1(id_spot) = ?;";
	stmtData = "";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmtCheck,[idEmploye],function(error,results){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			if(results[0].count == 0){
				mysql.close();
				cb("No tienes los permisos necesarios para relizar esta operación");
				return;
			}
			mysql.secure_query(stmtDelete,[idSpot],function(error,dele){
				if(error){
					mysql.close();
					cb(error);
					return;
				}
				for(i in cartridges){
					stmtData += "call spot_update_data('"+idSpot+"','"+cartridges[i]+"','"+ideas[i]+"',@status); select @status as status;";
				}
				mysql.simple_query(stmtData,function(error,data){
					mysql.close();
					if(error){
						cb(error);
						return;
					}
					cb(null);
				});
			});
		});
	});
}
modelSpot.notificationSale = function(cb){
	stmt = "select count(id_spot) as count from spot_control where finished = 1 and confirmed = 0;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(0);
			return;
		}
		mysql.simple_query(stmt,function(error,results){
			mysql.close();
			if(error){
				cb(0);
				return;
			}
			cb(results[0].count);
		});
	});
}
modelSpot.notificationProducer = function(cb){
	stmt = "select count(id_spot) as count from spot_control where finished = 0 and confirmed = 0;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(0);
			return;
		}
		mysql.simple_query(stmt,function(error,results){
			mysql.close();
			if(error){
				cb(0);
				return;
			}
			cb(results[0].count);
		});
	});
}
module.exports = modelSpot;