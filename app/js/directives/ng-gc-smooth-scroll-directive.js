'use strict';

angular.module('ngGcSmoothScrollDirective', []).directive('ngGcSmoothScroll', [
  function ngGcSmoothScrollDirective() {

    return {
      link: function link(scope, element, attrs) {
        element.on('click', function(e) {
          e.preventDefault();

          var href = attrs.href;
          var offset = 0;
          if (href) {
            offset = $(href).offset().top;
          }

          $('body').animate({
            scrollTop: offset
          }, 500);
        });
      }
    };

  }
]);
