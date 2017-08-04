$(function(argument) {
       $("#commercial").bootstrapSwitch();
       $("#form").bootstrapSwitch();
       $("#up_commercial").bootstrapSwitch();
       $("#up_form").bootstrapSwitch();

});
$('input[name="commercial"]').on('switchChange.bootstrapSwitch', function (event, state) {
    if(state===false){
        $('#form').bootstrapSwitch('disabled',true);
    }else if(state===true){
        $('#form').bootstrapSwitch('disabled',false);
    }
});
$('input[name="up_commercial"]').on('switchChange.bootstrapSwitch', function (event, state) {
    if(state===false){
        $('#up_form').bootstrapSwitch('disabled',true);
    }else if(state===true){
        $('#up_form').bootstrapSwitch('disabled',false);
    }
});