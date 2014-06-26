'use strict';

angular.module('ngGcHidePopoverDirective', []).directive('ngGcHidePopover', [
  function ngGcHidePopoverDirective() {

    return {
      link: function link(scope, element, attrs) {

        $(document).on('click', function(e) {

          if (!$('.team-member').is(e.target) && $('.team-member').has(e.target).length === 0) {
            $('.is-active').animate({
              "opacity": 0,
              "top": 151
              }, 200, 'swing', function(){
                $(this).addClass('u-is-hidden').removeClass('is-active');
              });
            }
        });
      }
    };

  }
]);
