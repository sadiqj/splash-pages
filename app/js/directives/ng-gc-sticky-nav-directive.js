'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('ngGcStickyNavDirective', [])
  .directive('ngGcStickyNav', [
    '$window',
    function ngGcStickyNavDirective($window) {

      return {
        link : function link(scope, element) {
          var navOffset = element.offset().top;

          function updatePosition() {
            var scrollPosition = angular.element($window).scrollTop();

            if (scrollPosition >= navOffset) {
              element.addClass('is-sticky');
            } else {
              element.removeClass('is-sticky');
            }
          }

          var throttled = _.throttle(updatePosition, 80, {
            trailing: true
          });
          angular.element($window).on('scroll', throttled);
        }
      };
    }
  ]);
