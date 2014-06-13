'use strict';

var Froogaloop = require('froogaloop');

angular.module('ngGcVimeoIframeDirective', [])
.directive('ngGcVimeoIframe', [
  '$sce',
  '$rootScope',
  '$timeout',
  function ngGcVimeoIframeDirective($sce, $rootScope, $timeout) {

    return {
      restrict: 'E',
      replace: true,
      template: '<div><iframe ng-if="url" src="{{url}}" frameborder="0" width="100%" height="100%"></iframe></div>',
      link: function link(scope, element, attrs) {
        var count = 0;
        scope.$watch('vimeoId', function(vimeoId) {
          var url = '//player.vimeo.com/video/' +
            scope.vimeoId +
            '?color=4fc4be';
          scope.url = $sce.trustAsResourceUrl(url);

          // Timeout required to bump onto the next event loop run, the iframe does not exist
          // until then.
          $timeout(function() {
            var iframe = element.find('iframe')[0];
            var player = Froogaloop(iframe);
            var canPlay = false;
            var didScrollToTop = false;

            // All being fired twice! Is this linked to the popState back-button double-click issue?

            function playOnce() {
              if (canPlay && didScrollToTop) {
                player.api('play');
              }
            }

            player.addEvent('ready', function () {
              canPlay = true;
              playOnce();
            });

            $rootScope.$on('didScrollToTop', function() {
              didScrollToTop = true;
              playOnce();
            });
          }, 0);
        });
      },
      scope: {
        vimeoId: '=',
        autoplay: '@'
      }
    };

  }
]);
