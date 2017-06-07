$(document).ready(function(){

// Show popup
var legend = $('.legend');
var modal = $('#modal');
var close = $('.close');

legend.click(function(){
  modal.show('slow');
  close.click(function(){
    modal.fadeOut('slow');
  });
});
 });