'use strict';

require('./initializers/raven-config');
require('./initializers/cookies');

require('./directives/ng-gc-form-submit-directive');
require('./directives/ng-gc-href-active-directive');
require('./directives/ng-gc-ga-event-tracker-directive');
require('./directives/ng-gc-form-submit-directive');
require('./directives/ng-gc-smooth-scroll-directive');

require('./controllers/ng-gc-prospect-form-controller');
require('./controllers/ng-gc-watch-demo-form-controller');

require('../components/ng-gc-components/ng-gc-dialog-directive/dialog-controller');
require('../components/ng-gc-components/ng-gc-popover-directive/popover-directive');
require('../components/ng-gc-components/ng-gc-toggle-directive/ng-gc-toggle-directive');

var ModalVimeo = require('../js/deprecated-js/widgets/modal-vimeo');
var StickyTabs = require('../js/deprecated-js/widgets/sticky-tabs');
var Affix = require('../js/deprecated-js/widgets/affix');
require('../js/deprecated-js/lib/bootstrap/tab.js');

var angular = require('angular');

angular.module('home', [
  'ngGcGaEventTrackerDirective',
  'ngGcFormSubmitDirective',
  'ngGcHrefActiveDirective',
  'ngGcCookiesInit',
  'gc.popover',
  'gc.toggle',
  'ngGcProspectFormCtrl',
  'ngGcWatchDemoFormCtrl',
  'ngGcSmoothScrollDirective'
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

module.exports = {
  modalVimeo: new ModalVimeo(),
  stickyTabs: new StickyTabs(),
  affix: new Affix({
    el: '[data-affix-footer-fixed]'
  })
};
