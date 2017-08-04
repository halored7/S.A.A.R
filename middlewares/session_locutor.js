events = require("../models/remoteControl");
module.exports = function(req, res, next){
	if(!req.session.user_id){
		res.redirect("/");
	}else if(req.session.user_type != 4){
		res.redirect("/");
	}else{
		events.notificacion(function(count){
			if(!count){
				count = 0;
			}
			console.log(req.session.user_id);
			if(!res.locals.USER){
				res.locals = {USER:{Name: req.session.user_name
							},notification:{event:count}};
				console.log(res.locals.USER.Name);
				next();
			}
		});
	}
}