events = require("../models/remoteControl");
reports = require("../models/report");
spots = require("../models/spot");
module.exports = function(req, res, next){
	if(!req.session.user_id){
		res.redirect("/");
	}else if(req.session.user_type != 3){
		res.redirect("/");
	}else{
		events.notificacion(function(count){
			if(!count){
				count = 0;
			}
			reports.notification(function(creports){
				spots.notificationProducer(function(rspots){
					console.log(req.session.user_id);
					if(!res.locals.USER){
						res.locals = {USER:{Name: req.session.user_name
									},notification:{event:count,report:creports,spot:rspots}};
						console.log(res.locals.USER.Name);
						next();
					}
				});
			});
		});
	}
}