'use strict';

var _ = require('lodash');

angular.module('ngGcURLParameterService', [
]).factory('ngGcURLParameter', [
  function ngGcURLParameter() {
    function tryDecodeURIComponent(value) {
      try {
        return decodeURIComponent(value);
      } catch(e) {
        // Ignore any invalid uri component
      }
    }

    function parseValueTupleToObj(obj, keyValueTuple) {
      var value = keyValueTuple[1];
      var key = tryDecodeURIComponent(keyValueTuple[0]);

      if (!_.isUndefined(key)) {
        var val = !_.isUndefined(value) ? tryDecodeURIComponent(value) : true;
        if (!obj[key]) {
          obj[key] = val;
        } else if(_.isArray(obj[key])) {
          obj[key].push(val);
        } else {
          obj[key] = [obj[key], val];
        }
      }
    }

    function parseParamKeyValue(paramKV) {
      var obj = {};
      _.forEach((paramKV || '').split('&'), function forEach(paramKV){
        if (paramKV) {
          var keyValueTuple = paramKV.split('=');
          parseValueTupleToObj(obj, keyValueTuple);
        }
      });
      return obj;
    }

    function search() {
      return window.location.search.replace(/^\?/, '');
    }

    return {
      get: function get(name) {
        return parseParamKeyValue(search())[name];
      }
    };

  }
]);
