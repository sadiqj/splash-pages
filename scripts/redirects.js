#!/usr/bin/env node

'use strict';

'use strict';

var path = require('path');
var fs = require('fs');

var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));
var mkdirp = require('mkdirp');

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

if (!_.isString(argv.redirects)) {
  errorExit('No --redirects file');
}

var redirects = require(path.join(process.cwd(), argv.redirects));

function testTmpl(target) {
  return '<!doctype html>' +
    '<html>' +
    '<meta charset="utf-8">' +
    '<meta http-equiv="refresh" content="0;url=' + target + '">' +
    '</html>';
}

function redirect(redirects) {
  if (!_.isObject(redirects)) {
    errorExit('--redirects file not an object');
  }

  Object.keys(redirects).forEach(function(redirect) {
    var target = redirects[redirect];
    var outfolder = (argv.o || argv.output) || '';
    var outfile = path.join(process.cwd(), outfolder, redirect);
    mkdirp.sync(path.dirname(outfile));
    fs.writeFileSync(outfile, testTmpl(target))
  });
}

redirect(redirects);
