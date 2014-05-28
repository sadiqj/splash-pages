'use strict';

require('./page-router');

angular.module('ngGcRequestDemoFunnel', [
  'ngGcPageRouterService'
]).run([
  'ngGcPageRouter', '$window',
  function ngGcRequestDemoFunnel(ngGcPageRouter, $window) {

    ngGcPageRouter('/watch-a-demo', function trackPageView(path) {
      $window.gct('track', 'Pageview', {
        'Path': path,
        'Property': 'website',
        'Type': 'lead capture'
      });
    });

    // "Capture Lead" event is fired in ProspectsController#sales

  }

]);
