'use strict';

if (!process.env.GC_SAUCE_LABS_KEY) {
  console.error('For browser tests export GC_SAUCE_LABS_KEY');
}

module.exports = function(config) {
  config.set({
    basePath: './assets/js',
    frameworks: ['browserify', 'jasmine'],
    preprocessors: {
      // hack https://github.com/cjohansen/karma-browserifast
      '/**/*.browserify': 'browserify'
    },
    browserify: {
      files: [
        'assets/js/vendor.js',
        'assets/js/main.js',
        'assets/js/**/*spec.js'
      ],
      transform: ['brfs']
    },
    browsers: ['PhantomJS'],
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
