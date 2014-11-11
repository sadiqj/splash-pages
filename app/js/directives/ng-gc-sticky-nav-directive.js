'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('ngGcStickyNavDirective', [])
  .directive('ngGcStickyNav', [
    '$window',
    function ngGcStickyNavDirective($window) {

      return {
        link : function link(scope, element) {

          var navOffset;

          navOffset = element.offset().top;

          function updatePosition() {
            var scrollPosition = angular.element($window).scrollTop();

            if (navOffset === null) {
              navOffset = element.parent().offset().top;
            }

            if (scrollPosition >= navOffset) {
              element.addClass('is-sticky');
            } else {
              element.removeClass('is-sticky');
            }
          }

          var throttled = _.throttle(updatePosition, 20, {
            trailing: true
          });

          angular.element($window).on('scroll', throttled);
        }
      };
    }
  ]);
