//document.write('<script src="//players.brightcove.net/1924997959001/6fa531af-7118-4114-b7ab-985898910538_default/index.min.js"></script>');

var
  outerPlayer,
  innerPlayer,
  $innerPlayerEl,
  highlights = [],
  $seekBar,
  $controlBar,
  currentHighlight;

var videoData = {
  title: 'Michigan vs. Notre Dame',
  hlsUrl: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/master.m3u8',
  mp4Url: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_full.mp4',
  poster: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_full.jpg',
  duration: 2743,
  highlights: [{
    position: 799,
    mp4Url: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_1.mp4',
    poster: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_1.jpg'
  }, {
    position: 1416,
    mp4Url: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_2.mp4',
    poster: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_2.jpg'
  }, {
    position: 1508,
    mp4Url: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_3.mp4',
    poster: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_3.jpg'
  }, {
    position: 1547,
    mp4Url: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_4.mp4',
    poster: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_4.jpg'
  }, {
    position: 2388,
    mp4Url: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_5.mp4',
    poster: 'http://bcjsanford.com.global.prod.fastly.net/espn/demo/out/football_5.jpg'
  }]
}

videojs.plugin('pip', function() {

  // prepare when the outer player is ready
  videojs('outer_player').ready(function() {
    outerPlayer = this;

    //TODO: Need to find a better way to do this
    $('#main').append($('#inner_player'));

    // only setup if both are ready
    if (outerPlayer && innerPlayer)
      setupPlayers();

    // load the main source
    outerPlayer.src([{
      type: 'application/x-mpegUrl',
      src: videoData.hlsUrl
    }, {
      type: 'video/mp4',
      src: videoData.mp4Url
    }]);
    outerPlayer.poster(videoData.poster);

    // get our control and seek bar for positioning later
    $seekBar = $(outerPlayer.controlBar.progressControl.seekBar.el());
    console.log($seekBar);
    $controlBar = $(outerPlayer.controlBar.el());
  });

  // prepare when the inner player is ready
  videojs('inner_player').ready(function() {
    innerPlayer = this;
    $innerPlayerEl = $(innerPlayer.el());
    $innerPlayerEl.addClass('back');

    // setup the players if they're both ready
    if (outerPlayer && innerPlayer)
      setupPlayers();
  });


});

// do the initial setup fo the player (position etc)
function setupPlayers() {
  sizePlayers();
  $(window).resize(sizePlayers);

  $innerPlayerEl.css('top', outerPlayer.height() * 0.016);
  $innerPlayerEl.css('left', outerPlayer.width() * 0.009);

  // when the inner player is clicked, stop what's going and
  // load the current highlight
  innerPlayer.on('click', function() {
    // stop this player
    if (!innerPlayer.paused())
      innerPlayer.pause();

    // hide this player
    $innerPlayerEl.removeClass('front');
    $innerPlayerEl.addClass('back');

    // seek to the right place in the outer player and play
    outerPlayer.currentTime(currentHighlight.position);
    if (outerPlayer.paused())
      outerPlayer.play();
  });
console.log('before createhighlights');
  // and set up the actual highlights
  createHighlights();
}

// size the players appropriately
function sizePlayers() {
  outerPlayer.height(outerPlayer.width() * 9 / 16);
  innerPlayer.height(outerPlayer.height() / 3);
  innerPlayer.width(outerPlayer.width() / 3);
}

// go through all of the highlights to create them
function createHighlights() {
  var DATA_INDEX_NAME = 'highlight-index';
  var seekBarHeight = $seekBar.height();
  console.log('h = ' + seekBarHeight)
  for (var i = 0; i < videoData.highlights.length; i++) {
    // object to hold everything about the highlight
    var highlight = {};
    highlight.index = i;
    highlight.position = videoData.highlights[i].position;
    highlight.hlsUrl = videoData.highlights[i].hlsUrl;
    highlight.mp4Url = videoData.highlights[i].mp4Url;
    highlight.poster = videoData.highlights[i].poster;

    // create the cue on the timeline, and position it
    highlight.jqCue = $('<i class="fa fa-circle highlight"></i>');
    highlight.jqCue.data(DATA_INDEX_NAME, i);
    highlight.jqCue.css('left', 0);
    highlight.jqCue.css('marginLeft', (highlight.position / videoData.duration * 100) + '%');
    highlight.jqCue.css('marginTop', '-3px');
    highlight.jqCue.css('fontSize', ('13px');

    // create the image (it will not be a child of the cue)
    highlight.jqImg = $('<img class="highlight-img hidden" src="' + highlight.poster + '" />');
    highlight.jqImg.data(DATA_INDEX_NAME, i);

    // EVENTS
    // on enter cue, make sure to clear any timeouts to hide it, and show the image
    highlight.jqCue.on('mouseenter', function() {
      var hl = highlights[$(this).data(DATA_INDEX_NAME)];

      showHighlightImage(hl);

      // make sure we don't fade if they went back to this highlight
      clearTimeout(hl.hideTimeout);

      // and hide all other highlights
      for (var i = 0; i < highlights.length; i++) {
        if (i != hl.index)
          hideHighlightImage(highlights[i]);
      }
    });

    // on leaving cue, set a timeout to hide the image
    highlight.jqCue.on('mouseleave', function() {
      var hl = highlights[$(this).data(DATA_INDEX_NAME)];
      hl.hideTimeout = setTimeout(function() {
        hideHighlightImage(hl);
      }, 1000);
    });

    // on enter image, make sure to clear any timeouts
    highlight.jqImg.on('mouseenter', function() {
      var hl = highlights[$(this).data(DATA_INDEX_NAME)];
      clearTimeout(hl.hideTimeout);
    });

    // on leave image, start a timeout
    highlight.jqImg.on('mouseleave', function() {
      var hl = highlights[$(this).data(DATA_INDEX_NAME)];
      hl.hideTimeout = setTimeout(function() {
        hideHighlightImage(hl);
      }, 1000);
    });

    // on click image, hide the image and load the highlight in
    highlight.jqImg.on('click', function() {
      var hl = highlights[$(this).data(DATA_INDEX_NAME)];
      hideHighlightImage(hl);
      loadHighlight(hl);
    });

    // add them where they go
    highlights.push(highlight);
    $seekBar.append(highlight.jqCue);
    $controlBar.append(highlight.jqImg);
  }

  // shows the highlight image, and positions it where it should go
  function showHighlightImage(hl) {
    hl.jqImg.removeClass('hidden');
    var seekBarBoundingRect = $seekBar[0].getBoundingClientRect();
    var seekBarWidth = $seekBar.width();
    var controlBarBoundingRect = $controlBar[0].getBoundingClientRect();
    var offset = seekBarBoundingRect.left - controlBarBoundingRect.left;
    hl.jqImg.css('left', (hl.position / videoData.duration) * seekBarWidth + offset - hl.jqImg.width() / 2);
    hl.jqImg.css('top', 0 - hl.jqImg.height() - 5);
  }

  // hide the highlight image
  function hideHighlightImage(hl) {
    hl.jqImg.addClass('hidden');
  }

  // load the highlight in the inner player, and show the inner player
  function loadHighlight(hl) {
    // remember it
    currentHighlight = hl;
    $innerPlayerEl.removeClass('back');
    $innerPlayerEl.addClass('front');
    var src = [];
    if (hl.hlsUrl)
      src.push({
        type: 'application/x-mpegUrl',
        src: hl.hlsUrl
      });
    if (hl.mp4Url)
      src.push({
        type: 'video/mp4',
        src: hl.mp4Url
      });
    innerPlayer.src(src);
    innerPlayer.one('ended', function() {
      $innerPlayerEl.addClass('front');
      $innerPlayerEl.addClass('back');
    });
    // mute inner player
    innerPlayer.volume(0);
    innerPlayer.play();
  }
}