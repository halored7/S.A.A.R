var db = require('./connect_mysql'),
	crypto = require("../crypto.js"),
	mysql = new db();
	c = new crypto();
module.exports = function(){
	this.show_producer = function(cb){
		stmt = "select id_employe, name_employe from user_employes where type_employe = 3;";
		mysql.conexion(function(error){
			cb(error,null,null);
			return;
		});
		arraycontent = new Array();
		p = 0;
		mystream = mysql.stream_query(stmt);
		mystream.on('error',function(err){
			console.log(err);
		}).on('result',function(row){
			mysql.pause();
			id_encrypt(row,function(){
				mysql.reanude();
			});

		}).on('end',function(){
			mysql.cerrar_conexion();
			console.log(arraycontent);
			cb(null,arraycontent);
		});
	}
	function id_encrypt(row,next){
		txt = row.id_employe;
		arraycontent[p] = [txt,row.name_employe];
		p++;
		next();
	}
}