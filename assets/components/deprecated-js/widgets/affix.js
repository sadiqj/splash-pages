'use strict';

var $ = require('jquery');
var _ = require('lodash');
var classExtends = require('../class-extends');
var BaseView = require('../base-view');

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

function animateEnter($el, name, animate) {
  $el.addClass('is-animating-enter ' + name)
    .removeClass('is-animating-leave is-animating-leave-active');
  if (animate) {
    window.setTimeout(function() {
      $el.addClass('is-animating-enter-active');
    }, 0);
  }
}

function animateLeave($el, name, animate) {
  function leaveAnimation() {
    $el.removeClass('is-animating-enter is-animating-enter-active ' + name);
  }

  if (!animate) {
    leaveAnimation();
  } else {
    $el.addClass('is-animating-leave');
    window.setTimeout(function() {
      $el.addClass('is-animating-leave-active');
      setTimeout(leaveAnimation, 200);
    }, 0);
  }
}

function Affix() {
  return Affix.__super__.constructor.apply(this, arguments);
}

classExtends(Affix, BaseView);

Affix.prototype.ready = function ready() {
  // Checking mobile user agent because testing window size is unreliable
  //
  // Zooming the page on a phone will change the viewport size messing up
  // any media queries
  if (!isMobile(navigator.userAgent)) {
    this.affix();
  }
};

Affix.prototype.affix = function affix() {
  var $el = this.$el;
  var height = $el.outerHeight(false);
  var $containerEl = $el.parent();

  // Prevent container from collapsing when child is fixed
  $containerEl.css({
    height: height
  });

  // There are a shit ton of edge cases when stuff is either not visible
  // but should be or scroll is incorrectly determied
  //
  // Being super defensive and testing loads of cases to be sure
  // the right thing happens
  var isVisible = false;
  function updatePosition() {
    var container = $containerEl[0];
    var isContainerVisible = isElementInViewport(container);
    var isContainerTopVisible = isElementInViewport(container, {
      bottomSide: false
    });
    var hasScrolledABit = window.scrollY > height;
    var innerHeight = window.innerHeight ||
      document.documentElement.clientHeight;
    var isScrollAtBottom = innerHeight >= window.document.body.scrollHeight;

    if (!isVisible && hasScrolledABit && !isScrollAtBottom &&
        !isContainerVisible) {
      animateEnter($el, 'is-affixed', true);
      isVisible = true;
    }

    if (isVisible && (isContainerVisible || isScrollAtBottom ||
        !hasScrolledABit)) {
      // Only animate when parent container is not going to become visible
      var canAnimate = !isContainerTopVisible && !isScrollAtBottom;
      animateLeave($el, 'is-affixed', canAnimate);
      isVisible = false;
    }
  }

  var throttled = _.throttle(updatePosition, 80, {
    trailing: true
  });
  $(window).on('scroll', throttled);
};

module.exports = Affix;
