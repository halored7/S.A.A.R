var mysql = require("./mysql"),
	modelComplaint = {};

modelComplaint.notification = function(cb){
	stmt = "select count(id_complaint) as count from complaint where viewed = 0;";
	mysql.executeQuery(stmt,null,function(err,count){
		if(err){
			cb(0);
			return;
		}
		cb(count[0].count);
	});
}
modelComplaint.viewComplaint = function(cb){
	stmt = "select sha1(id_complaint) as id_complaint,description from complaint order by date desc limit 50;";
	mysql.executeQuery(stmt,null,function(err,complaint){
		if(err){
			cb(err);
		}
		cb(null,complaint);
	});
}
modelComplaint.deleteComplaint = function(idComplaint,cb){
	stmt = "delete from complaint where sha1(id_complaint) = ?;";
	mysql.executeQuery(stmt,[idComplaint],function(err,results){
		if(err){
			cb(err);
			return;
		}
		cb(null,results);
	});
}
module.exports = modelComplaint;