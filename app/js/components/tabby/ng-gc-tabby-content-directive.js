'use strict';

var _ = require('lodash');
require('./ng-gc-tabby-store-service');

angular.module('ngGcTabbyContentDirective', [
  'ngGcTabbyStoreService'
]).directive('ngGcTabbyContent', [
  'ngGcTabbyStore',
  function ngGcTabbyContentDirective(ngGcTabbyStore) {

    return {
      restrict: 'A',
      priority: 100,
      transclude: 'element',
      link: function link(scope, element, attrs, ctrl, transclude) {
        var newScope = scope.$new();

        if (!attrs.id) {
          throw new Error('must have id attribute');
        }

        _.extend(newScope, {
          $href: attrs.id,
          preventLocationUpdate: 'preventLocationUpdate' in attrs,
          preventScrollIntoView: !('scrollIntoView' in attrs)
        });

        ngGcTabbyStore.add(newScope);

        var clone = transclude(newScope, function(clone) {
          element.replaceWith(clone);
        });

        if (newScope.preventScrollIntoView) {
          clone.removeAttr('id');
        }
      }
    };

  }
]);
