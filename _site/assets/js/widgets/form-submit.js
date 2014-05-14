(function() {
  'use strict';

  var Widgets = window.GoCardless.module('widgets');
  var Base = window.GoCardless.module('base');

  Widgets.Views.FormSubmit = (function() {
    function FormSubmit() {
      return FormSubmit.__super__.constructor.apply(this, arguments);
    }

    window.classExtends(FormSubmit, Base.View);

    FormSubmit.prototype.ready = function() {
      var $error, $success;
      $error = $(this.options.errorEl);
      $success = $(this.options.successEl);
      return this.$el.on('ajax:success', function() {
        $(this).hide();
        $error.hide();
        return $success.show();
      }).on('ajax:error', function(xhr, status) {
        return $error.show().text('Error - ' + status.responseText);
      });
    };

    return FormSubmit;

  })();

}).call(this);

