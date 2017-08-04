var tmp = require("os").tmpdir();
var phantom = require('phantom');
	fs = require('fs');
pdf = {};
pdf.createpdf = function(url,namefile,cb){
	phantom.create().then(function(ph){
		ph.createPage().then(function(page){
			page.open("http://localhost:8000/"+url).then(function(status){
				page.render(tmp+'/'+file+".pdf").then(function(){
					rute = tmp+'/'+file+".pdf";
					console.log('pdf generado en '+rute);
					ph.exit();
					cb(rute);
				});
			});
		});
	});
}
pdf.deletepdf = function(namefile){
	fs.unlink(namefile, function(err){
		if(err) throw err;
		console.log(err);
	});
}
module.exports = pdf;