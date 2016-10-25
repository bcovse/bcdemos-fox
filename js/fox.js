$(document).ready(function() {
  $(document).on('playerLoaded', function(e, vidId) {
    $('.meta').html('<div class="video-name">' + vidId.metadata.name + '</div><div class="video-description">' + vidId.metadata.description + '</div>');

    $('#main').append('<a href="#" class="btn-enlarge">Enlarge</a>');

    $('.btn-enlarge').click(function() {
      var w = $('.container').width();
      if ($(this).hasClass('big')) {
        $('#main').animate({
            width: w/2},
          1000,
          function() {
            //$('.meta').show();
            $('#main').removeClass('col-sm-12').addClass('col-sm-6');
          }
        );
        $(this).removeClass('big').text('Enlarge');
      }
      else {
        //$('.meta').hide();
        $('#main').animate({
            width: w},
          1000,
          function() {
            $('#main').removeClass('col-sm-6').addClass('col-sm-12');
          }
        );
        $(this).addClass('big').text('Reduce');
      }
    });
  });
});