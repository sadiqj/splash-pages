'use strict';

require('./initializers/raven-config');
require('./initializers/cookies');

require('./components/dialog/dialog-controller');
require('./components/popover/popover-directive');
require('./components/tabby/ng-gc-tabby-active-directive');
require('./components/tabby/ng-gc-tabby-content-directive');
require('./components/tabby/ng-gc-tabby-store-service');
require('./components/tabby/ng-gc-tabby-trigger-directive');
require('./components/toggle/ng-gc-toggle-directive');

require('./directives/ng-gc-form-submit-directive');
require('./directives/ng-gc-svg-injector-directive');
require('./directives/ng-gc-ga-event-tracker-directive');
require('./directives/ng-gc-href-active-directive');
require('./directives/ng-gc-smooth-scroll-directive');
require('./directives/ng-gc-sticky-nav-directive');
require('./directives/ng-gc-video-thumb-directive');
require('./directives/ng-gc-vimeo-iframe-directive');
require('./directives/modal-directive');

require('./controllers/ng-gc-prospect-form-controller');
require('./controllers/ng-gc-active-video-controller');

require('./services/location-hash');

var angular = require('angular');

require('../components/angular-animate/angular-animate');
require('../components/angular-scroll/angular-scroll');

angular.module('home', [
  'ngAnimate',
  'duScroll',
  'ngGcGaEventTrackerDirective',
  'ngGcFormSubmitDirective',
  'ngGcHrefActiveDirective',
  'ngGcCookiesInit',
  'gc.popover',
  'gc.toggle',
  'ngGcProspectFormCtrl',
  'ngGcActiveVideoCtrl',
  'ngGcSmoothScrollDirective',
  'ngGcVimeoIframeDirective',
  'ngGcVideoThumbDirective',
  'ngGcStickyNavDirective',
  'ngGcTabbyActiveDirective',
  'ngGcTabbyContentDirective',
  'ngGcTabbyTriggerDirective',
  'ngGcLocationHash',
  'ngGcSvgInjectorDirective',
  'modalDirective'
]).config([
  '$interpolateProvider',
  function($interpolateProvider) {
    $interpolateProvider.startSymbol('((').endSymbol('))');
  }
]).run([
  '$rootScope', 'locationHash',
  function($rootScope, locationHash){
    var isActive = false;

    $rootScope.$on('duScrollspy:becameActive', function($event, $element){
      var hash = $element.attr('href');
      locationHash.set(hash);
      isActive = true;
    });

    // inactive fires before active
    $rootScope.$on('duScrollspy:becameInactive', function(){
      isActive = false;
      setTimeout(function() {
        if (!isActive) {
          locationHash.clear();
        }
      }, 0);
    });
  }
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
