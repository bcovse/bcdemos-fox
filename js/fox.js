$(document).ready(function() {
  $(document).on('playerLoaded', function(e, player) {
    var vidType = '';
    var meta = '';
    $('.meta').html();

    // If there's metadata associated with the asset, display it in the page
    if (!player.metadata) {
      vidType = 'vc';
      meta = '<div class="video-name">' + player.mediainfo.name + '</div><div class="video-description">' + player.mediainfo.description + '</div>';

      // If the player is configured for social links, display in page
      if (typeof player.socialSettings != 'undefined') {
        var services = player.socialSettings.services;
        var svcStr = '';

        // Iterate the social linking services and build the link for each
        if (typeof services != 'undefined') {
          for (var service in services) {
            svcStr += getSocialLink(service, services[service], player);
          }
        }
        // Add social links to the DOM
        if (svcStr != '') {
          meta += '<div class="vjs-social-overlay"><div class="vjs-social-share-links">' + svcStr + '</div></div>';
        }
      }
      $('.meta').html(meta);
    }
    else {

      // If we don't have a VC video but there's mediainfo data associated, display that instead
      vidType = 'perform';
      meta = '<div class="video-name">' + player.metadata.name + '</div><div class="video-description">' + player.metadata.description + '</div>';
      $('.meta').html(meta);
    }

    /** Event handler for the enlarge/reduce button **/
    //Make sure we don't add more than one
    if ($('.btn-enlarge').length == 0) {
      $('#main').append('<a href="#" class="btn-enlarge hidden-xs">Enlarge</a>');

      // If we're small, get bigger. If we're big, get small
      $('.btn-enlarge').click(function () {
        var w = $('.container').width();
        if ($(this).hasClass('big')) {
          $('#main').animate({
              width: w / 2
            },
            1000,
            function () {
              $('#main').removeClass('col-sm-12').addClass('col-sm-6');
            }
          );
          $(this).removeClass('big').text('Enlarge');
        }
        else {
          $('#main').animate({
              width: w
            },
            1000,
            function () {
              $('#main').removeClass('col-sm-6').addClass('col-sm-12');
            }
          );
          $(this).addClass('big').text('Reduce');
        }
      });
    }
  });
});

/**
 * Helper to build the html for a social link
 * @param key
 * @param val
 * @param player
 * @returns {string}
 */
function getSocialLink(key, val, player) {
  var str = '';
  if (val == true) {
    switch(key) {
      case 'facebook':
        str = '<a href="https://www.facebook.com/sharer/sharer.php?u='+ document.location +'&amp;title='+ player.mediainfo.name +'" ' +
          'class="vjs-social-share-link vjs-icon-facebook" aria-role="link" aria-label="Share on Facebook" tabindex="1" title="Facebook" target="_blank">' +
          '<span class="vjs-control-text">Facebook</span> </a>';
        break;
      case 'twitter':
        str = '<a href="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&amp;text='+ player.mediainfo.name +'&amp;tw_p=tweetbutton&amp;url='+ document.location +'" class="vjs-social-share-link vjs-icon-twitter" aria-role="link" aria-label="Share on Twitter" tabindex="4" title="Twitter" target="_blank"><span class="vjs-control-text">Twitter</span></a>';
        break;
      case 'linkedin':
        str = '<a href="https://www.linkedin.com/shareArticle?mini=true&amp;url='+ document.location +'&amp;title='+ player.mediainfo.name +'&amp;summary='+ player.mediainfo.description +'&amp;source=Classic" ' +
          'class="vjs-social-share-link vjs-icon-linkedin" aria-role="link" aria-label="Share on LinkedIn" tabindex="3" title="LinkedIn" target="_blank">' +
          '<span class="vjs-control-text">LinkedIn</span></a>';
        break;
      case 'google':
        str = '<a href="https://plus.google.com/share?url='+ document.location +'" class="vjs-social-share-link vjs-icon-gplus" aria-role="link" aria-label="Share on Google Plus" tabindex="2" title="Google+" target="_blank">' +
          '<span class="vjs-control-text">Google+</span></a>';
        break;
    }
    return str;
  }
  return '';
}