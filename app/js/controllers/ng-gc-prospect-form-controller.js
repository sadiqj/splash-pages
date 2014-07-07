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
          $window.location.search = '?chat=1';
        }

      };

    }
  ]);
