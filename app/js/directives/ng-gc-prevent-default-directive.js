'use strict';

angular.module('ngGcPreventDefaultDirective', []).directive('ngGcPreventDefault', [
  function ngGcPreventDefaultDirective() {

    return {
      link: function link(scope, element) {
        element.on('click', function (e) {
          e.preventDefault();
        });
      }
    };

  }
]);
