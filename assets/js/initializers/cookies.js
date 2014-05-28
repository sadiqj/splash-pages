'use strict';

require('angular-cookies');
require('../services/url-parameter-service');

angular.module('ngGcCookiesInit', [
  'ngCookies', 'ngGcURLParameterService'
]).run([
    '$cookies', 'ngGcURLParameter',
    function ngGcCookiesInit($cookies, ngGcURLParameter) {
      var referrer = (ngGcURLParameter.get('r') || '').toUpperCase();
      var gclid = !!ngGcURLParameter.get('gclid');

      function setCookie(cookie, value) {
        $cookies[cookie] = value;
      }

      if (referrer) {
        setCookie('referral_code', referrer);
      }

      if (gclid) {
        setCookie('google_ppc_click', gclid);
      }

    }
  ]);
