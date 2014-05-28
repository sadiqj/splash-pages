'use strict';

var $ = require('jquery');

function BaseView(options) {
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

BaseView.prototype.initialize = function() {};

BaseView.prototype.setElement = function() {
  this.$el = this.el instanceof $ ?
    this.el : $(this.el);
  this.el = this.$el[0];
  return this;
};

BaseView.prototype.$ = function(selector) {
  return this.$el.find(selector);
};

module.exports = BaseView;
