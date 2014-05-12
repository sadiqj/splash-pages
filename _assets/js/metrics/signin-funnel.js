'use strict';

angular.module('ngGcSigninFunnel', [
  'ngGcPageRouterService'
]).run([
  'ngGcPageRouter', '$window',
  function ngGcSigninFunnel(ngGcPageRouter, $window) {

    ngGcPageRouter('/users/sign_in', function(path) {
      $window.gct('track', 'Pageview', {
        'Path': path,
        'Property': 'website',
        'Type': 'authentication'
      });
    });

  }

]);
