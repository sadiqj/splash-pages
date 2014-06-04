'use strict';

var angular = require('angular');
require('./page-router');

angular.module('ngGcRequestDemoFunnel', [
  'ngGcPageRouterService'
]).run([
  'ngGcPageRouter', '$window',
  function ngGcRequestDemoFunnel(ngGcPageRouter, $window) {

    ngGcPageRouter('/watch-a-demo', function trackPageView(path) {

      });
    });

    // "Capture Lead" event is fired in ProspectsController#sales

  }

]);
