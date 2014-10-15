'use strict';

var angular = require('angular');

angular.module('ngGcLocationHash', [
]).factory('locationHash', [
  '$window',
  function($window){
    function sanitizeHash(hash) {
      return hash.replace(/^[#\/]+/, '');
    }

    function get() {
      return sanitizeHash($window.location.hash);
    }

    function setHistoryState(hash) {
      if($window.history.replaceState) {
        $window.history.replaceState({}, '', hash);
      }
    }

    function set(hash) {
      if (get() === hash) {
        return;
      }
      hash = '#' + sanitizeHash(hash);
      setHistoryState(hash);
    }

    function clear() {
      setHistoryState($window.location.pathname);
    }

    return {
      set: set,
      get: get,
      clear: clear
    };
  }
]);
