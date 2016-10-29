/**
 * upNext.js plugin
 * Displays overlay of upcoming video in a playlist and countdown timer
 *
 * Chris Fuller
 */

// Set up plugin context
videojs.plugin('upNext', function() {
  var player = this;
  var delay = 5;
  // Turn on auto advance
  player.on('loadedmetadata', function() {
    this.playlist.autoadvance(delay);
  });

  player.on('ended', function() {
    var player = this;
    var playlist = player.playlist();
    var current = player.playlist.currentItem();
    var next = playlist[current + 1];
    var delay = 5;

    // Build html for overlay
    var content = '';
    content = '<div class="counter-overlay" style="background-image: url(' + next.poster + ');">' +
      '<div class="overlay-background"></div>' +
      '<div class="metadata"><p class="up-next">Up Next:</p><p class="up-next-name">' + next.name +'</p>' +
      '<p class="timer">Playing in <span class="clock">' + delay + '</span> seconds</p></div></div>';

    // Add overlay
    overlay(player, content);

    // Make timer dynamic
    var i = 1;
    var countdown = setInterval(function() {
      $('.clock').html(delay - i);
      i++;

      // Clear the interval-based function and remove the overlay when we get to 0
      if(i == delay + 1){
        clearInterval(countdown);
        $('.counter-overlay').remove();
        i = 1;
      }
    }, 1000);
  });
});

/**
 * Append overlay to player
 * @param player
 * @param content
 */
function overlay(player, content) {
  $('#' + player.id_).append(content);
}