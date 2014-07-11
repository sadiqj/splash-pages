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

        // This forces a page reload which breaks the success/error message on
        // the form. The solution is to bootstrap olark in place rather than
        // reloading, but in the mean time let's just disable it.
        // if (data.response && data.response.chat) {
        //   $window.location.search = '?chat=1';
        // }

      };

    }
  ]);
