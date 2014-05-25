#!/usr/bin/env node

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

var errors = 0;

crawler
  .on('crawlstart',function(queueItem, responseBuffer, response) {
    console.log('Started crawling %s', site);
  })
  .on('fetch404',function(queueItem) {
    errors += 1;
    console.error('✖ Not found linked from %s to %s', queueItem.referrer, queueItem.url);
  })
  .on('fetchredirect', function(queueItem, parsedURL) {
    errors += 1;
    console.error('↗ Redirect from %s to %s://%s%s', queueItem.url, parsedURL.protocol, parsedURL.host, parsedURL.path);
  })
  .on('fetcherror', function(queueItem) {
    errors += 1;
    console.error('✖ Error fetching from %s to %s', queueItem.referrer, queueItem.url);
  })
  .on('fetchtimeout', function(queueItem) {
    errors += 1;
    console.error('✖ Timeout fetching from %s to %s', queueItem.referrer, queueItem.url);
  })
  .on('fetchclienterror', function(queueItem) {
    console.error('✖ Client error fetching from %s to %s', queueItem.referrer, queueItem.url);
    errors += 1;
  })
  .on('fetchcomplete',function(queueItem, responseBuffer, response) {
    console.log('✓ %s (%d bytes %s type)', queueItem.url, responseBuffer.length, response.headers['content-type']);
  })
  .on('complete', function() {
    if (errors > 0) {
      throw new Error('✖ %s errors', errors);
    } else {
      console.log('✓ Yay! No broken links for: %s', site);
    }
  });

crawler.start();
