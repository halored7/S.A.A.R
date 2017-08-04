var mysql = require("./mysql"),
	modelComplaint = {};

modelComplaint.notification = function(cb){
	stmt = "select count(id_complaint) as count from complaint where viewed = 0;";
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
modelComplaint.viewComplaint = function(cb){
	stmt = "select sha1(id_complaint) as id_complaint,description from complaint order by date desc limit 50;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(gerror);
			return;
		}
		mysql.simple_query(stmt,function(error,complaint){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,complaint);
		});
	});
}
modelComplaint.deleteComplaint = function(idComplaint,cb){
	stmt = "delete from complaint where sha1(id_complaint) = ?;";
	mysql.get_connection(function(gerror){
		if(gerror){
			cb(error);
			return;
		}
		mysql.secure_query(stmt,[idComplaint],function(error,results){
			mysql.close();
			if(error){
				cb(error);
				return;
			}
			cb(null,results);
		});
	});
}
module.exports = modelComplaint;