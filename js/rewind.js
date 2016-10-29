/**
 * rewind.js plugin
 * Adds a 10 second rewind button to the player
 *
 * Chris Fuller
 */

// Set up plugin context
videojs.plugin('rewind', function() {
  var player = this,
    controlBar,
    newEl,
    newImg,
    newLink,
    el;
  player.ready(function() {
    newEl = document.createElement('div');
    newLink = document.createElement('a');
    newLink.setAttribute('href', '#');
    newImg = document.createElement('img');
    newImg.setAttribute('src', 'http://solutions.brightcove.com/bcls/brightcove-player/custom-event/back-button.png');
    newLink.appendChild(newImg);
    newEl.className = 'rewind vjs-control';
    newEl.appendChild(newLink);
    controlBar = document.getElementsByClassName('vjs-control-bar')[0];
    el = document.getElementsByClassName('vjs-volume-menu-button')[0];
    controlBar.insertBefore(newEl, el);
    $(newEl).click(function() {
      var ph = player.currentTime();
      if (ph > 10) {
        player.currentTime(player.currentTime() - 10);
      }
      else {
        player.currentTime(0);
      }
    })
  })
});