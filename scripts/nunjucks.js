#!/usr/bin/env node

'use strict';

var path = require('path');
var through = require('through2');
var nunjucks = require('nunjucks');
var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));

process.stdout.on('error', process.exit);

function errorExit(err) {
  if (err.stack) {
    console.error(err.stack);
  }
  else {
    console.error(String(err));
  }
  process.exit(1);
}

var files = _.flatten(argv._
  .filter(Boolean).map(function(pattern) {
    return glob.sync(pattern);
  }));

var env = nunjucks.configure([
  path.join(__dirname, '..', '.tmp', 'templates'),
  path.join(__dirname, '..', 'pages'),
  path.join(__dirname, '..', 'macros'),
  path.join(__dirname, '..', 'includes')
], {
  autoescape: false
});

function render(file, metadata) {
  console.log('template:', 'checking file:', chalk.blue(file.path));
  var res = env.renderString(file.contents.toString(), metadata);
  console.log('template:', 'converted file:', chalk.blue(file.path));

  file.contents = new Buffer(res);
  return file;
}

function template(options, metadata) {
  options = options || {};

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      throw new Error('Streaming not supported');
    }

    this.push(render(file, metadata));

    cb();
  });
}
