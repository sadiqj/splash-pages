'use strict';

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
            '?title=0&amp;byline=0&amp;portrait=0&amp;color=3366cc&autoplay=' +
            scope.autoplay;
          scope.url = $sce.trustAsResourceUrl(url);
        });
      },
      scope: {
        vimeoId: '=',
        autoplay: '@'
      }
    };

  }
]);
