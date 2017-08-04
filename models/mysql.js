var mysql = require("mysql"),
	con = {};

con.get_connection = function(cb){
	connection = mysql.createConnection({
			host     : '127.0.0.1',
			user     : 'root',
			password : '',
			database : 'services',
			multipleStatements: true,
			dateStrings: true
	});
	connection.connect(function(err){
		if(err){
			console.log(err.code);
			cb(err.code);
		}else{
			cb(null);
		}
	});
}
con.simple_query = function(stmt,cb){
	var prepare = connection.query(stmt,function(error,results,fields){
		if(error){
			results = null
			console.log(error.code);
			console.log(error.stack);
			cb(error.code,null);
			return;
		}
		console.log(results);
		cb(null,results);
	});
	console.log(prepare.sql);
}
con.secure_query = function(stmt,values,cb){
	var prepare = connection.query(stmt,values,function(error,results,fields){
		if(error){
			cb(error.code,null);
			console.log(error.code);
			console.log(error.stack);
			return;
		}
		console.log(results);
		cb(null,results);
	});
	console.log(prepare.sql);
}
con.close = function(){
	connection.destroy();
}
module.exports = con;