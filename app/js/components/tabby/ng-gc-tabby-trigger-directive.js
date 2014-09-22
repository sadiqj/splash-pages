'use strict';

var _ = require('lodash');
require('./ng-gc-tabby-store-service');

angular.module('ngGcTabbyTriggerDirective', [
  'ngGcTabbyStoreService'
]).directive('ngGcTabbyTrigger', [
  'ngGcTabbyStore', '$window', '$timeout',
  function ngGcTabbyTriggerDirective(ngGcTabbyStore) {

    return {
      restrict: 'A',
      priority: 100,
      transclude: 'element',
      link: function link(scope, element, attrs, ctrl, transclude) {
        var newScope = scope.$new();
        var options = scope.$eval(attrs.ngGcTabbyTrigger);
        options = _.extend({
          $href: attrs.href
        }, options);

        options.$href = options.$href.replace(/^#/, '');

        transclude(newScope, function(clone) {
          element.replaceWith(clone);
        });

        function activate($event, $metadata) {
          if ($event) {
            $event.preventDefault();
          }

          return ngGcTabbyStore.activate(_.extend(options, $metadata));
        }

        ngGcTabbyStore.on('activate', function() {
          var current = ngGcTabbyStore.find(options);
          _.extend(newScope, {
            $isActive: !!(current && current.$isActive)
          });
        });

        _.extend(newScope, {
          $activate: activate
        });
      }
    };

  }
]);
