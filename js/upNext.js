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
    var next = current + 1;

    var overlayTemplate = '<div class="lock-overlay">{{content}}</div>';

    console.log(playlist);

    player.playlist.autoadvance(5);
    player.on('ended', function() {
      overlay(player, content);
    });
  });
});

function overlay(player, content) {
  $('#' + player.id_).append(content);
}