$(document).ready(function() {
  $(document).on('playerLoaded', function(e, vidObj) {
    var vidType = '';
    var meta = '';
    if (!vidObj.metadata) {
      vidType = 'vc';
      // Haven't been able to get onloadedmetadata here, hence the ugly workaround
      setTimeout(function() {
        var services = vidObj.socialSettings.services;
        var svcStr = '';
        if (typeof services != 'undefined') {
          for (var service in services) {
            svcStr += getSocialLink(service, services[service], vidObj);
          }
        }
        meta = '<div class="video-name">' + vidObj.mediainfo.name + '</div><div class="video-description">' + vidObj.mediainfo.description + '</div>';
        if (svcStr != '') {
          meta += '<div class="vjs-social-overlay"><div class="vjs-social-share-links">' + svcStr + '</div></div>';
        }
        $('.meta').html(meta);
      }, 200)
    }
    else {
      vidType = 'perform';
      meta = '<div class="video-name">' + vidObj.metadata.name + '</div><div class="video-description">' + vidObj.metadata.description + '</div>';
      $('.meta').html(meta);
    }

    $('#main').append('<a href="#" class="btn-enlarge">Enlarge</a>');

    $('.btn-enlarge').click(function() {
      var w = $('.container').width();
      if ($(this).hasClass('big')) {
        $('#main').animate({
            width: w/2},
          1000,
          function() {
            $('#main').removeClass('col-sm-12').addClass('col-sm-6');
          }
        );
        $(this).removeClass('big').text('Enlarge');
      }
      else {
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

function getSocialLink(key, val, vidObj) {
  var str = '';
  if (val == true) {
    switch(key) {
      case 'facebook':
        str = '<a href="https://www.facebook.com/sharer/sharer.php?u='+ document.location +'&amp;title='+ vidObj.mediainfo.name +'" ' +
          'class="vjs-social-share-link vjs-icon-facebook" aria-role="link" aria-label="Share on Facebook" tabindex="1" title="Facebook" target="_blank">' +
          '<span class="vjs-control-text">Facebook</span> </a>';
        break;
      case 'twitter':
        str = '<a href="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&amp;text='+ vidObj.mediainfo.name +'&amp;tw_p=tweetbutton&amp;url='+ document.location +'" class="vjs-social-share-link vjs-icon-twitter" aria-role="link" aria-label="Share on Twitter" tabindex="4" title="Twitter" target="_blank"><span class="vjs-control-text">Twitter</span></a>';
        break;
      case 'linkedin':
        str = '<a href="https://www.linkedin.com/shareArticle?mini=true&amp;url='+ document.location +'&amp;title='+ vidObj.mediainfo.name +'&amp;summary='+ vidObj.mediainfo.description +'&amp;source=Classic" ' +
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