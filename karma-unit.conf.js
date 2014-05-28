'use strict';

module.exports = function(config) {
  config.set({
    basePath: './assets/js',
    frameworks: ['browserify', 'jasmine'],
    preprocessors: {
      // Hack https://github.com/cjohansen/karma-browserifast
      '/**/*.browserify': 'browserify'
    },
    files: [
    ],
    browserify: {
      files: [
        '**/*spec.js'
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
