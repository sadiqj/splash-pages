'use strict';

var util = require('util');
var crypto = require('crypto');
var path = require('path');

var through = require('through2');
var mime = require('mime');
var redirects = require('./../redirects.json');
var AWS = require('aws-sdk');
var _ = require('lodash');

var MSG_UPLOAD_SUCCESS = 'Uploaded: %s/%s (%s)';
var MSG_ERR_NOT_FOUND = '¯\\_(ツ)_/¯ File not found: %s';
var MSG_ERR_UPLOAD = 'Upload error: %s (%s)';
var MSG_ERR_CHECKSUM = '%s error: expected hash: %s but found %s for %s';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function bucket() {
  if (isProduction()) {
    return 'gocardless.com';
  } else {
    return 'staging.gocardless.com';
  }
}

AWS.config.update({
  sslEnabled: true,
  region: 'eu-west-1',
  accessKeyId: process.env.GC_AWS_ACCESS_KEY,
  secretAccessKey: process.env.GC_AWS_SECRET
});

function contentType(src) {
  var type = mime.lookup(src).replace('-', '');
  var charset = mime.charsets.lookup(type, null);

  if (charset) {
    type += '; charset=' + charset;
  }

  return type;
}

function MD5(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

function base64MD5(data) {
  return crypto.createHash('md5').update(data).digest('base64');
}

function deploy(options) {
  options = _.extend({
    ACL : 'public-read',
    Bucket : bucket()
  }, options);

  var client = new AWS.S3();

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      throw new Error('Streaming not supported');
    }

    var dest = file.path.replace(file.base, '');
    var params = _.extend({
      ContentMD5 : base64MD5(file.contents),
      Body : file.contents,
      Key : dest,
      ContentType: contentType(file.path),
      CacheControl: 'max-age=0, no-cache'
    }, options);

    var redirectDest = '/' + dest;
    if (redirectDest in redirects) {
      console.log('!!!!!!!!!!!!');
      console.log('Redirecting:', redirectDest, 'to:',
        redirects[redirectDest]);
      console.log('!!!!!!!!!!!!');
      params.WebsiteRedirectLocation = redirects[redirectDest];
    }

    // Upload the file to s3.
    client.putObject(params, function(err, res){
      if (err) {
        console.log(MSG_ERR_UPLOAD, err, res);
        return cb();
      }

      // The etag head in the response from s3 has double quotes around
      // it. Strip them out.
      var remoteHash = res.ETag.replace(/^"|"$/g, '');
      // Get an md5 of the local file so we can verify the upload.
      var localHash = MD5(file.contents);

      if (remoteHash === localHash) {
        var msg = util.format(MSG_UPLOAD_SUCCESS, dest, params.Bucket,
          dest, localHash);
        console.log(msg);
        cb();
      }
      else {
        console.log(MSG_ERR_CHECKSUM, 'Upload', localHash, remoteHash);
        cb();
      }
    });
  });
}

module.exports = deploy;
