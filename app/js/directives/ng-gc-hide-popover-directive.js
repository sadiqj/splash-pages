'use strict';

require('./ng-gc-team-popover-directive');

angular.module('ngGcHidePopoverDirective', [
  'ngGcTeamPopoverDirective'
  ]).directive('ngGcHidePopover', [
  function ngGcHidePopoverDirective() {

    return {
      link: function link(scope, element, attrs) {
        $(document).on('click', function(e) {
          if ($('.team-member').has(e.target).length === 0) {
            $('.is-active').popoverDisplay("hide");
            }
        });
      }
    };

  }
]);
