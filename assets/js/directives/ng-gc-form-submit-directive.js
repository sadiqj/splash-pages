'use strict';

angular.module('ngGcFormSubmitDirective', [])
  .directive('ngGcFormSubmit', [
    '$window',
    function ngGcFormSubmitDirective($window) {
      /**
       * Serlialises all the fields in the specified form,
       * for posting in an AJAX request.
       *
       * @param {FormElement} form
       * @return {Object} Form data
       */
      function serialiseForm($form) {
        var values = {};
        var inputs = $form.find('input, select, textarea');

        _.each(inputs, function(input) {
          // Ignore unselected checkboxes or radio buttons
          if (!((input.type === 'checkbox' || input.type === 'radio') &&
            !input.checked)) {
            values[input.name] = input.value;
          }
        });

        return values;
      }

      return {
        link: function link(scope, element) {
          scope.prospectForm = {
            size: '0-100'
          };

          function onSubmit(event) {
            var formValues = serialiseForm($(event.target));

            var oldTitle = $window.document.title;
            document.title = 'Saving...';
            scope.prospectForm.$isSubmitting = true;

            $.ajax({
              type: 'POST',
              url: event.target.action,
              data: formValues,
              contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
              dataType: 'json'
            }).done(function done(response) {
              // XXX HACK
              // MOVE TO CALLBACK
              if (response && response.chat === true) {
                $window.location.search = '?chat=1';
              }
              // XXX HACK

              // Scroll to top showing notification
              window.scrollTo(0, 0);

              scope.$apply(function() {
                scope.prospectForm.$isSuccess = true;
                scope.prospectForm.$isError = false;
              });
            }).fail(function fail(response) {
              scope.$apply(function() {
                scope.prospectForm.$isSuccess = false;
                scope.prospectForm.$isError = response.responseText;
              });
            }).always(function() {
              document.title = oldTitle;
              scope.$apply(function() {
                scope.prospectForm.$isSubmitting = false;
              });
            });

            event.preventDefault();
          }

          element.on('submit', onSubmit);
        }
      };

    }
  ]);
