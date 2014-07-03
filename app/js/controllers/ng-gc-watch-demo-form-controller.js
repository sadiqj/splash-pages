'use strict';

angular.module('ngGcWatchDemoFormCtrl', [])
  .controller('NgGcWatchDemoForm', [
    '$scope', '$window',
    function NgGcWatchDemoForm($scope, $window) {

      $scope.onWatchDemoProspectCreate = function onWatchDemoProspectCreate(
        err, data
      ) {
        if (err) {
          return;
        }

        $window.localStorage.setItem('prospect',
          JSON.stringify(data.prospect));

        var search = '';
        if (data.response && data.response.chat === true) {
          search = '?chat=1';
        }

        $('#modal-backdrop').css('display', 'none');
      };

    }
  ]);
