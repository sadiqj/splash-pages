(function() {
  'use strict';

  function isSupportedBrowser() {
    var hasJSON = 'JSON' in window && 'parse' in JSON;
    var supportMode = location.search.match(/supportMode/);
    return hasJSON && !supportMode;
  }

  this.isSupportedBrowser = isSupportedBrowser;

}).call(this);
