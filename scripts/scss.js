#!/usr/bin/env node

'use strict';

// Command interface
//
// Accept STDIN
// Default to STDOUT
// Support --output

var fs = require('fs');
var path = require('path');

var glob = require('glob');
var through2 = require('through2');
var argv = require('minimist')(process.argv.slice(2));
var _ = require('lodash');
var RSVP = require('rsvp');

var sass = require('node-sass');

process.stdout.on('error', process.exit);

if (argv._[0] === 'help' || argv.h || argv.help
|| (process.argv.length <= 2 && process.stdin.isTTY)) {
  return fs.createReadStream(__dirname + '/scss-help.txt')
    .pipe(process.stdout)
    .on('close', function () { process.exit(1) });
}

if (argv.v || argv.version) {
  return console.log(require('../package.json').version);
}

function isStream(obj) {
  return obj && typeof obj === 'object' && typeof obj.pipe === 'function';
}

function errorExit(err) {
  if (err.stack) {
    console.error(err.stack);
  }
  else {
    console.error(String(err));
  }
  process.exit(1);
}

var outfile = argv.o || argv.outfile;

var files = _.flatten(argv._
  .filter(Boolean).map(function(file) {
    return glob.sync(file);
  }));

if (files.length === 0 && typeof process.stdin.read === 'function') {
  files.push(process.stdin);
}

function streamFiles(files, compile) {
  var outputStream = through2();

  files.map(function(file) {
    if (!isStream(file)) {
      return [fs.createReadStream(file), file];
    }
    return [file, 'stdin'];
  }).forEach(function(streamSet) {
    streamSet[0].pipe(through2.obj({
      allowHalfOpen: false
    }, function(file, enc, cb) {
      compile(file, enc)
        .then(function(result) {
          outputStream.push(result);
          cb();
        }, function(reason) {
          console.error(streamSet[1]);
          errorExit(reason);
        });
    }));
  });

  return outputStream;
}

function compileScss(file) {
  var deferred = RSVP.defer();

  var stats = {};

  var includePaths = _.flatten([argv['include-path'] || process.cwd()]);
  var imagePath = argv['image-path'] || '';
  var outputStyle = argv['output-style'] || 'expanded';
  var sourceComments = argv['source-comments'] || 'none';
  var sourceMap = argv['source-map'] || false;

  if (_.isArray(imagePath)) {
    imagePath = imagePath[0];
  }
  if (_.isArray(outputStyle)) {
    outputStyle = outputStyle[0];
  }
  if (_.isArray(sourceComments)) {
    sourceComments = sourceComments[0];
  }
  if (_.isArray(sourceMap)) {
    sourceMap = sourceMap[0];
  }

  // Set the sourceMap path if the sourceComment was 'map',
  // but set source-map was missing
  if (sourceComments === 'map' && !sourceMap) {
    sourceMap = true;
  }

  // Set source map file and set sourceComments to 'map'
  if (sourceMap) {
    sourceComments = 'map';
    if (sourceMap === true && outfile) {
      sourceMap = outfile + '.map';
    } else if (_.isString(sourceMap)) {
      sourceMap = path.resolve(cwd, sourceMap);
    } else {
      errorExit('For source-map output set either --output or --source-map');
    }
  }

  sass.render({
    data: file.toString(),
    success: function success(result) {
      deferred.resolve(result);
    },
    error: function error(reason) {
      deferred.reject(reason);
    },
    includePaths: includePaths,
    imagePath: imagePath,
    outputStyle: outputStyle,
    sourceComments: sourceComments,
    sourceMap: sourceMap,
    stats: stats
  });

  return deferred.promise;
}

var scss = streamFiles(files, compileScss);

scss.on('error', errorExit);

if (outfile) {
  scss.pipe(fs.createWriteStream(outfile));
} else {
  scss.pipe(process.stdout);
}
