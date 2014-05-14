(function() {
  'use strict';

  var Widgets = window.GoCardless.module('widgets');
  var Base = window.GoCardless.module('base');

  Widgets.Views.ValueShow = (function() {
    function ValueShow() {
      return ValueShow.__super__.constructor.apply(this, arguments);
    }

    window.classExtends(ValueShow, Base.View);

    ValueShow.prototype.el = '[data-value]';

    ValueShow.prototype.ready = function() {
      this.$targets = $(this.$el.data('value'));
      this.$el.on('change', $.proxy(this.change, this));
      return this.change();
    };

    ValueShow.prototype.change = function() {
      var value;
      value = this.$el.val();
      return this.$targets.hide().each(function(index, target) {
        var $target, valueTarget;
        $target = $(target);
        valueTarget = $target.data('value-show');
        if (value === valueTarget) {
          return $target.show();
        }
      });
    };

    return ValueShow;

  })();

}).call(this);

