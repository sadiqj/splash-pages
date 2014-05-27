#!/usr/bin/env node

'use strict';

var util = require('util');
var crypto = require('crypto');

var through = require('through2');
var mime = require('mime');
var redirects = require('./../redirects.json');
var AWS = require('aws-sdk');
var _ = require('lodash');
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

var MSG = {
  SKIP_MATCHES: 'File Matches, skipped %s',
  UPLOAD_SUCCESS: 'Uploaded: %s/%s (%s)',
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
  return function upload(client, file, options, cb) {
    options = _.extend({
      ACL : 'public-read'
    }, options);

    var params = _.extend(buildUploadParams(file), options);
    var dest = params.Key;

    if (params.WebsiteRedirectLocation) {
      log('!!!!!!!!!!!!');
      log('Redirecting:', dest, 'to:', params.WebsiteRedirectLocation);
      log('!!!!!!!!!!!!');
    }

    // Upload the file to s3.
    client.putObject(params, function(err){
      if (err) {
        log(MSG.ERR_UPLOAD, err, err.stack);
        return cb();
      }

      var msg = util.format(MSG.UPLOAD_SUCCESS, dest, params.Bucket, dest);
      log(msg);
      cb();
    });
  };
})(buildUploadParams, MD5, MSG);

var sync = (function(upload, buildBaseParams, MSG) {
  return function sync(client, file, options, cb) {
    var params = _.extend({
      IfNoneMatch: MD5(file.contents),
      IfUnmodifiedSince: file.stat.mtime
    }, buildBaseParams(file), options);

    client.headObject(params, function(err) {
      if (err && (err.statusCode === 304 || err.statusCode === 412)) {
        log(MSG.SKIP_MATCHES, params.Key);
        return cb();
      }

      upload(client, file, options, cb);
    });
  };
})(upload, buildBaseParams, MSG);

var deploy = (function(sync, AWS, through) {
  return function deploy(files, AWSOptions, s3Options) {
    AWSOptions = _.clone(AWSOptions, true);
    s3Options = _.clone(s3Options, true);

    AWS.config.update(_.extend({
      sslEnabled: true,
      region: process.env.AWS_DEFAULT_REGION || 'us-west-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }, AWSOptions));

    var client = new AWS.S3();

    files.forEach(function(path) {
      fs.readFile(path, {
        encoding: null
      }, function(err, data) {
        if (err) {
          errorExit('Failed to read file: ' + path);
        }
        var stat = fs.statSync(path);
        sync(client, {
          base: process.cwd(),
          path: path,
          contents: data,
          stat: stat
        }, s3Options, cb);
      });
    });
  };
})(sync, AWS, through);

var files = _.flatten(argv._
  .filter(Boolean).map(function(pattern) {
    return glob.sync(pattern);
  }));

deploy(files, {
  region: 'eu-west-1',
  accessKeyId: process.env.GC_AWS_ACCESS_KEY,
  secretAccessKey: process.env.GC_AWS_SECRET
}, {
  Bucket: process.env.AWS_S3_BUCKET,
});
