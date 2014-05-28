#!/usr/bin/env node

'use strict';

var util = require('util');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var through = require('through2');
var mime = require('mime');
var glob = require('glob');
var redirects = require('./../conf/redirects.json');
var AWS = require('aws-sdk');
var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));

process.stdout.on('error', process.exit);

var options = {
  bucket: argv.bucket,
  region: argv.r || argv.region || 'us-west-1',
  cwd: argv.cwd || ''
};

function errorExit(err) {
  if (err.stack) {
    console.error(err.stack);
  }
  else {
    console.error(String(err));
  }
  process.exit(1);
}

var MSG = {
  SKIP_MATCHES: 'File Matches, skipped %s',
  UPLOAD_SUCCESS: 'Uploaded: %s/%s',
  ERR_UPLOAD: 'Upload error: %s (%s)',
  ERR_CHECKSUM: '%s error: expected hash: %s but found %s for %s'
};

function log() {
  console.log.apply(null, arguments);
}

var contentType = (function(mime) {
  return function contentType(src) {
    var type = mime.lookup(src).replace('-', '');
    var charset = mime.charsets.lookup(type, null);

    if (charset) {
      type += '; charset=' + charset;
    }

    return type;
  };
})(mime);

var MD5 = (function(crypto) {
  return function MD5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  };
})(crypto);

var base64MD5 = (function(crypto) {
  return function base64MD5(data) {
    return crypto.createHash('md5').update(data).digest('base64');
  };
})(crypto);

var redirect = (function(redirects) {
  return function redirect(dest) {
    if (dest.indexOf('/') !== 0) {
      dest = '/' + dest;
    }

    return redirects[dest];
  };
})(redirects);

function buildBaseParams(file) {
  var dest = file.path.replace(file.base, '');
  dest = dest.replace(/^\//, '');
  return {
    Key: dest
  };
}

var buildUploadParams = (function(base64MD5, redirect, buildBaseParams) {
  return function buildUploadParams(file) {
    var params = _.extend({
      ContentMD5 : base64MD5(file.contents),
      Body : file.contents,
      ContentType: contentType(file.path),
      CacheControl: 'max-age=0, no-cache'
    }, buildBaseParams(file));

    var websiteRedirectLocation = redirect(params.Key);
    if (websiteRedirectLocation) {
      params.WebsiteRedirectLocation = websiteRedirectLocation;
    }

    return params;
  };
})(base64MD5, redirect, buildBaseParams);

var upload = (function(buildUploadParams, MD5, MSG) {
  return function upload(client, file, options) {
    options = _.extend({
      ACL : 'public-read'
    }, options);

    var params = _.extend(buildUploadParams(file), options);
    var dest = params.Key;

    if (params.WebsiteRedirectLocation) {
      log('!!! Redirecting:', dest, 'to:', params.WebsiteRedirectLocation);
    }

    // Upload the file to s3.
    client.putObject(params, function(err){
      if (err) {
        log(MSG.ERR_UPLOAD, err, err.stack);
      }

      var msg = util.format(MSG.UPLOAD_SUCCESS, params.Bucket, dest);
      log(msg);
    });
  };
})(buildUploadParams, MD5, MSG);

var sync = (function(upload, buildBaseParams, MSG) {
  return function sync(client, file, options) {
    var params = _.extend({
      IfNoneMatch: MD5(file.contents),
      IfUnmodifiedSince: file.stat.mtime
    }, buildBaseParams(file), options);

    client.headObject(params, function(err) {
      if (err && (err.statusCode === 304 || err.statusCode === 412)) {
        log(MSG.SKIP_MATCHES, params.Key);
        return;
      }

      upload(client, file, options);
    });
  };
})(upload, buildBaseParams, MSG);

function readFile(filepath, cb) {
  var stat = fs.statSync(filepath);
  if (stat.isFile()) {
    fs.readFile(filepath, {
      encoding: null
    }, function(err, data) {
      if (err) {
        errorExit('Failed to read file: ' + filepath);
      }
      cb({
        stat: stat,
        contents: data,
        base: path.join(process.cwd(), options.cwd),
        path: path.join(process.cwd(), filepath)
      });
    });
  }
  else if (stat.isDirectory()) {
    fs.readdir(filepath, function(err, files) {
      if (err) {
        errorExit('Failed to read files: ' + err);
      }
      files.forEach(function(filename){
        readFile(path.join(filepath, filename), cb);
      });
    });
  }
}

var deploy = (function(sync, AWS, through) {
  return function deploy(files, AWSOptions, s3Options) {
    AWSOptions = _.clone(AWSOptions, true);
    s3Options = _.clone(s3Options, true);

    AWS.config.update(_.extend({
      sslEnabled: true,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }, AWSOptions));

    var client = new AWS.S3();

    files.forEach(function(path) {
      readFile(path, function(fileObject) {
        sync(client, fileObject, s3Options);
      });
    });
  };
})(sync, AWS, through);

var files = _.flatten(argv._
  .filter(Boolean).map(function(pattern) {
    return glob.sync(pattern);
  }));

console.log('Deploying files: %s', files);
console.log('> Target S3 bucket: %s (%s region)',
  options.bucket, options.region);

deploy(files, {
  region:  argv.r || argv.region
}, {
  Bucket:  options.bucket,
});
