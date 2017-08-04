events = require("../models/remoteControl");
spots = require("../models/spot");
reports = require("../models/report");
module.exports = function(req, res, next){
	if(!req.session.user_id){
		res.redirect("/");
	}else if(req.session.user_type != 2){
		res.redirect("/");
	}else{
		events.notificacion(function(count){
			if(!count){
				count = 0;
			}
			spots.notificationSale(function(cspots){
				reports.notification(function(creports){
					console.log(cspots);
					console.log(creports);
					console.log(req.session.user_id);
					if(!res.locals.USER){
					res.locals = {USER:{Name: req.session.user_name,rc:count
								},notification:{event:count,spot:cspots,report:creports}};
						console.log(res.locals.USER.Name);
						next();
					}
				});
			});
		});
	}
}