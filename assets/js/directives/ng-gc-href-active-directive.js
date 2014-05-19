'use strict';

angular.module('ngGcHrefActiveDirective', [])
  .directive('ngGcHrefActive', [
    '$window',
    function ngGcHrefActiveDirective($window) {
      return {
        link: function link(scope, element) {

          function sanitize(path) {
            path = (path || '').replace(/^\/|\/$/g, '');
            path = '/' + path;
            return path;
          }

          var href = element[0].pathname;
          var hrefPath = sanitize(href);
          var locationPath = sanitize($window.location.pathname);
          if (href && hrefPath === locationPath) {
            console.log(hrefPath, locationPath);
            element.addClass('is-active');
          }

        }
      };

    }
  ]);
