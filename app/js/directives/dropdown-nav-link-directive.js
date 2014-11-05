'use strict';

angular.module('dropdownNavLinkDirective', []).directive('dropdownNavLink', [
  function dropdownNavLinkDirective() {

    return {
      link: function link(scope, element, attrs) {
        element.on('click', function(e) {
          console.log('Clicked');
          return false;
        });
      }
    };

  }
]);
