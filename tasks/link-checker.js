#!/usr/bin/env node

var util = require('util');

var Crawler = require('simplecrawler');
var cheerio = require('cheerio');

if (process.argv.length < 3) {
  throw new Error('You must specify a url to check');
}

var site = process.argv[2];
var crawler = new Crawler(site);

crawler.initialPath = '/';
crawler.initialProtocol = 'https';
crawler.interval = 0;
crawler.maxConcurrency = 5;
crawler.listenerTTL = 10000;
crawler.timeout = 10000;
crawler.stripWWWDomain = true;
crawler.domainWhitelist = [site]
crawler.scanSubdomains = false;
crawler.maxResourceSize = (1024 * 1024) / 2; // 0.5mb
crawler.stripQuerystring = true; // optimizely is tagging all of the things...

// Requirements:
// - Fetch all linked resources on staging.gocardless.com
// - Do not crawl /blog, /direct-debit but still check that all links point there
//   from non /blog, /direct-debit work
// - Test response code on assets, do not download
// - Interesting approach to check files: https://github.com/SupplyFrame/node-link-checker

crawler.addFetchCondition(function(parsedURL) {
  return !parsedURL.uriPath.match(/\.(pdf|png|jpeg|jpg|js|css)$/gi) &&
    !parsedURL.uriPath.match(/^(\/blog\/|\/direct-debit\/)/gi);
});

var errors = [];

crawler
  .on('crawlstart',function(queueItem, responseBuffer, response) {
    var msg = util.format('Started crawling %s', site);
    console.log(msg);
  })
  .on('fetch404',function(queueItem) {
    var msg = util.format('✖ Not found linked from %s to %s', queueItem.referrer, queueItem.url);
    errors.push(msg);
    console.error(msg);
  })
  .on('fetchredirect', function(queueItem, parsedURL) {
    var msg = util.format('✖ Redirect from %s to %s://%s%s', queueItem.url, parsedURL.protocol, parsedURL.host, parsedURL.path);
    errors.push(msg);
    console.error(msg);
  })
  .on('fetcherror', function(queueItem) {
    var msg = util.format('✖ Error fetching from %s to %s', queueItem.referrer, queueItem.url);
    errors.push(msg);
    console.error(msg);
  })
  .on('fetchtimeout', function(queueItem) {
    var msg = util.format('✖ Timeout fetching from %s to %s', queueItem.referrer, queueItem.url);
    errors.push(msg);
    console.error(msg);
  })
  .on('fetchclienterror', function(queueItem) {
    var msg = util.format('✖ Client error fetching from %s to %s', queueItem.referrer, queueItem.url);
    errors.push(msg);
    console.error(msg);
  })
  .on('fetchcomplete',function(queueItem, responseBuffer, response) {
    var msg = util.format('✓ %s (%d bytes %s type)', queueItem.url, responseBuffer.length, response.headers['content-type']);
    console.log(msg);
  })
  .on('complete', function() {
    if (errors.length > 0) {
      console.error('\n✖ Failed checking links with %d errors', errors.length);
      errors.map(function(error) {
        console.error('✖ %s', error)
      });
      throw new Error('Failed checking links');
    } else {
      console.log('✓ Yay! No broken links for: %s', site);
    }
  });

crawler.start();
