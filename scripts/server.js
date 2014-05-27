#!/usr/bin/env node

'use strict';

var open = require('opn');
var httpProxy = require('http-proxy');
var APIProxy = httpProxy.createProxyServer();

var connect = require('connect');
var app = connect()
  .use(function(req, res, next) {
    if (req.url.match(/^\/api\//) ||
        req.url.match(/^\/admin\//) ||
        req.url.match(/^\/web\//) ||
        req.url.match(/^\/merchants\//) ||
        req.url.match(/^\/users\//) ||
        req.url.match(/^\/assets\//) ||
        req.url.match(/^\/connect\//)) {
      APIProxy.web(req, res, {
        target: 'http://gocardless.dev:3000'
      });
    } else {
      return next();
    }
  })
  .use(connect.static('build'));

require('http').createServer(app)
  .listen(9000)
  .on('listening', function () {
    open('http://localhost:9000');
    console.log('Started connect web server on http://gocardless.dev:9000');
  });
