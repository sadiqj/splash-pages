'use strict';

angular.module('gc.popover', [])
.directive('popoverContainer', [
  '$window', '$timeout', '$rootScope',
  function popoverDirective($window, $timeout, $rootScope) {
    return {
      restrict: 'E',
      controller: [
        function() {
          this.isVisible = false;
        }
      ],
      scope: {},
      require: 'popoverContainer',
      link: function popoverLink(scope, element, attrs, ctrl) {
        function onClick(event) {
          if (!element[0].contains(event.target)) {
            $rootScope.$apply(function() {
              ctrl.isVisible = false;
            });
          }
        }

        function onElementKeyDown(event) {
          if (event.which === 27) {
            $rootScope.$apply(function() {
              ctrl.isVisible = false;
            });
          }
        }

        function onShow() {
          $window.document.addEventListener('click', onClick);
          element.on('keydown', onElementKeyDown);
        }

        function onHide() {
          $window.document.removeEventListener('click', onClick);
          element.off('keydown', onElementKeyDown);
        }

        // Watch the variable bound to show
        $rootScope.$watch(function() {
          return ctrl.isVisible;
        }, function popoverShowWatch(isVisible) {
          if (isVisible) {
            onShow();
          } else {
            onHide();
          }
        });

        // Cleanup dialog when the view gets torn down
        scope.$on('$destroy', function popoverDestroy(){
          onHide();
        });
      }
    };
  }
])
.directive('popoverToggle', [
  '$rootScope',
  function popoverDirective($rootScope) {
    return {
      restrict: 'A',
      require: '^popoverContainer',
      link: function link(scope, element, attrs, ctrl) {
        element.bind('click', function() {
          $rootScope.$apply(function() {
            ctrl.isVisible = !ctrl.isVisible;
          });
        });
      }
    };
  }
])
.directive('popoverContent', [
  '$timeout', '$rootScope',
  function popoverDirective($timeout, $rootScope) {
    return {
      restrict: 'E',
      template: '<div ng-transclude ng-show="isVisible" ' +
        'ng-class="{\'u-is-visible\': isVisible }"></div>',
      replace: true,
      transclude: true,
      scope: {},
      require: '^popoverContainer',
      link: function popoverLink(scope, element, attrs, ctrl) {
        element[0].setAttribute('tabindex', -1);
        element[0].style.outline = 'none';

        function onShow() {
          $timeout(function() {
            element[0].focus();
          });
        }

        $rootScope.$watch(function() {
          return ctrl.isVisible;
        }, function popoverShowWatch(isVisible) {
          scope.isVisible = isVisible;
          if (isVisible) {
            onShow();
          }
        });
      }
    };

  }
]);
