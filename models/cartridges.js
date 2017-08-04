var mysql = require("./mysql"),
	d = require('./date.js'),
	df = new d(),
	modelCartridge = {};
modelCartridge.show_this_month = function(year,month,cb){
	var stmt_date = "",
		stmt_cartridge = "";
	if(year == null || month == null){
		stmt_date = "select date_day as date"+
		" from control_cartridge "+
		" where year(date_day)=year(now()) and month(date_day)=month(now()) group by date_day desc;";
	}else{
		year = parseInt(year)+"-00-00";
		if(month <= 9){
			month = "0000-0"+parseInt(month)+"-00";
		}else{
			month = "0000-"+parseInt(month)+"-00";
		}
		stmt_date = "select date_day as date"+
		" from control_cartridge"+
		" where year(date_day)=year('"+year+"') and month(date_day)=month('"+month+"') group by date_day desc;";
	}
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}else{
			mysql.simple_query(stmt_date,function(error,cartridges_date){
				if(error){
					mysql.close();
					cb(error);
					return;
				}
				arraydates = [];
				p = 0;
				check = 0;
				for(i in cartridges_date){
					stmt_cartridge += "select sha1(cc.id_control) as id_control,cc.number_day,cc.in_use,cc.active,cc.date_day,u.name_employe as creator,"+
						"ue.name_employe as producer,c.type_c,c.name_c,c.validity,c.serie,c.date_create,c.state"+
					 " from control_cartridge cc inner join cartridge c on c.id_control_c=cc.id_control"+
					" inner join user_employes u on u.id_employe=c.id_employe_creator inner join user_employes ue on"+
					" ue.id_employe=c.id_producer  where cc.date_day = '"+cartridges_date[i].date+"' and c.state =1 order by cc.number_day;";
					check++;
				}
				mysql.simple_query(stmt_cartridge,function(error,cartridges){
					mysql.close();
					if(error){
						cb(error);
						return;
					}
					for(i in cartridges_date){
						date_format = new Date(cartridges_date[i].date+" 00:00:00");
						month_format = df.date_toString(date_format.getMonth());
						day_format = date_format.getDate();
						year_format = date_format.getFullYear();
						format = day_format+" de "+month_format+" "+year_format;
						if(check == 1){
							arraydates[p] = [cartridges_date[i].date,format,cartridges];	
						}else{
						arraydates[p] = [cartridges_date[i].date,format,cartridges[i]];	
						}
						p++;
					}
					cb(null,arraydates);
				});
			});
		}
	});
}
modelCartridge.avalible_date = function(cb){
	stmt = "select year(date_day) as year,month(date_day) as month "+
			"from control_cartridge  group by month(date_day) order by year(date_day) desc,month(date_day) desc;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}else{
			mysql.simple_query(stmt,function(error,results){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null,results);
			});
		}
	});
}
modelCartridge.add_cartridge = function(type,concept,datev,serie,producer,employe_c,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}else{
			values = [type,concept,datev,serie,producer,employe_c];
			mysql.secure_query("CALL cartridge_add(?,?,?,?,?,?,@status_c,@newid); select @status_c as output,@newid as idC;",values,function(error,results){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null,results);
			});
		}
	});
}
modelCartridge.update_cartridge = function(id_c,type,concept,datev,serie,producer,employe_c,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}else{
			values = [id_c,type,concept,datev,serie,producer,employe_c];
			mysql.secure_query("CALL cartridge_update(?,?,?,?,?,?,?,@status_c); select @status_c as output;",values,function(error,results){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null,results);
			});
		}
	});
}
modelCartridge.delete_cartridge = function(id_c,id_e,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
		}else{
			values = [id_c,id_e];
			mysql.secure_query("CALL cartridge_delete(?,?,@status_c); select @status_c as output;",values,function(error,results){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null,results);
			});
		}
	});
}
modelCartridge.new_version = function(num,datec,type,concept,datev,serie,producer,employe_c,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
		}else{
			values = [num,datec,type,concept,datev,serie,producer,employe_c];
			mysql.secure_query("CALL cartridge_newv(?,?,?,?,?,?,?,?,@status_c); select @status_c as output;",values,function(error,results){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null,results);
			});
		}
	});
}
modelCartridge.show_select_cartridge = function(cb){
	stmt = "select sha1(cc.id_control) as id_control,cc.number_day,c.type_c,c.name_c,c.validity,c.serie from control_cartridge"+
		" cc inner join cartridge c on cc.id_control = c.id_control_c where cc.in_use =  0;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
		}else{
			mysql.simple_query(stmt,function(error,results){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null,results);
			});
		}
	});
}
modelCartridge.getCartridgebySerie = function(serie,cb){
	serie = '%'+serie+'%';
	stmt = "select sha1(cc.id_control) as id_control,cc.number_day,c.type_c,c.name_c,c.validity,c.serie from control_cartridge cc inner join cartridge c on"+
			" cc.id_control = c.id_control_c where c.state=1 and c.serie like ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[serie],function(error,cartridge){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,cartridge);
		});
	});
}
modelCartridge.getAllinfo = function(id_cartridge,cb){
	stmt_control = "select number_day,date_day,time_day,in_use from control_cartridge where sha1(id_control) = ?;";
	stmt = "select u.name_employe as sale,up.name_employe as producer,c.type_c,c.name_c,c.validity,c.serie,c.date_create,state from cartridge c"+
			" inner join user_employes u on u.id_employe = c.id_employe_creator inner join user_employes up on up.id_employe = c.id_producer where sha1(c.id_control_c) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt_control,[id_cartridge],function(error,info){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			mysql.secure_query(stmt,[id_cartridge],function(error,data){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null,info,data);
			});
		});
	});
}
modelCartridge.notification = function(cb){
	stmt = "select count(id_lapsed) as count from cartridge_lapsed where solved = 0;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(0);
			return;
		}
		mysql.simple_query(stmt,function(error,count){
			mysql.close();
			if(error){
				cb(0);
				return
			}
			cb(count[0].count);
		});
	});
}
module.exports = modelCartridge;