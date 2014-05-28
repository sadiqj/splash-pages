'use strict';

require('./page-router');

angular.module('ngGcPageViewEvents', [
  'ngGcPageRouterService'
]).run([
  'ngGcPageRouter', '$window',
  function ngGcPageViewEvents(ngGcPageRouter, $window) {

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
