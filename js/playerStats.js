
function resetStatsDisplay() {
  var currentTimeStat = $('.current-time-stat');
  var bufferedStat = $('.buffered-stat');
  var seekableStartStat = $('.seekable-start-stat');
  var seekableEndStat = $('.seekable-end-stat');
  var videoBitrateStat = $('.video-bitrate-stat');
  var measuredBitrateStat = $('.measured-bitrate-stat');
  var bitrateGraph = $('#bitrate-graph');
  var eventGraph = $('#event-graph');

  currentTimeStat.text('0');
  bufferedStat.text('-');
  seekableStartStat.text('-');
  seekableEndStat.text('-');
  videoBitrateStat.text('0 kbps');
  measuredBitrateStat.text('0 kbps');
  bitrateGraph.html('');
  eventGraph.html('');

  var PLAYER_EVENTS = [
    'loadedmetadata',
    'play',
    'playing',
    'pause',
    'ended',
    'seeking',
    'seeked',
    'progress'
  ];

  PLAYER_EVENTS.forEach(function(name) {
    var count = $('.' + name + '-count');
    count.text('0');
  });
}

function setupStats(player) {
  player.ready(function() {

    // ------------
    // Player Stats
    // ------------

    var PLAYER_EVENTS = [
      'loadedmetadata',
      'play',
      'playing',
      'pause',
      'ended',
      'seeking',
      'seeked',
      'progress'
    ];

    var currentTimeStat = $('.current-time-stat');
    var bufferedStat = $('.buffered-stat');
    var seekableStartStat = $('.seekable-start-stat');
    var seekableEndStat = $('.seekable-end-stat');
    var videoBitrateState = $('.video-bitrate-stat');
    var measuredBitrateStat = $('.measured-bitrate-stat');

    player.on('timeupdate', function() {
      currentTimeStat.text(player.currentTime().toFixed(1));
    });

    window.stats_timer = window.setInterval(function() {
      var bufferedText = '', oldStart, oldEnd, i;

      // buffered
      var buffered = player.buffered();
      if (buffered.length) {
        bufferedText += buffered.start(0) + ' - ' + buffered.end(0);
      }
      for (i = 1; i < buffered.length; i++) {
        bufferedText += ', ' + buffered.start(i) + ' - ' + buffered.end(i);
      }
      bufferedStat.text(bufferedText);

      // seekable
      var seekable = player.seekable();
      if (seekable && seekable.length) {

        oldStart = seekableStartStat.textContent;
        if (seekable.start(0).toFixed(1) !== oldStart) {
          seekableStartStat.text(seekable.start(0).toFixed(1));
        }
        oldEnd = seekableEndStat.textContent;
        if (seekable.end(0).toFixed(1) !== oldEnd) {
          seekableEndStat.text(seekable.end(0).toFixed(1));
        }
      }

      if (player.tech_.hls) {
        // bitrates
        var playlist = player.tech_.hls.playlists.media();
        if (playlist && playlist.attributes && playlist.attributes.BANDWIDTH) {
          videoBitrateState.text((playlist.attributes.BANDWIDTH / 1024).toLocaleString(undefined, {
            maximumFractionDigits: 1
          }) + ' kbps');
        }
        if (player.tech_.hls.bandwidth) {
          measuredBitrateStat.text((player.tech_.hls.bandwidth / 1024).toLocaleString(undefined, {
            maximumFractionDigits: 1
          }) + ' kbps');
        }
      } else if (player.dash && player.dash.mediaPlayer) {
        var mediaPlayer = player.dash.mediaPlayer;
        var dashMetrics = mediaPlayer.getDashMetrics();
        var videoMetrics = mediaPlayer.getMetricsFor('video');

        if (videoMetrics && dashMetrics) {
          var repSwitch = dashMetrics.getCurrentRepresentationSwitch(videoMetrics);
          var text = (dashMetrics.getBandwidthForRepresentation(repSwitch.to, 0) / 1024).toLocaleString( undefined, {
            maximumFractionDigits: 1
          }) + ' kbps';

          measuredBitrateStat.text(text);
          videoBitrateState.text(text);
        }
      }
    }, 1000);

    var trackEventCount = function(eventName, selector) {
      var count = 0, element = $(selector);
      player.on(eventName, function() {
        count++;
        element.text(count);
      });
    };

    PLAYER_EVENTS.forEach(function(name) {
      trackEventCount(name, '.' + name + '-count');
    });

    // Setup measured bitrate
    //if (player.tech_.hls || player.dash) {
    //  window.displayBitrateGraph('#bitrate-graph', player);
    //}

    //window.displayEventGraph('#event-graph', player);
  });
}
