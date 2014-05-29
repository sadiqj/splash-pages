'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('ngGcFormSubmitDirective', [])
  .directive('ngGcFormSubmit', [
    '$window',
    function ngGcFormSubmitDirective($window) {
      /**
       * Serlialises all the fields in the specified form,
       * for posting in an AJAX request.
       *
       * @param {jQueryElement} $form Form element
       * @return {Object} Form values
       */
      function serialiseForm($form) {
        var values = {};
        var inputs = $form.find('input, select, textarea');

        _.each(inputs, function each(input) {
          // Ignore unselected checkboxes or radio buttons
          if (!((input.type === 'checkbox' || input.type === 'radio') &&
            !input.checked)) {
            values[input.name] = input.value;
          }
        });

        return values;
      }

      return {
        link: function link(scope, element, attrs) {
          var options = _.extend({
            form: {},
            data: {},
            onCreate: function onCreate() {}
          }, scope.$eval(attrs.ngGcFormSubmit));
          var defaultFormData = _.clone(options.data);

          function onSubmit(event) {
            var formValues = serialiseForm($(event.target));

            var oldTitle = $window.document.title;
            document.title = 'Saving...';
            options.form.$isSubmitting = true;

            $.ajax({
              type: 'POST',
              url: event.target.action,
              data: formValues,
              contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
              dataType: 'json'
            }).done(function done(response) {
              // Scroll to top showing notification
              window.scrollTo(0, 0);

              scope.$apply(function apply() {
                options.form.$isSuccess = true;
                options.form.$isError = false;

                // Clear state
                options.form.$setPristine();

                // Set initial state on form
                _.each(_.keys(options.data), function eachKey(key) {
                  if (key in defaultFormData) {
                    options.data[key] = defaultFormData[key];
                  } else {
                    options.data[key] = null;
                  }
                });

                options.onCreate(null, {
                  response: response,
                  prospect: formValues
                });
              });
            }).fail(function fail(response) {
              scope.$apply(function apply() {
                options.form.$isSuccess = false;
                var error = response.responseJSON &&
                  response.responseJSON.error || response.responseText;
                options.form.$isError = error;

                options.onCreate({
                  response: response.responseText
                });
              });
            }).always(function always() {
              document.title = oldTitle;
              scope.$apply(function apply() {
                options.form.$isSubmitting = false;
              });
            });

            event.preventDefault();
          }

          element.on('submit', onSubmit);
        }
      };

    }
  ]);
