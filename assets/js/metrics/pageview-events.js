(function pageViewEvents() {
  'use strict';

  angular.module('ngGcPageViewEvetns', [
    'ngGcPageRouterService'
  ]).run([
    'ngGcPageRouter', '$window',
    function ngGcPageViewEvetns(ngGcPageRouter, $window) {

      ngGcPageRouter('/prospect/request-dd-guide', function trackPageView() {
        // skip me
      });

      // match all pages not already tracked
      ngGcPageRouter('/*', function trackPageView(path) {
        $window.gct('track', 'Pageview', {
          'Path': path,
          'Property': 'website',
          'Type': 'information'
        });
      });

    }

  ]);
}());
