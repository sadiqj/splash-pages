#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

var flo = require('fb-flo');

function resolver(filepath, callback) {
  var file = path.join('assets', filepath);
  console.log(file, filepath);

  callback({
    resourceURL: filepath,
    contents: fs.readFileSync(file)
  });
}

var server = flo('./assets', {
  port: 8888,
  host: 'localhost',
  verbose: true,
  glob: [
    '**/*.js',
    '**/*.css',
    '**/*.html'
  ]
}, resolver);

server.once('ready', function() {
  console.log('Ready!');
});
