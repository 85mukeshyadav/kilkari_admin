

$( document ).on('click', function() {
 $(".add-pd-container .rx-pd-checkbox").click(function(){
 $(".add-pd-container .pd-add-two").toggleClass('active');
 $(".add-pd-container .pd-add-one").toggleClass('active');
});

});
$('[data-toggle="popover"]').popover({
    trigger: 'hover'
});

  $('[data-toggle="popovertop"]').popover({
    placement : 'top',
    trigger: 'hover'
});

// alert js code
// $(".alert").fadeTo(2000, 500).slideUp(500, function(){
//    $(".alert").slideUp(500);
// });

// alert js code