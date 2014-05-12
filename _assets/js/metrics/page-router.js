'use strict';

angular.module('ngGcPageRouterService', [])
  .factory('ngGcPageRouter', [
    '$window',
    function ngGcPageRouterService($window) {

      var pages = (function() {
        var storedPages = {};

        return {
          all: function all() {
            return storedPages;
          },
          add: function add(page) {
            storedPages[page] = true;
          },
          contains: function contains(page) {
            return page in storedPages;
          }
        };
      }());

      function sanitize(path) {
        var sanitizePathName = {
          '': '/'
        };

        if (path in sanitizePathName) {
          path = sanitizePathName[path];
        }

        // remove trailing slash
        path = path.replace(/([^])(\/$)/, function(all, untilSlash, slash) {
          return slash ? untilSlash : all;
        });

        return path;
      }

      function getWildcardPattern(path) {
        return new RegExp('^' +
          path.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
        );
      }

      function sanitizeWildcard(pathToMatch) {
        var wildcardPattern = new RegExp('\\*$');
        if (!pathToMatch.match(wildcardPattern)) { return; }
        return pathToMatch.replace(wildcardPattern, '');
      }

      function getParentWildcard(pathToMatch) {
        var wildcardPattern = getWildcardPattern(pathToMatch);
        var parentWildcard = '';
        _.chain(pages.all())
          .keys()
          .some(function(page) {
            page = sanitizeWildcard(page);
            if (!page) { return; }
            if (page.length > pathToMatch.length &&
                page.match(wildcardPattern)) {
              parentWildcard = page;
              return true;
            }
          });
        return parentWildcard;
      }

      function matchWildcard(pathToMatch, currentPath) {
        pathToMatch = sanitizeWildcard(pathToMatch);
        if (!pathToMatch || pages.contains(currentPath)) { return; }

        var parentWildcard = getParentWildcard(pathToMatch);
        var canMatch = !parentWildcard ||
          !currentPath.match(getWildcardPattern(parentWildcard));

        return canMatch && currentPath.match(getWildcardPattern(pathToMatch));
      }

      function pageRouter(pathToMatch, onMatchCallback) {
        if (typeof pathToMatch !== 'string') {
          throw new Error('pathToMatch must be a string');
        }
        if (typeof onMatchCallback !== 'function') {
          throw new Error('onMatchCallback must be a fn');
        }

        // store path
        pages.add(pathToMatch);

        var currentPath = sanitize($window.location.pathname);

        if (matchWildcard(pathToMatch, currentPath) ||
          currentPath === pathToMatch) {
          return onMatchCallback(currentPath);
        }
      }

      pageRouter.sanitize = sanitize;

      return pageRouter;

    }
  ]);
