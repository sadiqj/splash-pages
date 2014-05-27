'use strict';

var util = require('util');
var crypto = require('crypto');

var through = require('through2');
var mime = require('mime');
var redirects = require('./../redirects.json');
var AWS = require('aws-sdk');
var _ = require('lodash');

var MSG = {
  SKIP_MATCHES: '✓ %s',
  UPLOAD_SUCCESS: '↗ %s/%s',
  ERR_UPLOAD: '✖ %s (%s)'
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

      var msg = util.format(MSG.UPLOAD_SUCCESS, params.Bucket, dest);
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
  return function deploy(AWSOptions, s3Options) {
    AWSOptions = _.clone(AWSOptions, true);
    s3Options = _.clone(s3Options, true);

    AWS.config.update(_.extend({
      sslEnabled: true,
      region: process.env.AWS_DEFAULT_REGION || 'us-west-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }, AWSOptions));

    var client = new AWS.S3();

    return through.obj(function(file, enc, cb) {
      if (file.isNull()) {
        return cb();
      }

      if (file.isStream()) {
        throw new Error('Streaming not supported');
      }

      sync(client, file, s3Options, cb);
    });
  };
})(sync, AWS, through);

module.exports = deploy;
