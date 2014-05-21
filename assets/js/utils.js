(function() {
  'use strict';

  function isElementInViewport(el, options) {
    options = _.defaults(options || {}, {
      bottomSide: true
    });
    var rect = el.getBoundingClientRect();
    var wHeight = window.innerHeight || document.documentElement.clientHeight;
    var wWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      (options.bottomSide ? rect.bottom : rect.top) <= wHeight &&
      rect.right <= wWidth
    );
  }

  function isMobile(ua) {
    var re = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;
    return re.test(ua);
  }

  var utils = window.GoCardless.module('utils');
  utils.isElementInViewport = isElementInViewport;
  utils.isMobile = isMobile;

}).call(this);
