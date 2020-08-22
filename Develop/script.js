// A $( document ).ready() block. - all lcode must go into bock
$(document).ready(function () {
    var today = moment().format('dddd, LL');
    $('#currentDay').html(today)

    
});