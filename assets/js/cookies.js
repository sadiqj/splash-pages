'use strict';

angular.module('ngGcCookiesInit', [
  'ngCookies', 'ngGcURLParameterService'
]).run([
    '$cookies', 'ngGcURLParameter',
    function ngGcCookiesInit($cookies, ngGcURLParameter) {

      var referrer = (ngGcURLParameter.get('r') || '').toUpperCase();
      var gclid = !!(ngGcURLParameter.get('gclid'));

      if (referrer) {
        $cookies['referral_code'] = referrer;
      }

      if (gclid) {
        $cookies['google_ppc_click'] = gclid;
      }

    }
  ]);
