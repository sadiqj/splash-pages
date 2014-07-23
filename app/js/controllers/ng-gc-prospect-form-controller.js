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
          $window.olark('api.box.expand');

          var prospect = data.prospect;
          $scope.bootstrapOlark(prospect);
        }
      };

      $scope.bootstrapOlark = function bootstrapOlark(prospect) {
        if (prospect && prospect['prospect[name]']) {
            $window.olark('api.visitor.updateFullName', {
              fullName: prospect['prospect[name]']
            });
          }
        if (prospect && prospect['prospect[email]']) {
          $window.olark('api.visitor.updateEmailAddress', {
            emailAddress: prospect['prospect[email]']
          });
        }
        if (prospect && prospect['prospect[phone]']) {
          $window.olark('api.visitor.updatePhoneNumber', {
            phoneNumber: prospect['prospect[phone]']
          });
        }
        if (prospect && prospect['prospect[size]']) {
          $window.olark('api.visitor.updateCustomFields', {
            size: prospect['prospect[size]']
          });
        }
      };

    }
  ]);
