'use strict';

var Froogaloop = require('froogaloop');

angular.module('ngGcVimeoIframeDirective', [])
.directive('ngGcVimeoIframe', [
  '$sce',
  function ngGcVimeoIframeDirective($sce) {

    return {
      restrict: 'E',
      replace: true,
      template: '<div><iframe ng-if="url" src="{{url}}" frameborder="0" width="100%" height="100%"></iframe></div>',
      link: function link(scope, element, attrs) {
        scope.$watch('vimeoId', function(vimeoId) {
          var url = '//player.vimeo.com/video/' +
            scope.vimeoId +
            '?title=0&amp;byline=0&amp;portrait=0&amp;color=3366cc&autoplay'
          scope.url = $sce.trustAsResourceUrl(url);
        });
        var $iframe = element.find('iframe');
        $iframe.on('load', function () {
          console.log(1111);
          var videoPlayer = Froogaloop($iframe[0]);
          videoPlayer.api('ready', function() {
            videoPlayer.api('play');
          });
        });
      },
      scope: {
        vimeoId: '=',
        autoplay: '@'
      }
    };

  }
]);
