(function(root) {
  'use strict';

  angular.module('home', [
    'ngGcGaEventTrackerDirective',
    'ngGcFormSubmitDirective',
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
    el: "[data-modal-demo]"
  });

  Home.stickyTabs = new Widgets.Views.StickyTabs();

  Home.popover = new Widgets.Views.PopOver();

  Home.salesProspectForm = new Widgets.Views.FormSubmit({
    el: '[data-sales-prospect-form]',
    errorEl: '[data-sales-prospect-form-errors]',
    successEl: '[data-sales-prospect-form-success]'
  });

  Home.ddGuideForm = new Widgets.Views.FormSubmit({
    el: '[data-dd-guide-form]',
    errorEl: '[data-dd-guide-form-errors]',
    successEl: '[data-dd-guide-form-success]'
  });

  Home.valueShow = new Widgets.Views.ValueShow();

  Home.affix = new Widgets.Views.Affix({
    el: '[data-affix-footer-fixed]'
  });

  console.log(
    'We\'re looking to hire people like you. https://gocardless.com/jobs'
  );

})(this);
