'use strict';

require('../services/ng-gc-active-video-service');
require('./ng-gc-smooth-scroll-directive');

angular.module('ngGcVideoThumbDirective', [
  'ngGcActiveVideoService',
  'ngGcSmoothScrollDirective'
]).directive('ngGcVideoThumb', [
  'ngGcActiveVideo',
  function ngGcVideoThumbDirective(ngGcActiveVideo) {

    return {
      restrict: 'E',
      replace: true,
      template:
        ['<div class="grid__cell u-size-1of4 u-text-center u-margin-Bl">',
            '<a class="u-link-clean"',
              'href ng-click="setActiveVideo()" ng-gc-smooth-scroll>',
              '<div class="videos-container__thumbnail u-margin-Hs u-margin-Bs"',
                'ng-class="{',
                '  \'is-active\': isSelfActive()',
                '}">',
                '<div class="u-size-5of6 u-center">',
                  '<i class="videos-container__play-button u-margin-Tl u-margin-Bs"',
                    'ng-class="{',
                    '  \'is-active\': isSelfActive()',
                    '}"></i>',
                  '<p class="u-text-heading u-text-light u-text-no-smoothing u-text-m ',
                  'u-link-clean u-cf u-color-heading videos-container__link"',
                    'ng-class="{',
                    '  \'is-active\': isSelfActive()',
                    '}">',
                    '{{ title }}',
                  '</p>',
                  '<p class="u-margin-Ts u-color-base videos-container__time"',
                    'ng-class="{',
                    '  \'is-active\': isSelfActive()',
                    '}">',
                    '{{ time }}',
                  '</p>',
                '</div>',
              '</div>',
            '</a>',
          '</div>'].join(''),
      link: function link(scope) {
        var video = {
          id: scope.id,
          title: scope.title,
          time: scope.time,
          slug: scope.slug,
          description: scope.description
        };

        ngGcActiveVideo.addVideo(video);

        scope.isSelfActive = function isSelfActive() {
          return scope.id === ngGcActiveVideo.getActiveVideo().id;
        };

        function getSlug() {
          var slug = window.location.hash && window.location.hash.replace(/^#/, '');
          return slug;
        }

        scope.setActiveVideo = function setActiveVideo() {
          var slug = getSlug();
          // only set hash when the slug is different from the current video
          if (slug !== scope.slug) {
            location.hash = scope.slug;
          }
          ngGcActiveVideo.setActiveVideo(video);
        };

        function setActiveSlug() {
          var slug = getSlug();
          if (slug) {
            ngGcActiveVideo.setActiveVideo({
              slug: slug
            });
          } else if (scope.isActive) {
            scope.setActiveVideo();
          }
        }

        // Set initial state from hash/isActive
        setActiveSlug();

        // When navigating back/forward
        $(window).on('hashchange', function() {
          scope.$apply(function() {
            setActiveSlug();
          });
        });
      },
      scope: {
        id: '@',
        title: '@',
        time: '@',
        slug: '@',
        description: '@',
        isActive: '='
      }
    };

  }
]);
