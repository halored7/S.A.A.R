var mysql = require("./mysql"),
modelUser = {};
modelUser.session = function(user,password,cb){
	stmt = "SELECT sha1(id_employe) as id_employe,name_employe,type_employe,active,date_eliminate FROM user_employes WHERE name_employe = ? AND password_employe = ? LIMIT 1;";
	params = [user,password];
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
		}else{
			mysql.secure_query(stmt,params,function(error,user){
				mysql.close();
				if(error){
					cb(error.code);
				}
				cb(null,user);
			});
		}
	});
}
modelUser.get_users = function(page,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);

		}else{
			var show = 10;
			var start = show*(page-1);
			var limit = start+show;
			var stmt_count = "select count(id_employe) as count from user_employes where type_employe<>1;";
			var stmt = "select sha1(u.id_employe) as id_employe,u.name_employe,t.name_type,u.level_employe,u.date_creating,u.date_eliminate,u.active"+
			" FROM user_employes u inner join deparment t on u.type_employe=t.id_type where u.type_employe<>1 "+
			" order by u.active desc,u.date_creating desc limit "+start+","+limit+";";
			mysql.simple_query(stmt_count,function(error,count){
				if(error){
					mysql.close();
					cb("error executing query");
				}
			mysql.simple_query(stmt,function(error,users){
					mysql.close();
					if(error){
						cb("error executing query");
					}
					num_pages = parseInt((count[0].count/show)+1);
					cb(null,users,num_pages);
				});
			});
		}
	});
}
modelUser.add_employe = function(name,password,type,level,date,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			console.log(gerror);
			cb(gerror);
			return;
		}
		type = parseInt(type);
		level = parseInt(level);
		if(!date || date === null){
			date = "";
		}
		values = [name,password,type,level,date];
		mysql.secure_query("CALL employe_add(?,?,?,?,?,@status_e,@id);"+
			" select @status_e as output,@id as idinsert;",values,function(error,results){
			mysql.close();
			if(error){
				cb(error);
			}else{
				status = results[1][0].output;
				new_employe = [results[1][0].idinsert,name,type];
				cb(null,status,new_employe);
			}
		});
	});
}
modelUser.update_employe = function(id_employe,name,type,level,date,cb){
	type = parseInt(type);
	level = parseInt(level);
	mysql.get_connection(function(gerror){
		if(gerror){
			console.log(gerror);
			cb(gerror);
			return;
		}
		values = [id_employe,name,type,level,date];
		mysql.secure_query("CALL employe_update(?,?,?,?,?);",values,function(error,results){
			mysql.close();
			if(error){
				cb(error);
			}else{
				cb(null,results);
			}
		});
	});
}
modelUser.disable_enable_employe = function(id_employe,status,cb){
	status = parseInt(status);
	mysql.get_connection(function(gerror){
		if(gerror){
			console.log(gerror);
			cb(gerror);
			return;
		}
		values = [id_employe,status];
		mysql.secure_query("CALL employe_e_d(?,?);",values,function(error,results){
			mysql.close();
			if(error){
				cb(error);
			}else{
				cb(null,results);
			}
		});
	});
}
modelUser.show_announcer = function(cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			console.log(gerror);
			cb(gerror);
			return;
		}
		mysql.simple_query("select sha1(id_employe) as id_employe, name_employe from user_employes where type_employe = 4;",function(error,announcer){
			mysql.close();
			if(error){
				cb(error);
			}else{
				cb(null,announcer);
			}
		});
	});
}
modelUser.show_producer = function(cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			console.log(gerror);
			cb(gerror);
			return;
		}
		mysql.simple_query("select sha1(id_employe) as id_employe, name_employe from user_employes where type_employe = 3;",function(error,producer){
			mysql.close();
			if(error){
				cb(error);
			}else{
				cb(null,producer);
			}
		});
	});
}
modelUser.reset_password = function(id_employe,password,cb){
	mysql.get_connection(function(gerror){
		if(gerror){
			console.log(gerror);
			cb(gerror);
			return;
		}
		values = [id_employe,password];
		mysql.secure_query("CALL employe_rp(?,?);",values,function(error,results){
			mysql.close();
			if(error){
				cb(error);
			}else{
				cb(null,results);
			}
		});
	});
}
modelUser.generate_password = function(len){
	var string = "",
		op,
		i = 0,
		char = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for(;i<len;i++){
		op = Math.floor(Math.random()*char.length);
		string += char.substring(op,op+1);
	}
	return string;
}
modelUser.getUser = function(id_employe,cb){
	stmt = "select name_employe,password_employe,date_eliminate from user_employes where sha1(id_employe) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[id_employe],function(error,employe){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,employe);
		});
	});
}
modelUser.changeData = function(idEmploye,name,password,cb){
	stmt = "call employe_change(?,?,?);";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[idEmploye,name,password],function(error,results){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,results);
		});
	});
}
modelUser.checkadministrador = function(idAdministrador,cb){
	stmt = "select id_employe from user_employes where type_employe = 1 and sha1(id_employe) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[idAdministrador],function(error,results){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,results);
		});
	});
}
modelUser.reset = function(idEmploye,password,cb){
	stmt = "call employe_reset(?,?);";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmt,[idEmploye,password],function(error,results){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,results);
		});
	});
}
module.exports = modelUser;