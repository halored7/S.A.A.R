var mysql = require("./mysql"),
modelBinnacle = {};
function binnacleRequirement(id_control,requirement,cb){
	if(requirement != null || requirement.length != 0){
		stmt_requirement = "";
		for(i in requirement){
			stmt_requirement += "call binnacleReportrequerimient("+id_control+",'"+requirement[i]+"');";
		}
		mysql.executeQuery(stmt_requirement,null,function(err,results){
			if(err){
				cb(err);
				return;
			}
			cb(null);
		});
	}else{
		cb(null);
	}
}
function lapsedCartridge(idControl,lapsed,idEmploye,cb){
	stmt_lapsed = "";
	if(lapsed != null){
		for(i in lapsed){
			stmt_lapsed += "call binnacleReportlapsed("+idControl+",'"+lapsed[i]+"','"+idEmploye+"');";
		}
		mysql.executeQuery(stmt_lapsed,null,function(err,results){
			if(err){
				cb(err);
				return;
			}
			cb(null);
		});
	}else{
		cb(null);
	}
}
function binnacleComment(idControl,comment,cb){
	if(comment == null || comment == ""){
		cb(null);
	}else{
		values = [idControl,comment];
		stmt_comment = "call binnacleReportcomment(?,?);";
		mysql.executeQuery(stmt_comment,values,function(err,results){
			if(err){
				cb(err);
				return;
			}
			cb(null);
		});
	}
}
modelBinnacle.get_binnacle = function(page,cb){
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	var stmt_count = "select count(id_binnacle) as count from configuration_binnacle;";
	var stmt = "select sha1(id_binnacle) as id_binnacle,requirement,active from configuration_binnacle order by active desc limit "+start+","+limit+";";
	mysql.executeQuery(stmt_count,null,function(err,count){
		if(err){
			cb(err);
			return;
		}
		mysql.executeQuery(stmt,null,function(err,binnacles){
			if(err){
				cb(err);
				return;
			}
			num_pages = parseInt((count[0].count/show)+1);
			cb(null,binnacles,num_pages);
		});
	});
}
modelBinnacle.add_binnacle = function(requerimient,cb){
	values = [requerimient];
	stmt = "CALL binnacle_add(?);";
	mysql.executeQuery(stmt,values,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelBinnacle.disable_enable_binnacle = function(id_binnacle,status,cb){
	status = parseInt(status);
	values = [id_binnacle,status];
	mysql.executeQuery("CALL binnacle_e_d(?,?);",values,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelBinnacle.update_binnacle = function(id_binnacle,requirement,cb){
	values = [id_binnacle,requirement];
	mysql.executeQuery("CALL binnacle_update(?,?);",values,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelBinnacle.add_report = function(idEmploye,timeF,requirement,lapsed,observations,cb){
	messageError = null;
	stmt_control = "call binnacleReportcontrol(?,?,@status,@id_control); select @status as status,@id_control as id_control;";
	values = [idEmploye,timeF];
	mysql.executeQuery(stmt_control,values,function(err,control){
		if(err){
			cb(err);
			return;
		}
		if(control[1][0].status == 2){
			id_control = control[1][0].id_control;
			binnacleRequirement(id_control,requirement,function(error){
				if(error){
					messageError += "Error al procesar los requisitos: "+error+" ";
				}
				lapsedCartridge(id_control,lapsed,idEmploye,function(error){
					if(error){
						messageError += "Error al procesar los cartuchos: "+error;
					}
					binnacleComment(id_control,observations,function(error){
						if(error){
							messageError += "Error al anexar observaciones";
						}
						cb(null,messageError,1);
					});
				});
			});
		}else{
			mysql.close();
			cb(null,"Error no puedes realizar la bitácora")
		}
	});
}
modelBinnacle.check = function(idEmploye,cb){
	stmt = "select count(id_control) as count,final_time from binnacle_control where date = curdate() and final_time >= curtime() and sha1(id_employe) = ?;";
	mysql.executeQuery(stmt,[idEmploye],function(err,result){
		if(err){
			cb(err);
			return;
		}
		cb(null,result[0].count,result[0].final_time);
	});
}
modelBinnacle.getRequirement = function(cb){
	stmt = "select sha1(id_binnacle) as id_binnacle,requirement from configuration_binnacle where active = 1;";
	mysql.executeQuery(stmt,null,function(err,requirement){
		if(err){
			cb(err);
			return;
		}
		cb(null,requirement);
	});
}
modelBinnacle.getAll = function(page,cb){
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	stmt_count = "select count(id_control) as count from binnacle_control;";
	stmt_control = "select sha1(c.id_control) as id_control, u.name_employe,c.date,c.start_time,c.final_time from binnacle_control c inner join user_employes u "+
					"on u.id_employe = c.id_employe limit "+start+","+limit+";";
	mysql.executeQuery(stmt_count,null,function(err,count){
		if(err){
			cb(err);
			return;
		}
		mysql.executeQuery(stmt_control,function(err,reports){
			if(err){
				cb(err);
				return;
			}
			num_pages = parseInt((count[0].count/show)+1);
			cb(null,reports,num_pages);
		});
	});
}
modelBinnacle.getControl = function(idBinnacle,cb){
	stmt = "select u.name_employe,bc.date,bc.start_time,bc.final_time from binnacle_control bc inner join user_employes u where sha1(bc.id_control) = ?;";
	mysql.executeQuery(stmt,[idBinnacle],function(err,result){
		if(err){
			cb(err);
			return;
		}
		cb(null,result);
	});
}
modelBinnacle.getMaterial = function(idBinnacle,cb){
	stmt = "select cb.requirement from binnacle_requerimient br inner join configuration_binnacle cb on br.id_binnacle = cb.id_binnacle"+
			" where sha1(br.id_control) = ?;";
	mysql.executeQuery(stmt,[idBinnacle],function(err,result){
		if(err){
			cb(err);
			return;
		}
		cb(null,result);
	});
}
modelBinnacle.getLapsed = function(idBinnacle,cb){
	stmt = "select cc.number_day,c.type_c,c.name_c,c.validity,c.serie from binnacle_lapsed bl"+
			" inner join cartridge_lapsed cl on bl.id_report = cl.id_lapsed inner join control_cartridge cc on cl.id_c_cartridge = cc.id_control"+
			" inner join cartridge c on cc.id_control = c.id_control_c where c.state = 1 and sha1(bl.id_control) = ?;";
	mysql.executeQuery(stmt,[idBinnacle],function(err,result){
		if(err){
			cb(err);
			return;
		}
		cb(null,result);
	});
}
modelBinnacle.getComment = function(idBinnacle,cb){
	stmt = "select comment from binnacle_comment where sha1(id_control) = ?;";
	mysql.executeQuery(stmt,[idBinnacle],function(err,result){
		if(err){
			cb(err);
			return;
		}
		cb(null,result);
	});
}
modelBinnacle.viewBinnacle = function(cb){
	stmt = "select sha1(c.id_control) as id_control, u.name_employe,c.date,c.start_time,c.final_time "+
			" from binnacle_control c inner join user_employes u on u.id_employe = c.id_employe where c.view = 0 limit 50;";
	mysql.executeQuery(stmt,null,function(err,result){
		if(err){
			cb(err);
			return;
		}
		cb(null,result);
	});
}
module.exports = modelBinnacle;