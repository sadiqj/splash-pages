'use strict';

var BaseView = require('../base-view');

function StickyTabs(options) {
  BaseView.call(this, options);

  this.$tabs = $('.nav-tabs a');
  this.setupTabs();
}

StickyTabs.prototype = Object.create(BaseView.prototype);
StickyTabs.prototype.constructor = StickyTabs;

StickyTabs.prototype.setupTabs = function() {
  var hash = window.location.hash;
  hash && $('.nav [href="' + hash + '"]').tab('show');

  $(this.$tabs).click(function () {
    $(this).tab('show');
    if(window.history.pushState) {
      window.history.pushState({}, '', this.hash);
    } else {
      var scrollV = document.body.scrollTop;
      var scrollH = document.body.scrollLeft;
      window.location.hash = this.hash;
      document.body.scrollTop = scrollV;
      document.body.scrollLeft = scrollH;
    }
  });

  this.bindToHistory();
};

StickyTabs.prototype.bindToHistory = function() {
  var $tabs = this.$tabs;

  $(window).on('hashchange', function() {
    var hash = window.location.hash;
    // get the menu element
    var menuItem = $tabs.filter('[href="' + hash + '"]');
    // call bootstrap to show the tab
    menuItem.tab('show');
  }).trigger('hashchange');
};

module.exports = StickyTabs;
