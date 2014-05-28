// <script src="components/jquery/dist/jquery.js"></script>
// <script src="components/lodash/dist/lodash.compat.js"></script>
// <script src="components/angular/angular.js"></script>
// <script src="components/angular-cookies/angular-cookies.js"></script>
// <script src="components/es5-shim/es5-shim.js"></script>
// <script src="components/raven-js/dist/raven.js"></script>
// <script src="components/ng-gc-components/ng-gc-popover-directive/popover-directive.js"></script>
// <script src="components/ng-gc-components/ng-gc-toggle-directive/ng-gc-toggle-directive.js"></script>
// <script src="components/ng-gc-components/ng-gc-dialog-directive/dialog-controller.js"></script>
// <script src="components/dialog.js/dialog.js"></script>
// <script src="components/mute-console/mute-console.js"></script>

// <script src="components/deprecated-js/lib/bootstrap/tab.js"></script>
// <script src="components/deprecated-js/lib/froogaloop.js"></script>
// <script src="components/deprecated-js/modal/modal.js"></script>
// <script src="components/deprecated-js/gocardless-global.js"></script>
// <script src="components/deprecated-js/module.js"></script>
// <script src="components/deprecated-js/base-view.js"></script>
// <script src="components/deprecated-js/class-extends.js"></script>
// <script src="components/deprecated-js/widgets/modals.js"></script>
// <script src="components/deprecated-js/widgets/modal-vimeo.js"></script>
// <script src="components/deprecated-js/widgets/demo-modal.js"></script>
// <script src="components/deprecated-js/widgets/affix.js"></script>
// <script src="components/deprecated-js/widgets/sticky-tabs.js"></script>
// <script src="js/initializers/raven-config.js"></script>
// <script src="js/initializers/cookies.js"></script>
// <script src="js/services/url-parameter-service.js"></script>
// <script src="js/directives/ng-gc-ga-event-tracker-directive.js"></script>
// <script src="js/directives/ng-gc-form-submit-directive.js"></script>
// <script src="js/directives/ng-gc-href-active-directive.js"></script>
// <script src="js/controllers/ng-gc-prospect-form-controller.js"></script>
// <script src="js/controllers/ng-gc-watch-demo-form-controller.js"></script>
// <script src="js/metrics/page-router.js"></script>
// <script src="js/metrics/signup-funnel.js"></script>
// <script src="js/metrics/request-demo-funnel.js"></script>
// <script src="js/metrics/pageview-events.js"></script>
// <script src="js/main.js"></script>

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
