'use strict';

var SVGInjector = require('../../components/svg-injector/svg-injector');

angular.module('ngGcSvgInjectorDirective', [])
  .directive('ngGcSvgInjector', [
    '$window',
    function($window) {
      return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
          SVGInjector(elem, {
            evalScript: 'always'
          });
        }
      };
    }
  ]);
