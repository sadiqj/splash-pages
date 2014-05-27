'use strict';

if (!process.env.GC_SAUCE_LABS_KEY) {
  console.error('For browser tests export GC_SAUCE_LABS_KEY');
}

module.exports = function(config) {
  config.set({
    basePath: './assets/js',
    preprocessors: {
      '**/*.html': ['ng-html2js']
    },
    files: [
      'assets/components/jquery/dist/jquery.js',
      'assets/components/lodash/dist/lodash.compat.js',
      'assets/components/angular/angular.js',
      'assets/components/angular-cookies/angular-cookies.js',
      'assets/components/es5-shim/es5-shim.js',
      'assets/components/mute-console/mute-console.js',

      'assets/components/jasmine-helpers/*.js',
      'assets/components/angular-mocks/angular-mocks.js',

      'assets/js/lib/bootstrap/tab.js',
      'assets/js/lib/froogaloop.js',

      'assets/js/directives/ng-gc-ga-event-tracker-directive.js',
      'assets/js/directives/ng-gc-form-submit-directive.js',
      'assets/js/directives/ng-gc-href-active-directive.js',
      'assets/js/modal/modal.js',
      'assets/js/gocardless-global.js',
      'assets/js/module.js',
      'assets/js/base-view.js',
      'assets/js/class-extends.js',
      'assets/js/widgets/modals.js',
      'assets/js/widgets/modal-vimeo.js',
      'assets/js/widgets/demo-modal.js',
      'assets/js/widgets/popover.js',
      'assets/js/widgets/affix.js',
      'assets/js/widgets/sticky-tabs.js',
      'assets/js/metrics/**/*.js',
      'assets/js/cookies.js',
      'assets/js/url-parameter-service.js',
      'assets/js/**/*spec.js'
    ],
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    reporters: ['dots', 'growl'],
    autoWatch: true,
    singleRun: true,
    logLevel: config.LOG_INFO,
    logColors: true,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 20000,
    reportSlowerThan: 50,

    sauceLabs: {
      username: 'gocardless',
      accessKey: process.env.GC_SAUCE_LABS_KEY,
      startConnect: true,
      testName: 'Splash pages',
      options: {
        'selenium-version': '2.37.0'
      }
    },

    // For more browsers on Sauce Labs see:
    // https://saucelabs.com/docs/platforms/webdriver
    customLaunchers: {
      SL_Chrome: {
        base: 'SauceLabs',
        browserName: 'chrome'
      },
      SL_Firefox: {
        base: 'SauceLabs',
        browserName: 'firefox'
      },
      SL_Safari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'Mac 10.8',
        version: '6'
      },
      SL_IE_9: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2008',
        version: '9'
      },
      SL_IE_10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2012',
        version: '10'
      },
      SL_IE_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      },
      SL_IOS_61: {
        base: 'SauceLabs',
        browserName: 'ipad',
        platform: 'OS X 10.8',
        'device-orientation': 'portrait',
        version: '6.1'
      }
    }
  });
};
