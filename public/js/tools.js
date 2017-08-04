function loading(id_button){
	$(id_button).attr("disabled",true);
	$(id_button).removeClass("btn-primary");
	$(id_button).addClass("loading");
}
function loading_stop(id_button){
	$(id_button).removeClass("loading");
	$(id_button).addClass("btn btn-primary");
	$(id_button).attr("disabled",false);
}
function message(id_div,message){
	$(id_div).append(message);
}
function reset_form(id_form){
	$(id_form)[0].reset();
}
function div_empty(id_div){
	$(id_div).empty();
}
function ajax(url,data,id_button,layout_block,cb){
	if(layout_block){
		Add_load()
	}
	loading(id_button);
	$.ajax({
			url: url,
			type: 'POST',
			data: data
		})
		.done(function(response){
			loading_stop(id_button);
			remove_load();
			cb(response);
		}).fail(function(jqXHR, textStatus, errorThrown){
			remove_load();
			alert("Ocurrio un problema :"+errorThrown);
			cb(null);
		});
}
function alert_message(tipo,message){
	if (tipo == "c"){
		alert = '<div class="alert alert-success alert-dismissible" role="alert">'+
						'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
							'<span aria-hidden="true">&times;</span>'+
						'</button>'+
						'<strong>Correcto: </strong> '+message
					'</div>';
	}else if(tipo == "e"){
		alert = '<div class="alert alert-danger alert-dismissible" role="alert">'+
						'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
							'<span aria-hidden="true">&times;</span>'+
						'</button>'+
						'<strong>Advertencia: </strong> '+message
			'</div>';
	}
	return alert;
}
function add_DOM(id_contenedor,object){
	$(id_contenedor).append(object);
}
function remove_load(){
	$("#On_Load").remove();
}
function Add_load(){
	remove_load();
	mensaje = "Procesando la información<br>Espere por favor";
    height = 20;
    circule = '<svg class="loader" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">'+
	  '<circle class="inner-circle" cx="70" cy="70" r="32"></circle>'+
	  '<circle class="outer-circle" cx="70" cy="70" r="55"></circle>'+
	'</svg>'
    var ancho = 0;
    var alto = 0;
    if (window.innerWidth == undefined) ancho = window.screen.width;
    else ancho = window.innerWidth;
    if (window.innerHeight == undefined) alto = window.screen.height;
    else alto = window.innerHeight;
    var heightdivsito = alto/2 - parseInt(height)/2;
    imgCentro = "<div style='text-align:center;height:" + alto + "px;'><div  style='color:#FFFFFF;margin-top:" + heightdivsito + "px; font-size:20px;font-weight:bold'>" + mensaje + 
    "</div>"+circule+"</div>";
        div = document.createElement("div");
        div.id = "On_Load"
        div.style.width = ancho + "px";
        div.style.height = alto + "px";
        $("body").append(div);
        input = document.createElement("input");
        input.id = "focusInput";
        input.type = "text"
        $("#On_Load").append(input);
        $("#focusInput").focus();
        $("#focusInput").hide();
        $("#On_Load").html(imgCentro);
}