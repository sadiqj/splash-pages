'use strict';

angular.module('ngGcRequestDemoFunnel', [
  'ngGcPageRouterService'
]).run([
  'ngGcPageRouter', '$window',
  function ngGcRequestDemoFunnel(ngGcPageRouter, $window) {

    ngGcPageRouter('/request-a-demo', function(path) {
      $window.gct('track', 'Pageview', {
        'Path': path,
        'Property': 'website',
        'Type': 'lead capture'
      });
    });

    // "Capture Lead" event is fired in ProspectsController#sales

  }

]);
