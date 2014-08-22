'use strict';

require('../services/ng-gc-active-tab-service');

angular.module('ngGcActiveTabCtrl', [
  'ngGcActiveTabService'
]).controller('NgGcActiveTab', [
    '$scope', 'ngGcActiveTab',
    function NgGcActiveTab($scope, ngGcActiveTab) {

      $scope.$watch(function() {
        return ngGcActiveTab.getActiveTab();
      }, function(activeTab) {
        $scope.activeTab = activeTab;
      }, true);

    }
  ]);
