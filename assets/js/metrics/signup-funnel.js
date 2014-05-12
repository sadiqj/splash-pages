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

    ngGcPageRouter('/merchants/new', function(path) {
      $window.gct('track', 'Pageview', {
        'Path': path,
        'Property': 'website',
        'Type': 'sign up'
      });
    });

    ngGcPageRouter('/connect/merchants/new', function(path) {
      $window.gct('track', 'Pageview', {
        'Path': path,
        'Property': 'website',
        'Type': 'sign up'
      });
    });

    // "Sign Up" event is fired in MerchantsController#create

  }

]);
