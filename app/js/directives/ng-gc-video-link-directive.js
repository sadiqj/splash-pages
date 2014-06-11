'use strict';

angular.module('ngGcVideoLinkDirective', []).directive('ngGcVideoLink', [
  function ngGcVideoLinkDirective() {

    return {
      // link: function link(scope, element, attrs) {

      //   var video = '<iframe class="videos-container__iframe" src="//player.vimeo.com/video/' + videoId + '?title=0&amp;byline=0&amp;portrait=0&amp;color=3366cc'+ autoplay +'" width="780" height="488" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

      //   if (window.location.hash) {
      //     // Stuff to do with invididual videos
      //   } else {

      //     var firstVideoLink = $('.videos-container__link').first();
      //     var videoId = firstVideoLink.data('video-id');

      //     $('#video-title').text(firstVideoLink.data('video-title'));
      //     $('#video-length').text(firstVideoLink.data('video-length'));
      //     $('#video-description').text(firstVideoLink.data('video-description'));
      //     $('.videos-container__iframe').replaceWith(videoNoAutplay);
      //   }

      //   element.on('click', function(e) {

      //     var videoId = element.data('video-id');

      //     $('#video-title').text(element.data('video-title'));
      //     $('#video-length').text(element.data('video-length'));
      //     $('#video-description').text(element.data('video-description'));
      //     $('.videos-container__iframe').replaceWith(videoAutoPlay);

      //     console.log('bar');
      //     e.preventDefault();
      //     // Would be nice to re-use smooth scroll here?
      //     // But currently using href for individual video hashes, so not for now...
      //     $('html, body').animate({
      //         scrollTop: 0
      //     }, 250);

      //     return false;
      //   });

      // }
    };

  }
]);
