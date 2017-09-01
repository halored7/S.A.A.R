var mysql = require("./mysql"),
	modelReport = {};
modelReport.notification = function(cb){
	stmt = "select count(id_control) as count from report_control where confirmed = 0;";
	mysql.executeQuery(stmt,null,function(err,count){
		if(err){
			cb(0);
			return;
		}
		cb(count[0].count);
	});
}
modelReport.viewReport = function(cb){
	stmt = "select sha1(rc.id_control),rc.date,rc.time,u.name_employe,rp.tittle,rp.description from report_control rc inner join"+
			" report_problem rp on rc.id_control = rp.id_report inner join user_employes u on u.id_employe = rp.id_employe_report"+
			" where confirmed = 0 limit 50;";
	mysql.executeQuery(stmt,null,function(err,reports){
		if(err){
			cb(err);
			return;
		}
		cb(null,reports);
	});
}
modelReport.getReport = function(page,user,cb){
	var show = 10;
	var start = show*(page-1);
	var limit = start+show;
	stmtCount = "select count(rc.id_control) as count from report_control rc inner join report_problem rp on rp.id_report = rc.id_control where sha1(rp.id_employe_report) = ?;";
	stmt = "select sha1(rc.id_control),rc.date,rc.time,rc.solved,rc.confirmed,rp.description from report_control rc inner join report_problem rp on"+
			" rc.id_control = rp.id_report where sha1(rp.id_employe_report) = ? order by rc.date desc limit "+start+","+limit+";";
	mysql.executeQuery(stmtCount,[user],function(err,count){
		if(err){
			cb(err);
			return;
		}
		mysql.executeQuery(stmt,[user],function(err,reports){
			if(err){
				cb(err);
				return;
			}
			num_pages = parseInt((count[0].count/show)+1);
			cb(null,num_pages,reports);
		});
	});
}
modelReport.addReport = function(idEmploye,argument,cb){
	stmtControl = "call reportControl(@id);select @id as idControl;";
	stmtProblem = "call reportProblem(?,?,?,@stmt); select @stmt as stmt;";
	mysql.executeQuery(stmtControl,null,function(err,results){
		if(err){
			cb(err);
			return;
		}
		idControl = results[1][0].idControl;
		mysql.executeQuery(stmtProblem,[idControl,idEmploye,argument],function(err,report){
			if(err){
				cb(err);
				return;
			}
			cb(null,report[1][0].stmt);
		});
	});
}
module.exports = modelReport;