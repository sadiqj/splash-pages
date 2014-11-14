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

          function setStickyClass(scrollPosition, navOffset) {
            if (scrollPosition >= navOffset) {
              element.addClass('is-sticky');
            } else {
              element.removeClass('is-sticky');
            }
          }

          function updatePosition() {
            var scrollPosition = angular.element($window).scrollTop();

            if (navOffset === undefined) {
              setTimeout(function() {
                navOffset = element.parent().offset().top;
                setStickyClass(scrollPosition, navOffset);
              }, 0);
            } else {
              setStickyClass(scrollPosition, navOffset);
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
