var body = $('body');

window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.loadHidden = false;

$(function () {
  'use strict';
  social();
  author();
  stickySidebar();
  pagination();
  facebook();
  loadInstagram();
  gallery();
  copyright();
  offCanvas();
});

function social() {
  'use strict';
  var data = {
    facebook: {name: 'Facebook', icon: 'facebook'},
    twitter: {name: 'Twitter', icon: 'twitter'},
    instagram: {name: 'Instagram', icon: 'instagram'},
    dribbble: {name: 'Dribbble', icon: 'dribbble'},
    behance: {name: 'Behance', icon: 'behance'},
    github: {name: 'GitHub', icon: 'github-circle'},
    linkedin: {name: 'LinkedIn', icon: 'linkedin'},
    vk: {name: 'VK', icon: 'vk'},
    rss: {name: 'RSS', icon: 'rss'},
  };
  var links = themeOptions.social_links;
  var output = '';

  for (var key in links) {
		if (links[key] != '') {
			output += '<a class="social-item" href="' + links[key] + '" target="_blank"><i class="icon icon-' + data[key]['icon'] + '"></i></a>';
		}
  }
  
  $('.social').html(output);
}

function author() {
  'use strict';
  $('.author-name').on('click', function () {
    $(this).next('.author-social').toggleClass('enabled');
  });
}

function stickySidebar() {
  'use strict';
  var marginTop = 30;

  jQuery('.sidebar-column, .related-column').theiaStickySidebar({
    additionalMarginTop: marginTop,
    additionalMarginBottom: 30,
  });
}

function pagination() {
  'use strict';
  var wrapper = $('.post-feed .row');
  var button = $('.infinite-scroll-button');

  if (body.hasClass('paged-next')) {
    wrapper.on('request.infiniteScroll', function (event, path) {
      button.hide();
    });

    wrapper.on('load.infiniteScroll', function (event, response, path) {
      if ($(response).find('body').hasClass('paged-next')) {
        button.show();
      }
    });

    wrapper.infiniteScroll({
      append: '.post-column',
      button: '.infinite-scroll-button',
      debug: false,
      hideNav: '.pagination',
      history: false,
      path: '.pagination .older-posts',
      scrollThreshold: false,
      status: '.infinite-scroll-status',
    });
  }
}

function facebook() {
  'use strict';
  var widget = $('.widget-facebook');

  if (widget.find('.fb-page').attr('data-href') == '__YOUR_FACEBOOK_PAGE_URL__') {
    widget.remove();
  }
}

function loadInstagram() {
  'use strict';
  var photos;
  var feed = $('.instagram-feed');
  var storageKey = 'ruby_instagram';

  if (themeOptions.instagram_token != '') {
    if ( localStorage.getItem(storageKey) !== null && (Math.floor(Date.now() / 1000) - JSON.parse(localStorage.getItem(storageKey)).timestamp) < 300) {
			photos = JSON.parse(localStorage.getItem(storageKey)).photos;
			outputInstagram(photos, feed);
		} else {
      $.ajax({
        url: 'https://graph.instagram.com/me/media/',
        type: 'GET',
        data: {access_token: themeOptions.instagram_token, limit: 6, fields: 'media_url, permalink'},
        success: function (result) {
          photos = result.data;
		    	var cache = {
		    		photos: photos,
		    		timestamp: Math.floor(Date.now() / 1000)
		    	};
		    	localStorage.setItem(storageKey, JSON.stringify(cache));
		    	outputInstagram(photos, feed);
        }
      } );
		}
  } else {
    feed.parent('.widget-instagram').remove();
  }
}

function outputInstagram(photos, feed) {
  'use strict';
  var photo;
	var output = '';

	for (var index in photos) {
		photo = photos[index];
    output += '<a class="instagram-feed-item" href="' + photo.permalink + '" target="_blank" rel="noopener noreferrer">' +
      '<img class="u-object-fit" src="' + photo.media_url + '">' +
      '<i class="instagram-feed-item-icon icon icon-instagram"></i>' +
    '</a>';
	}

  feed.each(function(i, v) {
    $(v).html(output);
    $(v).css('height', Math.round($(v).height()) + 'px');
  });
}

function gallery() {
  'use strict';
  var images = document.querySelectorAll('.kg-gallery-image img');
  images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });
}

function copyright() {
  'use strict';
  if (themeOptions.copyright != '') {
    $('.copyright').html(themeOptions.copyright);
  }
}

function offCanvas() {
  'use strict';
  $('.burger:not(.burger.close)').on('click', function () {
    body.addClass('canvas-visible canvas-opened');
    dimmer('open', 'medium');
  });

  $('.burger-close').on('click', function () {
    if (body.hasClass('canvas-opened')) {
      body.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });

  $('.dimmer').on('click', function () {
    if (body.hasClass('canvas-opened')) {
      body.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });
}

function dimmer(action, speed) {
  'use strict';
  var dimmer = $('.dimmer');

  switch (action) {
    case 'open':
      dimmer.fadeIn(speed);
      break;
    case 'close':
      dimmer.fadeOut(speed);
      break;
  }
}