'use strict';

var path = require('path');

var gutil = require('gulp-util');
var through = require('through2');
var html5Lint = require( 'html5-lint' );

var formatOutput = function(report, file) {
  if (!report.messages.length) {
    return {
      success: true
    };
  }

  var filePath = (file.path || 'stdin');

  // Handle errors
  var results = report.messages.map(function(err) {
    if (!err) return;
    return { file: filePath, error: err };
  }).filter(function(err) {
    return err;
  });

  var output = {
    errorCount: results.length,
    success: false,
    results: results
  };

  return output;
};

function linter(options) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      throw new Error('Streaming not supported');
    }

    return html5Lint(file.contents.toString(), function(err, results) {
      if (err) {
        cb(err);
      }

      file.htmllint = formatOutput(results, file);

      cb(null, file);
    });
  });
}

function defaultReporter(file) {
  var errorCount = file.htmllint.errorCount;
  var plural = errorCount === 1 ? '' : 's';

  gutil.log(gutil.colors.cyan(errorCount) + ' error' + plural +
    ' found in ' + gutil.colors.magenta(file.path));

  file.htmllint.results.forEach(function(result) {
    var message = result.error;

    gutil.log(
      gutil.colors.red('[') +
      (typeof message.lastLine !== 'undefined' ?
        gutil.colors.yellow( 'L' + message.lastLine ) +
        gutil.colors.red(':') +
        gutil.colors.yellow( 'C' + message.firstColumn ) +
        gutil.colors.red('-') +
        gutil.colors.yellow( 'C' + message.lastColumn )
      :
         gutil.colors.yellow('GENERAL')
      ) +
      gutil.colors.red('] ') +
      message.message + '\n' + message.extract);
  });
}

function reporter(customReporter) {
  var reporterFn = defaultReporter;
  if (typeof customReporter === 'function') {
    reporterFn = customReporter;
  }

  return through.obj(function(file, enc, cb) {
    // Only report if HTMLLint was ran and errors were found
    if (file.htmllint && !file.htmllint.success) {
      reporterFn(file);
    }

    return cb(null, file);
  });
}

function failReporter() {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      throw new Error('Streaming not supported');
    }

    // Nothing to report or no errors
    if (!file.htmllint || file.htmllint.success) {
      return cb(null, file);
    }

    return cb(new gutil.PluginError(
      'gulp-htmllint', 'HTMLLint failed for ' + file.relative),
      file
    );
  });
}

linter.reporter = reporter;
linter.failReporter = failReporter;

module.exports = linter;
