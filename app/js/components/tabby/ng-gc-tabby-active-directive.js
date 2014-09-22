'use strict';

var _ = require('lodash');
require('./ng-gc-tabby-store-service');

angular.module('ngGcTabbyActiveDirective', [
  'ngGcTabbyStoreService'
]).directive('ngGcTabbyActive', [
  'ngGcTabbyStore',
  function ngGcTabbyActiveDirective(ngGcTabbyStore) {

    return {
      restrict: 'A',
      priority: 100,
      transclude: 'element',
      link: function link(scope, element, attrs, ctrl, transclude) {
        var newScope = scope.$new();

        ngGcTabbyStore.on('activate', function(event, active) {
          _.extend(newScope, active);
        });

        transclude(newScope, function(clone) {
          element.replaceWith(clone);
        });
      }
    };

  }
]);
