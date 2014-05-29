#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var flo = require('fb-flo');

function buildJS(callback) {
  exec('make js', function (err) {
    if (err) throw err;
    var file = '/js/main.js';
    callback({
      resourceURL: file,
      reload: true,
      contents: fs.readFileSync(path.join('build', file)).toString()
    });
  });
}

function buildCSS(callback) {
  exec('make css', function (err) {
    if (err) throw err;
    var file = '/css/main.css';
    callback({
      resourceURL: file,
      contents: fs.readFileSync(path.join('build', file)).toString()
    });
  });
}

function buildHTML(callback) {
  exec('make nunjucks', function (err) {
    if (err) throw err;
    callback();
  });
}

function reload(callback, filepath) {
  var file;
  try {
    file = fs.readFileSync(path.join('app', filepath));
    callback({
      resourceURL: '/' + filepath.replace('app/', ''),
      reload: true,
      contents: file
    });
  } catch (e) {
    console.error('Failed to load app/%s', filepath);
  }
}

function resolver(filepath, callback) {
  var file = path.join('app', filepath);
  var ext = path.extname(filepath);

  console.log('File changed: %s', filepath);

  if (ext === '.js') {
    return buildJS(callback);
  } if (ext === '.scss') {
    return buildCSS(callback);
  } if (ext === '.html' && filepath.match(/^pages/)) {
    return buildHTML(function() {
      reload(callback, filepath);
    });
  } else {
    reload(callback, filepath);
  }
}

var server = flo('./app', {
  port: 8888,
  host: 'localhost',
  verbose: false,
  glob: [
    'js/**/*.js',
    'css/**/*.scss',
    'images/**/*.png',
    'images/**/*.jpg',
    'images/**/*.jpeg',
    '**/*.html'
  ]
}, resolver);

server.once('ready', function() {
  console.log('Watching files!');
});
