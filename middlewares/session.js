events = require("../models/remoteControl");
complaint = require("../models/complaint");
cartridges = require("../models/cartridges");
reports = require("../models/report");

module.exports = function(req, res, next){
	if(!req.session.user_id || req.session.user_type != 1){
		res.redirect("/");
	}else{
		console.log(req.session.user_id);
		if(!res.locals.USER){
			events.notificacion(function(count){
				complaint.notification(function(com){
					cartridges.notification(function(c){
						reports.notification(function(r){
							total = c+r;
							console.log(total);
							res.locals = {USER:{Name: req.session.user_name
											},notification:{events:count,complaint:com,reports:total}};
							console.log(res.locals.USER.Name);
							next();
						});
					});
				});
			});
		}else{		
			next();
		}
	}
}