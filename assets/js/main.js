(function(root) {
  'use strict';

  angular.module('home', [
    'ngGcGaEventTrackerDirective',
    'ngGcFormSubmitDirective',
    'ngGcHrefActiveDirective',
    'ngGcSignupFunnel',
    'ngGcRequestDemoFunnel',
    'ngGcPageViewEvetns',
    'ngGcCookiesInit'
  ]);

  angular.element(document).ready(function setup() {
    // Only give decent browser a js experience
    if (window.isSupportedBrowser()) {
      // Bootstrap Angular
      angular.bootstrap(document, ['home']);
    }
  });

  var Widgets = root.GoCardless.module('widgets');
  var Home = root.GoCardless.module('home');

  Home.vimeoModals = new Widgets.Views.ModalVimeo();

  Home.demoModals = new Widgets.Views.DemoModal({
    el: '[data-modal-demo]'
  });

  Home.stickyTabs = new Widgets.Views.StickyTabs();

  Home.popover = new Widgets.Views.PopOver();

  Home.affix = new Widgets.Views.Affix({
    el: '[data-affix-footer-fixed]'
  });

})(this);
