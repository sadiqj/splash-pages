'use strict';

var path = require('path');

var through = require('through2');
var html5Lint = require( 'html5-lint' );

function lint(html, cb) {
  return html5Lint(html, function(err, results) {
    if (err) {
      cb(err);
    }

    results.messages.forEach(function(msg) {
      var type = msg.type; // error or warning
      var message = msg.message;

      console.log('HTML5 Lint [%s]: %s', type, message);
    });

    cb();
  });
}

function linter(options) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      throw new Error('Streaming not supported');
    }

    lint(file.contents.toString(), cb);
  });
}

module.exports = linter;
