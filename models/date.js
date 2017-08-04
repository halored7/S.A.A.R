module.exports = function(){
	arraymonth= new Array();
	arraymonth[0]="Enero";
	arraymonth[1]="Febrero";
	arraymonth[2]="Marzo";
	arraymonth[3]="Abril";
	arraymonth[4]="Mayo";
	arraymonth[5]="Junio";
	arraymonth[6]="Julio";
	arraymonth[7]="Agosto";
	arraymonth[8]="Semptimbre";
	arraymonth[9]="Octubre";
	arraymonth[10]="Noviembre";
	arraymonth[11]="Diciembre";
	arraymonth["Enero"] = 1;
	arraymonth["Febro"] = 2;
	arraymonth["Marzo"] = 3;
	arraymonth["Abril"] = 4;
	arraymonth["Mayo"] = 5
	arraymonth["Junio"] = 6;
	arraymonth["Julio"] = 7;
	arraymonth["Agosto"] = 8;
	arraymonth["Septiembre"] = 9;
	arraymonth["Octubre"] = 10;
	arraymonth["Nombiembre"] = 11;
	arraymonth["Diciembre"] = 12;
	var now=new Date();
	this.date_toString = function(date){
		if(text = arraymonth[date]){
			return text;	
		}else{
			return false;
		}
	}
	this.date_now = function(){
		month = arraymonth[now.getMonth()];
		return month;
	}
	this.year_now = function(){
		return now.getFullYear();
	}
}