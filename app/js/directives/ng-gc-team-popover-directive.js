'use strict';

angular.module('ngGcTeamPopoverDirective', []).directive('ngGcTeamPopover', [
  function ngGcTeamPopoverDirective() {

    return {
      link: function link(scope, element, attrs) {

        var $popover = $(".team-member__popover", element);

        element.on('click', function(e){

          // Ignore if you've clicked on a link inside a team member's bio.
          if (!$(e.target).is('.team-member__link')) {

            $('.is-active').animate({
              "opacity": 0,
              "top": 151
              }, 200, 'swing', function(){
                $(this).addClass('u-is-hidden').removeClass('is-active');
            });

            // If not active, show - otherwise, hide.
            if ($popover.hasClass('is-active')) {
              $popover.animate({
                "opacity": 0,
                "top": 151
                }, 200, 'swing', function(){
                  $(this).addClass('u-is-hidden').removeClass('is-active');
                });
            } else if (!$popover.hasClass('is-active')) {

              $popover.removeClass('u-is-hidden').animate({
              "opacity": 1,
              "top": 121
              }, 200, 'swing', function(){
                $(this).addClass('is-active');
              });

            }
          }

        });

        $(".team-member__link", element).on('click')

      }
    };

  }
]);
