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
        '<div class="grid__cell u-1of4 u-text-center u-margin-Bl">' +
          '<a class="u-link-clean"' +
            'href ng-click="setActiveVideo()" ng-gc-smooth-scroll>' +
            '<div class="videos-container__thumbnail u-margin-Hs"' +
              'ng-class="{' +
              '  \'is-active\': isSelfActive()' +
              '}">' +
              '<div class="u-2of3 u-center u-padding-Txxs">' +
                '<i class="videos-container__play-button u-margin-Tl u-margin-Bs"' +
                  'ng-class="{' +
                  '  \'is-active\': isSelfActive()' +
                  '}"></i>' +
                '<p class="u-text-heading u-text-h2 u-text-light u-link-clean u-cf u-color-base videos-container__link">' +
                  '{{ title }}' +
                '</p>' +
                '<p class="u-margin-Ts">{{ time }}</p>' +
              '</div>' +
            '</div>' +
          '</a>' +
        '</div>',
      link: function link(scope, element, attrs) {
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

        scope.setActiveVideo = function setActiveVideo() {
          var slug = getSlug();
          // only set pushState when the slug is different from the current video
          if (slug !== scope.slug) {
            window.history.pushState({}, '', '#' + scope.slug);
          }
          ngGcActiveVideo.setActiveVideo(video);
        };

        function getSlug() {
          var slug = window.location.hash && window.location.hash.replace(/^#/, '');
          return slug;
        }

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
