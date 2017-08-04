function loading(id_button){
	$(id_button).attr("disabled",true);
	$(id_button).removeClass("btn-primary");
	$(id_button).addClass("loading");
}
function loading_stop(id_button){
	$(id_button).removeClass("loading");
	$(id_button).addClass("btn btn-primary");
	$(id_button).button('reset');
}
