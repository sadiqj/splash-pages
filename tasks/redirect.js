'use strict';

var _ = require('lodash');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');

function testTmpl(target) {
  return '<!doctype html>' +
    '<html>' +
    '<meta charset="utf-8">' +
    '<meta http-equiv="refresh" content="0;url=' + target + '">' +
    '</html>';
}

function redirect(redirects) {
  if (!_.isObject(redirects)) {
    throw new Error('redirects must be an object');
  }

  return through.obj(function (file, enc, cb) {
    var self = this;

    Object.keys(redirects).forEach(function(redirect) {
      var target = redirects[redirect];
      var outputFilePath = path.join(file.base, redirect, 'index.html');

      self.push(new gutil.File({
        base: file.base,
        path: outputFilePath,
        contents: new Buffer(testTmpl(target))
      }));
    });

    cb();
  });
}

module.exports = redirect;
