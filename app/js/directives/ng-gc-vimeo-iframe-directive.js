'use strict';

require('./ng-gc-autoplay-vimeo-directive');

angular.module('ngGcVimeoIframeDirective', [
  'ngGcAutoplayVimeoDirective'
]).directive('ngGcVimeoIframe', [
  '$sce',
  '$timeout',
  function ngGcVimeoIframeDirective($sce, $timeout) {

    return {
      restrict: 'E',
      replace: true,
      template: '<div><iframe ng-src="{{url}}" ' +
        'ng-gc-autoplay-vimeo frameborder="0" width="100%" height="100%"></iframe></div>',
      link: function link(scope) {
        scope.$watch('vimeoId', function() {
          var url = '//player.vimeo.com/video/' + scope.vimeoId + '?color=4fc4be';
          $timeout(function() {
            scope.url = $sce.trustAsResourceUrl(url);
          }, 100);
        });
      },
      scope: {
        vimeoId: '='
      }
    };

  }
]);
