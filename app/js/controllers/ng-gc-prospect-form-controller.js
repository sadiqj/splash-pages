'use strict';

angular.module('ngGcProspectFormCtrl', [])
  .controller('NgGcProspectForm', [
    '$scope', '$window',
    function NgGcProspectForm($scope, $window) {

      $scope.onProspectCreate = function onProspectCreate(err, data) {
        if (err) {
          return;
        }

        $window.localStorage.setItem('prospect',
          JSON.stringify(data.prospect));

        if (data.response && data.response.chat) {
          olark('api.box.expand');

          var prospect;
          try {
            var prospect = data.prospect;
          } catch (e) {}

          if (prospect && prospect['prospect[name]']) {
            olark('api.visitor.updateFullName', {
              fullName: prospect['prospect[name]']
            });
          }
          if (prospect && prospect['prospect[email]']) {
            olark('api.visitor.updateEmailAddress', {
              emailAddress: prospect['prospect[email]']
            });
          }
          if (prospect && prospect['prospect[phone]']) {
            olark('api.visitor.updatePhoneNumber', {
              phoneNumber: prospect['prospect[phone]']
            });
          }
          if (prospect && prospect['prospect[size]']) {
            olark('api.visitor.updateCustomFields', {
              size: prospect['prospect[size]']
            });
          }
        }
      };

    }
  ]);
