/**
 * upNext.js plugin
 * Displays overlay of upcoming video in a playlist and countdown timer
 *
 * Chris Fuller
 */

videojs.plugin('upNext', function() {
  var player = this;
  player.on('loadedmetadata', function() {
    var player = this;
    var playlist = player.playlist();
    var current = player.playlist.currentItem();
    var next = playlist[current + 1];
    var delay = 5;

    player.playlist.autoadvance(delay);
    player.on('ended', function() {
      var content = '<div class="counter-overlay" style="background-image: url(' + next.poster + ')">' +
      '<span class="timer">Next video in <span class="clock">' + delay + '</span> seconds</span></div>';
      overlay(player, content);
      var i = 1;
      var countdown = setInterval(function() {
        $('.clock').html(delay - i);
        i++;
        if(i == delay){
          clearInterval(countdown);
          i = 1;
        }
      }, 1000);
    });
    player.on('loadstart', function() {
      $('.counter-overlay').remove();
    });
  });
});

function overlay(player, content) {
  $('#' + player.id_).append(content);
}