'use strict';

angular.module('ngGcSignupFunnel', [
  'ngGcPageRouterService'
]).run([
  'ngGcPageRouter', '$window',
  function ngGcSignupFunnel(ngGcPageRouter, $window) {

    ngGcPageRouter('/', function(path) {
      $window.gct('track', 'Pageview', {
        'Path': path,
        'Property': 'website',
        'Type': 'landing'
      });
    });

    // "/merchants/new" and "/connect/merchants/new" are triggered in gocardless/gocardless
    // assets/javascripts/connect/metrics

    // "Sign Up" event is fired in MerchantsController#create

  }

]);
