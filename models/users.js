var mysql = require("./mysql"),
modelUser = {};
modelUser.session = function(user,password,cb){
	stmt = "SELECT sha1(id_employe) as id_employe,name_employe,type_employe,active,date_eliminate FROM user_employes WHERE name_employe = ? AND password_employe = ? LIMIT 1;";
	params = [user,password];
	mysql.executeQuery(stmt,params,function(err,user){
		if(err){
			cb(err);
			return;
		}
		cb(null,user);
	});
}
modelUser.get_users = function(page,cb){
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	var stmt_count = "select count(id_employe) as count from user_employes where type_employe<>1;";
	var stmt = "select sha1(u.id_employe) as id_employe,u.name_employe,t.name_type,u.level_employe,u.date_creating,u.date_eliminate,u.active"+
	" FROM user_employes u inner join deparment t on u.type_employe=t.id_type where u.type_employe<>1 "+
	" order by u.active desc,u.date_creating desc limit "+start+","+limit+";";
	mysql.executeQuery(stmt_count,null,function(err,count){
		if(err){
			cb(err);
			return;
		}
		mysql.executeQuery(stmt,null,function(err,users){
			if(err){
				cb(err);
				return;
			}
			num_pages = parseInt((count[0].count/show)+1);
			cb(null,users,num_pages);
		});
	});
}
modelUser.add_employe = function(name,password,type,level,date,cb){
	type = parseInt(type);
	level = parseInt(level);
	if(!date || date === null){
		date = "";
	}
	values = [name,password,type,level,date];
	stmt = "CALL employe_add(?,?,?,?,?,@status_e,@id); select @status_e as output,@id as idinsert;";
	mysql.executeQuery(stmt,values,function(err,results){
		if(err){
			cb(err);
			return;
		}
		status = results[1][0].output;
		new_employe = [results[1][0].idinsert,name,type];
		cb(null,status,new_employe);
	});
}
modelUser.update_employe = function(id_employe,name,type,level,date,cb){
	type = parseInt(type);
	level = parseInt(level);
	values = [id_employe,name,type,level,date];
	stmt = "CALL employe_update(?,?,?,?,?);";
	mysql.executeQuery(stmt,values,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelUser.disable_enable_employe = function(id_employe,status,cb){
	status = parseInt(status);
	values = [id_employe,status];
	stmt = "CALL employe_e_d(?,?);";
	mysql.executeQuery(stmt,values,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelUser.show_announcer = function(cb){
	stmt = "select sha1(id_employe) as id_employe, name_employe from user_employes where type_employe = 4;";
	mysql.executeQuery(stmt,null,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelUser.show_producer = function(cb){
	stmt = "select sha1(id_employe) as id_employe, name_employe from user_employes where type_employe = 3;";
	mysql.executeQuery(stmt,null,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelUser.reset_password = function(id_employe,password,cb){
	values = [id_employe,password];
	stmt = "CALL employe_rp(?,?);";
	mysql.executeQuery(stmt,values,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
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
	values = [id_employe];
	stmt = "select name_employe,password_employe,date_eliminate from user_employes where sha1(id_employe) = ?;";
	mysql.executeQuery(stmt,null,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelUser.changeData = function(idEmploye,name,password,cb){
	values = [idEmploye,name,password];
	stmt = "call employe_change(?,?,?);";
	mysql.executeQuery(stmt,null,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelUser.checkadministrador = function(idAdministrador,cb){
	values = [idAdministrador];
	stmt = "select id_employe from user_employes where type_employe = 1 and sha1(id_employe) = ?;";
	mysql.executeQuery(stmt,values,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
modelUser.reset = function(idEmploye,password,cb){
	values = [idEmploye,password];
	stmt = "call employe_reset(?,?);";
	mysql.executeQuery(stmt,values,function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
module.exports = modelUser;