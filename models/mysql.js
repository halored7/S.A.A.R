const mysql = require("mysql2");
con = {};
con.executeQuery = function(stmt,values,cb){
	connection = mysql.createConnection({
		host     : '127.0.0.1',
		user     : 'root',
		password : '',
		database : 'services',
		multipleStatements: true,
		dateStrings: true
	});
	if(values == null){
		connection.query(stmt,function(err,results){
			if(err){
				console.log(err.stack);
				console.log(err.code);
				cb(err.code,null);
				return;
			}
			cb(null,results);
		});
	}else{
		connection.execute(stmt,values,function(err,results){
			if(err){
				console.log(err.stack);
				console.log(err.code);
				cb(err.code,null);
				return;
			}
			cb(null,results);
		});
	}
}
module.exports = con;