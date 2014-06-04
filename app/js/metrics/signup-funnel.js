'use strict';

var angular = require('angular');
require('./page-router');

angular.module('ngGcSignupFunnel', [
  'ngGcPageRouterService'
]).run([
  'ngGcPageRouter', '$window',
  function ngGcSignupFunnel(ngGcPageRouter, $window) {

    ngGcPageRouter('/', function trackPageView(path) {

      });
    });

    // "/merchants/new" and "/connect/merchants/new" are triggered in gocardless/gocardless
    // assets/javascripts/connect/metrics

    // "Sign Up" event is fired in MerchantsController#create

  }

]);
