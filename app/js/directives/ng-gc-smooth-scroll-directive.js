'use strict';

angular.module('ngGcSmoothScrollDirective', []).directive('ngGcSmoothScroll', [
  function ngGcSmoothScrollDirective() {

    return {
      link: function link(scope, element, attrs) {
        element.on('click', function(e) {
          var href = attrs.href;
          e.preventDefault();
          $('html, body').animate({
              scrollTop: $(href).offset().top
          }, 500);
          return false;
        });
      }
    };

  }
]);
