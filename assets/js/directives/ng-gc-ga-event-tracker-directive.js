'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('ngGcGaEventTrackerDirective', [])
  .directive('ngGcGaEventTracker', [
    '$window',
    function ngGcGaEventTrackerDirective($window) {
      $window._gaq = $window._gaq || [];

      function validateOptions(options) {
        if (!(options.event && options.gaEventType && options.category &&
            options.action && options.label)) {
          throw new Error('Invalid options: event, category, action, label');
        }
        return options;
      }

      function getOptions(options) {
        options = _.defaults(options, {
          event: 'click',
          gaEventType: '_trackEvent'
        });
        return validateOptions(options);
      }

      return {
        link: function link(scope, element, attrs) {
          var options = getOptions(scope.$eval(attrs.ngGcGaEventTracker));

          function track(event) {
            if (options.event === 'submit') {
              event.stopImmediatePropagation();
              event.preventDefault();
            }

            var undbind = _.once(function undbind() {
              element.off(options.event, track);
              if (options.event === 'submit') {
                if ('trigger' in element) {
                  element.trigger('submit');
                } else {
                  element[0].submit();
                }
              }
            });

            // Called when GA has sent the event
            $window._gaq.push(['_set', 'hitCallback', function undbind(){
              undbind();
            }]);

            // Create event
            $window._gaq.push([
              options.gaEventType,
              options.category,
              options.action,
              options.label
            ]);

            // Wait at most 50 ms to unbind the events / submit form
            _.delay(undbind, 50);
          }

          element.on(options.event, track);
        }
      };

    }
  ]);
