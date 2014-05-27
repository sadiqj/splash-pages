'use strict';

var gutil = require('gulp-util');
var through = require('through2');

function htmlHintFailReporter() {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      throw new Error('Streaming not supported');
    }

    // Nothing to report or no errors
    if (!file.htmlhint || file.htmlhint.success) {
      return cb(null, file);
    }

    return cb(new gutil.PluginError(
      'gulp-htmlhint', 'HTMLHint failed for ' + file.relative),
      file
    );
  });
}

module.exports = htmlHintFailReporter;
