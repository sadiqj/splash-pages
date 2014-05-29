(function main() {
  'use strict';

  angular.module('home', [
    'ngGcGaEventTrackerDirective',
    'ngGcFormSubmitDirective',
    'ngGcHrefActiveDirective',
    'ngGcSignupFunnel',
    'ngGcRequestDemoFunnel',
    'ngGcPageViewEvetns',
    'ngGcCookiesInit',
    'gc.popover',
    'gc.toggle',
    'ngGcProspectFormCtrl',
    'ngGcWatchDemoFormCtrl'
  ]);

  function isSupportedBrowser() {
    var hasJSON = 'JSON' in window && 'parse' in JSON;
    var supportMode = location.search.match(/supportMode/);
    return hasJSON && !supportMode;
  }

  angular.element(document).ready(function setup() {
    // Only give decent browser a js experience
    if (isSupportedBrowser()) {
      // Bootstrap Angular
      angular.bootstrap(document, ['home']);
    }
  });

  var Widgets = window.GoCardless.module('widgets');
  var Home = window.GoCardless.module('home');

  Home.vimeoModals = new Widgets.Views.ModalVimeo();

  Home.demoModals = new Widgets.Views.DemoModal({
    el: '[data-modal-demo]'
  });

  Home.stickyTabs = new Widgets.Views.StickyTabs();

  Home.affix = new Widgets.Views.Affix({
    el: '[data-affix-footer-fixed]'
  });

}());
