'use strict';

var angular = require('angular');

angular.module('modalDirective', [])
  .directive('modal', [
    function modalDirective() {
      return {
        restrict: 'E',
        transclude: false,
        scope: true,
        link: function ($scope) {
          $scope.isShown = false;
          $scope.slide = 1;
        }
      };
    }
  ]);
