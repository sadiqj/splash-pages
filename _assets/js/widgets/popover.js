(function() {
  'use strict';

  var Widgets = window.GoCardless.module('widgets');
  var Base = window.GoCardless.module('base');

  Widgets.Views.PopOver = (function() {
    function PopOver() {
      return PopOver.__super__.constructor.apply(this, arguments);
    }

    window.classExtends(PopOver, Base.View);

    PopOver.prototype.el = '[data-popover]';

    PopOver.prototype.ready = function() {
      this.$el.popover({
        placement: 'bottom',
        html: true,
        animation: false
      });
      return this.$el.on('click', (function(_this) {
        return function(e) {
          return _this.$el.not($(e.currentTarget)).popover('hide');
        };
      })(this));
    };

    return PopOver;

  })();

}).call(this);

