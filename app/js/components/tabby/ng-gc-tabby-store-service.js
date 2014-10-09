'use strict';

var _ = require('lodash');
require('../../services/location-hash');

angular.module('ngGcTabbyStoreService', [
  'ngGcLocationHash'
]).factory('ngGcTabbyStore', [
  '$rootScope', '$window', '$timeout', 'locationHash',
  function ngGcTabbyStoreService($rootScope, $window, $timeout, locationHash) {

    var eventBus = $rootScope.$new();
    var allowedEvents = ['activate', 'add'];
    var tabStore = [];

    function sanitizeHref(href) {
      href = href || '';
      return href.replace(/^[#\/]+/, '');
    }

    function sanitizePath(path) {
      path = sanitizeHref(path);
      path = '/' + path;
      return path;
    }

    function getPageTabStore() {
      return tabStore;
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
      return _.find(getPageTabStore(), { '$href': sanitizeHref(data.$href) });
    }

    function activate(data, options) {
      options = options || {};
      validate(data);
      data.$href = sanitizeHref(data.$href);

      var tab = find(data);

      if (!tab) {
        return false;
      }

      if (!tab.preventLocationUpdate && !options.preventLocationUpdate) {
        locationHash.set(data.$href);
      }

      if (tab.$isActive) {
        return false;
      }

      getPageTabStore().filter(function(tab) {
        return tab.$isActive;
      }).forEach(function(tab) {
        tab.$isActive = false;
      });

      _.extend(tab, whitelist(data));
      tab.$isActive = true;
      eventBus.$emit('activate', whitelist(tab));

      return true;
    }

    function add(data) {
      validate(data);
      data.$href = sanitizeHref(data.$href);
      if (!find(data)) {
        getPageTabStore().push(data);
        if (locationHash.get() === data.$href) {
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
      var hash = locationHash.get();
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
        activate(getPageTabStore()[0], {
          preventLocationUpdate: true
        });
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
