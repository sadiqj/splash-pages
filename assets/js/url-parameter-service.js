'use strict';

angular.module('ngGcURLParameterService', [
]).factory('ngGcURLParameter', [
  function ngGcURLParameter() {

    function isDefined(value){
      return typeof value !== 'undefined';
    }

    function tryDecodeURIComponent(value) {
      try {
        return decodeURIComponent(value);
      } catch(e) {
        // Ignore any invalid uri component
      }
    }

    function parseKeyValue(keyValue) {
      var obj = {}, key_value, key;
      _.forEach((keyValue || "").split('&'), function(keyValue){
        if (keyValue) {
          key_value = keyValue.split('=');
          key = tryDecodeURIComponent(key_value[0]);
          if (isDefined(key)) {
            var val = isDefined(key_value[1]) ?
              tryDecodeURIComponent(key_value[1]) : true;
            if (!obj[key]) {
              obj[key] = val;
            } else if(_.isArray(obj[key])) {
              obj[key].push(val);
            } else {
              obj[key] = [obj[key],val];
            }
          }
        }
      });
      return obj;
    }

    function search() {
      return window.location.search.replace(/^\?/, '');
    }

    return {
      get: function get(name) {
        return parseKeyValue(search())[name];
      }
    };

  }
]);
