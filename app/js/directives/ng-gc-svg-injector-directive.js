'use strict';

var SVGInjector = require('../../components/svg-injector/svg-injector');

angular.module('ngGcSvgInjectorDirective', [])
  .directive('ngGcSvgInjector', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, elem) {
          SVGInjector(elem, {
            evalScript: 'always'
          });
        }
      };
    }
  ]);
