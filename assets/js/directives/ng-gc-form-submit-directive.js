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
        link: function link(scope, element, attrs) {
          var options = scope.$eval(attrs.ngGcSubmitForm);

          console.log(options);

          function onSubmit(event) {
            var formValues = serialiseForm(event.target);

            var oldTitle = $window.document.title;
            document.title = 'Saving form...';

            $.ajax({
              type: 'POST',
              url: event.target.action,
              data: formValues,
              contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
              dataType: 'html'
            }).done(function done(response) {
              console.log(response);
            }).fail(function fail(response) {
              console.log(response);
            }).always(function() {
              document.title = oldTitle;
            });

            event.preventDefault();
          }

          element.on('submit', onSubmit);
        }
      };

    }
  ]);
