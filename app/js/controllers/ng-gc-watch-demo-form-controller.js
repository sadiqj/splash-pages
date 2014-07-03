'use strict';

angular.module('ngGcWatchDemoFormCtrl', [])
  .controller('NgGcWatchDemoForm', [
    '$scope', '$window',
    function NgGcWatchDemoForm($scope, $window) {

      function hideModal() {
        $('[data-watch-demo-modal]').css('display', 'none');
      }

      if ($window.localStorage.getItem('prospect') != null) {
        hideModal();
      }

      $scope.onWatchDemoProspectCreate = function onWatchDemoProspectCreate(err, data) {
        if (err) {
          return;
        }

        $window.localStorage.setItem('prospect', JSON.stringify(data.prospect));

        hideModal();
      };

    }
  ]);
