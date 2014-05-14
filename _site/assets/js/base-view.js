(function() {
  'use strict';

  var Base = window.GoCardless.module('base');

  Base.View = (function() {
    function View(options) {
      this.options = options != null ? options : {};
      this.el = this.options.el || this.el;
      this.setElement();
      this.initialize(this.options);

      $((function(_this) {
        return function() {
          if (_this.el && typeof _this.ready === 'function') {
            return _this.ready(_this.options);
          }
        };
      })(this));
    }

    View.prototype.initialize = function() {};

    View.prototype.setElement = function() {
      this.$el = this.el instanceof (window.jQuery || window.Zepto) ?
        this.el : $(this.el);
      this.el = this.$el[0];
      return this;
    };

    View.prototype.$ = function(selector) {
      return this.$el.find(selector);
    };

    return View;

  })();

}).call(this);

