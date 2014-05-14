(function() {
  'use strict';

  var Widgets = window.GoCardless.module('widgets');
  var Base = window.GoCardless.module('base');

  Widgets.Views.StickyTabs = (function() {
    function StickyTabs() {
      return this.ready();
    }

    window.classExtends(StickyTabs, Base.View);

    StickyTabs.prototype.ready = function() {
      this.$tabs = $('.nav-tabs a');
      return this.setupTabs();
    };

    StickyTabs.prototype.setupTabs = function() {
      var hash = window.location.hash;
      hash && $('ul.nav a[href="' + hash + '"]').tab('show');

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
        var menuItem = $tabs.filter('[href=' + hash + ']');
        // call bootstrap to show the tab
        menuItem.tab('show');
      }).trigger('hashchange');
    };

    return StickyTabs;

  })();

}).call(this);

