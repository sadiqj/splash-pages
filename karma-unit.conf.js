'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'jasmine'],
    preprocessors: {
      // hack https://github.com/cjohansen/karma-browserifast
      '/**/*.browserify': 'browserify'
    },
    browserify: {
      files: [
        'assets/js/main.js',
        'assets/js/**/*spec.js'
      ],
      transform: ['brfs']
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
