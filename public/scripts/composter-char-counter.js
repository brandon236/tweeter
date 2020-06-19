$(document).ready(function() {
  $("#tweet-text").on("keyup", function() {
    const myLength = $("#tweet-text").val().length;
    $('.counter').val(140 - myLength);
    if (140 - myLength < 0) {
      $('.counter').css("color", "red");
    } else {
      $('.counter').css("color", "#545149");
    }
  });
});