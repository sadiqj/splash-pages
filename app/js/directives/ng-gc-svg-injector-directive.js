'use strict';

angular.module('ngGcSvgInjectorDirective', [])
  .directive('svg-injector', [
    '$window',
    function iconDirective($window) {
      return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
          $window.SVGInjector(elem, {
            evalScript: 'always'
          });
        }
      };
    }
  ]);
