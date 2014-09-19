'use strict';

angular.module('ngGcStickyNavDirective', [])
  .directive('ngGcStickyNav', [
  function ngGcStickyNavDirective() {

    return {
      link : function link(scope, element) {
        var navOffset = element.offset().top;
        $(window).scroll(function(){
          var scrollPosition = $(window).scrollTop();

          if (scrollPosition >= navOffset) {
            element.addClass('is-sticky');
          } else {
            element.removeClass('is-sticky');
          }

        });
      }
    };
  }
]);
