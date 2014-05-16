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
      function serialiseForm(form) {
        var values = {};
        var inputs = form.getElementsByTagName('input');

        _.each(_.toArray(inputs), function(input) {
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
            var formValues = serialiseForm(event.target);

            var oldTitle = $window.document.title;
            document.title = 'Saving...';
            scope.$isSubmitting = true;

            $.ajax({
              type: 'POST',
              url: event.target.action,
              data: formValues,
              contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
              dataType: 'json'
            }).done(function done(response) {
              scope.$apply(function() {
                scope.$isSuccess = true;
                scope.$isError = false;
              });
            }).fail(function fail(response) {
              scope.$apply(function() {
                scope.$isSuccess = false;
                scope.$isError = response.responseText;
              });
            }).always(function() {
              document.title = oldTitle;
              scope.$apply(function() {
                scope.$isSubmitting = false;
              });
            });

            event.preventDefault();
          }

          element.on('submit', onSubmit);
        }
      };

    }
  ]);
