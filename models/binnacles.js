var mysql = require("./mysql"),
modelBinnacle = {};
function binnacleRequirement(id_control,requirement,cb){
	if(requirement != null || requirement.length != 0){
		stmt_requirement = "";
		for(i in requirement){
			stmt_requirement += "call binnacleReportrequerimient("+id_control+",'"+requirement[i]+"');";
		}
		mysql.get_connection(function(gerror){
			if(gerror){
				cb(gerror);
				return;
			}
			mysql.simple_query(stmt_requirement,function(error,result){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null);
			});
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
		mysql.get_connection(function(gerror){
			if(gerror){
				cb(gerror);
				return;
			}
			mysql.simple_query(stmt_lapsed,function(error,result){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null);
			});
		});
	}else{
		cb(null);
	}
}
function binnacleComment(idControl,comment,cb){
	if(comment == null || comment == ""){
		cb(null);
	}else{
		stmt_comment = "call binnacleReportcomment(?,?);";
		mysql.get_connection(function(gerror){
			if(gerror){
				cb(gerror);
				return;
			}
			mysql.secure_query(stmt_comment,[idControl,comment],function(error,result){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null);
			});
		});
	}
}
modelBinnacle.get_binnacle = function(page,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}else{
			var show = 10;
			var start = show*(page-1);
			var limit = start+show;
			var stmt_count = "select count(id_binnacle) as count from configuration_binnacle;";
			var stmt = "select sha1(id_binnacle) as id_binnacle,requirement,active from configuration_binnacle order by active desc limit "+start+","+limit+";";
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
		}
	});
}
modelBinnacle.add_binnacle = function(requerimient,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		values = [requerimient];
		mysql.secure_query("CALL binnacle_add(?);",values,function(error,results){
			mysql.close();
			if(error){
				cb(error);
			}else{
				cb(null,results);
			}
		});
	});
}
modelBinnacle.disable_enable_binnacle = function(id_binnacle,status,cb){
	status = parseInt(status);
	mysql.get_connection(function(gerror){
		if(gerror){
			console.log(gerror);
			cb(gerror);
			return;
		}
		values = [id_binnacle,status];
		mysql.secure_query("CALL binnacle_e_d(?,?);",values,function(error,results){
			mysql.close();
			if(error){
				cb(error);
			}else{
				cb(null,results);
			}
		});
	});
}
modelBinnacle.update_binnacle = function(id_binnacle,requirement,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			console.log(gerror);
			cb(gerror);
			return;
		}
		values = [id_binnacle,requirement];
		mysql.secure_query("CALL binnacle_update(?,?);",values,function(error,results){
			mysql.close();
			if(error){
				cb(error);
			}else{
				cb(null,results);
			}
		});
	});
}
modelBinnacle.add_report = function(idEmploye,timeF,requirement,lapsed,observations,cb){
	messageError = null;
	stmt_control = "call binnacleReportcontrol(?,?,@status,@id_control); select @status as status,@id_control as id_control;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt_control,[idEmploye,timeF],function(error,control){
			mysql.close();
			if(error){
				cb(error);
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
	});
}
modelBinnacle.check = function(idEmploye,cb){
	stmt = "select count(id_control) as count,final_time from binnacle_control where date = curdate() and final_time >= curtime() and sha1(id_employe) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[idEmploye],function(error,result){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,result[0].count,result[0].final_time);
		});
	});
}
modelBinnacle.getRequirement = function(cb){
	stmt = "select sha1(id_binnacle) as id_binnacle,requirement from configuration_binnacle where active = 1;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.simple_query(stmt,function(error,requirement){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,requirement);
		});
	});
}
modelBinnacle.getAll = function(page,cb){
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	stmt_count = "select count(id_control) as count from binnacle_control;";
	stmt_control = "select sha1(c.id_control) as id_control, u.name_employe,c.date,c.start_time,c.final_time from binnacle_control c inner join user_employes u "+
					"on u.id_employe = c.id_employe limit "+start+","+limit+";";
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
			mysql.simple_query(stmt_control,function(error,reports){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				num_pages = parseInt((count[0].count/show)+1);
				cb(null,reports,num_pages);
			});
		});
	});
}
modelBinnacle.getControl = function(idBinnacle,cb){
	stmt = "select u.name_employe,bc.date,bc.start_time,bc.final_time from binnacle_control bc inner join user_employes u where sha1(bc.id_control) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[idBinnacle],function(error,result){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,result);
		});
	});
}
modelBinnacle.getMaterial = function(idBinnacle,cb){
	stmt = "select cb.requirement from binnacle_requerimient br inner join configuration_binnacle cb on br.id_binnacle = cb.id_binnacle"+
			" where sha1(br.id_control) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror)
			return;
		}
		mysql.secure_query(stmt,[idBinnacle],function(error,result){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,result);
		});
	});
}
modelBinnacle.getLapsed = function(idBinnacle,cb){
	stmt = "select cc.number_day,c.type_c,c.name_c,c.validity,c.serie from binnacle_lapsed bl"+
			" inner join cartridge_lapsed cl on bl.id_report = cl.id_lapsed inner join control_cartridge cc on cl.id_c_cartridge = cc.id_control"+
			" inner join cartridge c on cc.id_control = c.id_control_c where c.state = 1 and sha1(bl.id_control) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[idBinnacle],function(error,result){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,result);
		});
	});
}
modelBinnacle.getComment = function(idBinnacle,cb){
	stmt = "select comment from binnacle_comment where sha1(id_control) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[idBinnacle],function(error,result){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,result);
		});
	});
}
modelBinnacle.viewBinnacle = function(cb){
	stmt = "select sha1(c.id_control) as id_control, u.name_employe,c.date,c.start_time,c.final_time "+
			" from binnacle_control c inner join user_employes u on u.id_employe = c.id_employe where c.view = 0 limit 50;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.simple_query(stmt,function(error,result){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,result);
		});
	});
}
module.exports = modelBinnacle;