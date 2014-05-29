'use strict';

module.exports = function(config) {
  config.set({
    basePath: './assets/js',
    frameworks: ['jasmine', 'browserify'],
    preprocessors: {
      // Hack https://github.com/cjohansen/karma-browserifast
      '/**/*.browserify': 'browserify'
    },
    files: [
      'assets/components/jasmine-helpers/*.js',
      'assets/components/jquery/dist/jquery.js'
    ],
    browserify: {
      files: [
        '**/*spec.js'
      ],
      transform: ['brfs', 'browserify-shim']
    },
    browsers: ['PhantomJS'],
    reporters: ['dots', 'growl'],
    autoWatch: false,
    singleRun: true,
    logLevel: config.LOG_INFO,
    logColors: true,
    reportSlowerThan: 50
  });
};
