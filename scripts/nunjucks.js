#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs');

var through2 = require('through2');
var nunjucks = require('nunjucks');
var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));
var RSVP = require('rsvp');
var mkdirp = require('mkdirp');
var frontMatter = require('front-matter');

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

function stream(filepath, outfile, compile) {
  return fs.createReadStream(filepath).pipe(through2.obj({
    allowHalfOpen: false
  }, function(file, enc, cb) {
    var _this = this;
    var parsed = frontMatter(file.toString());
    compile(new Buffer(parsed.body), parsed.attributes)
      .then(function(result) {
        _this.push(new Buffer(result));
        cb();
      }, function(reason) {
        errorExit(reason);
      });
  }));
}

var searchPaths = _.flatten([argv['search-path'] || '']);
searchPaths = searchPaths.map(function(searchPath) {
  return new nunjucks.FileSystemLoader(path.join(process.cwd(), searchPath));
});

var env = new nunjucks.Environment(searchPaths, {
  autoescape: false
});

function compileTemplate(file, metadata) {
  var deferred = RSVP.defer();

  env.renderString(file.toString(), metadata, function(err, result) {
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(result);
  });

  return deferred.promise;
}

function templateMetadata() {
  var metadata = {};
  var metadataFile = argv['require-metadata'];
  if (metadataFile) {
    try {
      metadata = require(path.join(process.cwd(), metadataFile));
    } catch (e) {
      console.error('Failed to load %s', metadataFile);
    }
  }
  return metadata;
}

var globalMetadata = templateMetadata();

function findFiles(filepath, cb) {
  var stat = fs.statSync(filepath);
  if (stat.isFile()) {
    cb(filepath);
  } else if (stat.isDirectory()) {
    fs.readdirSync(filepath).forEach(function(filename){
      findFiles(path.join(filepath, filename), cb);
    });
  }
}

findFiles((argv.i || argv.input), function(filepath) {
  // ignore files starting with _
  if (path.basename(filepath).match(/^\_/) ||
      !path.extname(filepath).match('.html')) {
    return;
  }

  var cwd = process.cwd();
  var inputCwd = path.join(cwd, argv.cwd || '');
  var outfile = path.join(cwd, filepath).replace(inputCwd, '');
  var output = argv.o || argv.output;
  outfile = path.join(output, outfile);
  mkdirp.sync(path.dirname(outfile));

  console.log('Compiling %s (%s)', filepath, outfile);

  stream(filepath, outfile, function(file, fileMetadata) {
	var metadata = {}
	_.extend(metadata, globalMetadata, fileMetadata);
    return compileTemplate(file, metadata);
  }).pipe(fs.createWriteStream(outfile));
});
