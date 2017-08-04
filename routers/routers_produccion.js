var express = require("express"),
	router_archivero = require("./routers_archivero"),
	spot = require("../models/spot"),
	router = express.Router();
router.use("/archivero",router_archivero);
router.get("/",function(req,res){
	res.render("productor/index",{title:"Productor"});
});
router.get("/control_spot",function(req,res){
	messageerror = null;
	if(!req.query.page || isNaN(req.query.page) || req.query.page == 1){
		page =1
	}else{
		page = req.query.page;
	}
	spot.get_spot_producer(page,function(error,spot,count){
		if(error){
			messageerror = error;
			spot = null;
			count = null;
		}
		intpage = parseInt(page);
		if(count <= 5 || page <= 5){
			paint = [1,2,3,4,5];
		}else{
			paint = [intpage-2,intpage-1,intpage,intpage+1,intpage+2];
		}
		res.render("productor/control_spot",{title:"control spot",num_pages:count,
											position:intpage,
											paint:paint,
											spots:spot});
	});
});
router.post("/control_spot/getSpot",function(req,res){
	if(req.body.id_spot){
		id_spot = req.body.id_spot
		spot.get_information_spot(id_spot,function(error,information){
			if(error){
				res.send("Ocurrió un problema "+error);
			}else{
				spot.get_data_spot(id_spot,function(error,data){
					if(error){
						res.send("Ocurrió un problema "+error);
					}else{
						spot.getRecorded(req.body.id_spot,function(error,recorded){
							if(error){
								res.send("Ocurrió un problema "+error);
							}else{
								res.json({cartridges:data,data:information,recorded:recorded});
							}
						});
					}
				});
			}
		});
	}else{
		res.send("No sé qué esperas que haga")
	}
});
router.post("/control_spot/finished",function(req,res){
	if(req.body.id_spot){
		id_spot = req.body.id_spot;
		spot.finished(id_spot,function(error,result){
			if(error){
				res.send("Ocurrió un poblema "+error);
			}else{
				res.json({status:"correct"});
			}
		});
	}else{
		res.send("No sé qué esperas que haga");
	}
});
module.exports = router;