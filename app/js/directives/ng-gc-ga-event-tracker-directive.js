'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('ngGcGaEventTrackerDirective', [])
  .directive('ngGcGaEventTracker', [
    '$window',
    function ngGcGaEventTrackerDirective($window) {
      $window.dataLayer = $window.dataLayer || [];

      function validateOptions(options) {
        if (!(options.event && options.label)) {
          throw new Error('Invalid options: event, label');
        }
        return options;
      }

      function getOptions(options) {
        options = _.defaults(options, {
          event: 'click'
        });
        return validateOptions(options);
      }

      return {
        link: function link(scope, element, attrs) {
          var options = getOptions(scope.$eval(attrs.ngGcGaEventTracker));

          function track() {
            // Create event
            $window.dataLayer.push(
              {'event':options.label}
            );
          }

          element.on(options.event, track);
        }
      };

    }
  ]);
