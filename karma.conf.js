'use strict';

module.exports = function(config) {
  config.set({
    basePath: './app',
    frameworks: ['jasmine', 'browserify'],
    preprocessors: {
      // Hack https://github.com/cjohansen/karma-browserifast
      '/**/*.browserify': 'browserify'
    },
    files: [
      'components/jasmine-helpers/*.js',
      'components/jquery/dist/jquery.js',
      'components/es5-shim/es5-shim.js'
    ],
    browserify: {
      files: [
        'js/**/*spec.js'
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
