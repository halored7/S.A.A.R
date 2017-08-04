var mysql = require("./mysql"),
	modelReport = {};
modelReport.notification = function(cb){
	stmt = "select count(id_control) as count from report_control where confirmed = 0;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(0);
			return;
		}
		mysql.simple_query(stmt,function(error,count){
			mysql.close();
			if(error){
				cb(0);
				return;
			}
			cb(count[0].count);
		});
	});
}
modelReport.viewReport = function(cb){
	stmt = "select sha1(rc.id_control),rc.date,rc.time,u.name_employe,rp.tittle,rp.description from report_control rc inner join"+
			" report_problem rp on rc.id_control = rp.id_report inner join user_employes u on u.id_employe = rp.id_employe_report"+
			" where confirmed = 0 limit 50;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.simple_query(stmt,function(error,reports){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,reports);
		});
	});
}
modelReport.getReport = function(page,user,cb){
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	stmtCount = "select count(rc.id_control) as count from report_control rc inner join report_problem rp on rp.id_report = rc.id_control where sha1(rp.id_employe_report) = ?;";
	stmt = "select sha1(rc.id_control),rc.date,rc.time,rc.solved,rc.confirmed,rp.description from report_control rc inner join report_problem rp on"+
			" rc.id_control = rp.id_report where sha1(rp.id_employe_report) = ? order by rc.date desc limit "+start+","+limit+";";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.secure_query(stmtCount,[user],function(error,count){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			mysql.secure_query(stmt,[user],function(error,reports){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				num_pages = parseInt((count[0].count/show)+1);
				cb(null,num_pages,reports);
			});
		});
	});
}
modelReport.addReport = function(idEmploye,argument,cb){
	stmtControl = "call reportControl(@id);select @id as idControl;";
	stmtProblem = "call reportProblem(?,?,?,@stmt); select @stmt as stmt;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.simple_query(stmtControl,function(error,results){
			if(error){
				mysql.close();
				cb(error);
				return;
			}
			idControl = results[1][0].idControl;
			mysql.secure_query(stmtProblem,[idControl,idEmploye,argument],function(error,report){
				mysql.close();
				if(error){
					cb(error);
					return;
				}
				cb(null,report[1][0].stmt);
			});
		});
	});
}
module.exports = modelReport;