'use strict';

require('../services/ng-gc-active-video-service');

angular.module('ngGcActiveVideoCtrl', [
  'ngGcActiveVideoService'
]).controller('NgGcActiveVideo', [
    '$scope', 'ngGcActiveVideo',
    function NgGcActiveVideo($scope, ngGcActiveVideo) {

      $scope.$watch(function() {
        return ngGcActiveVideo.getActiveVideo();
      }, function(activeVideo) {
        $scope.activeVideo = activeVideo;
      }, true);

    }
  ]);
