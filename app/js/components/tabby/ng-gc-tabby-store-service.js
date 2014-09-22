'use strict';

var _ = require('lodash');

angular.module('ngGcTabbyStoreService', [
]).factory('ngGcTabbyStore', [
  '$rootScope', '$window', '$timeout',
  function ngGcTabbyStoreService($rootScope, $window, $timeout) {

    var eventBus = $rootScope.$new();
    var allowedEvents = ['activate', 'add'];
    var tabStore = {};


    function sanitizePath(path) {
      path = (path || '').replace(/^\/|\/$/g, '');
      path = '/' + path;
      return path;
    }

    function getPageTabStore() {
      var locationPath = sanitizePath($window.location.pathname);
      if (!(locationPath in tabStore)) {
        tabStore[locationPath] = [];
      }
      return tabStore[locationPath];
    }

    function sanitizeHash(hash) {
      return hash.replace(/^#/, '');
    }

    function locationHash() {
      return sanitizeHash($window.location.hash);
    }

    function updateLocation(hash) {
      if (locationHash() === hash) {
        return;
      }
      hash = '#' + sanitizeHash(hash);
      if(window.history.pushState) {
        if (!locationHash()) {
          window.history.replaceState({}, '', hash);
        } else {
          window.history.pushState({}, '', hash);
        }
      }
    }

    function validate(data) {
      if (!data || !data.$href) {
        throw new Error('must have $href property');
      }
    }

    function whitelist(data) {
      return {
        $href: data && data.$href,
        $isActive: data && data.$isActive || false,
        $metadata: data && data.$metadata || null
      };
    }

    function find(data) {
      return _.find(getPageTabStore(), { '$href': data.$href });
    }

    function activate(data) {
      validate(data);

      var tab = find(data);

      if (!tab || tab.$isActive) {
        return false;
      }

      getPageTabStore().filter(function(tab) {
        return tab.$isActive;
      }).forEach(function(tab) {
        tab.$isActive = false;
      });

      _.extend(tab, whitelist(data));
      tab.$isActive = true;
      if (!tab.preventLocationUpdate) {
        updateLocation(data.$href);
      }
      eventBus.$emit('activate', whitelist(tab));

      return true;
    }

    function add(data) {
      validate(data);
      if (!find(data)) {
        getPageTabStore().push(data);
        if (locationHash() === data.$href) {
          activate(data);
        }
        eventBus.$emit('add', whitelist(data));
      }
      return whitelist(data);
    }

    function getActive() {
      return _.find(getPageTabStore(), { '$isActive': true });
    }

    function on(name, handler) {
      if (allowedEvents.indexOf(name) === -1) {
        throw new Error('unknown event name: ' + name);
      }
      eventBus.$on(name, handler);
    }

    $($window).on('hashchange', function() {
      var hash = locationHash();
      if (hash) {
        $rootScope.$apply(function() {
          activate({
            $href: hash
          });
        });
      }
    });

    // Activate the first tab if there is none active after dom is ready
    $timeout(function() {
      if (!getPageTabStore().some(function(tab) {
        return tab.$isActive;
      })) {
        activate(getPageTabStore()[0]);
      }
    });

    return {
      add: add,
      find: find,
      activate: activate,
      getActive: getActive,
      on: on
    };

  }
]);
