'use strict';

var angular = require('angular');
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

    });

  }

]);
