#!/usr/bin/env node

'use strict';

var httpProxy = require('http-proxy');
var APIProxy = httpProxy.createProxyServer();

function shouldProxyPath(path) {
  path = path || '';
  return path.match(/^\/api\//) ||
    path.match(/^\/admin\//) ||
    path.match(/^\/web\//) ||
    path.match(/^\/merchants\//) ||
    path.match(/^\/users\//) ||
    path.match(/^\/assets\//) ||
    path.match(/^\/connect\//);
}

var connect = require('connect');
var app = connect()
  .use(function(req, res, next) {
    if (shouldProxyPath(req.url)) {
      return APIProxy.web(req, res, {
        target: 'http://gocardless.dev:3000'
      });
    }
    next();
  })
  .use(connect.static('build'));

require('http').createServer(app)
  .listen(9000)
  .on('listening', function () {
    console.log('Started web server on http://localhost:9000');
    require('opn')('http://localhost:9000');
  });
