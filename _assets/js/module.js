// module builder
// to create a module:
//   module = GoCardless.module("module")
//
// set some thangs:
//   module.stats = "alive"
//
// to retrieve the same module later:
//   module = GoCardless.module("module")
//   module.status // "alive"
//
// Setting a constructor module
//
// GoCardless.exports("module", Constructor)

// Both methods return existing or created object

(function(root) {
  'use strict';
  var modules = {};

  function module(name) {
    if (modules.hasOwnProperty(name)) {
      return modules[name];
    } else {
      return modules[name] = {
        Views: {}
      };
    }
  }

  function exports(name, Fn) {
    return modules[name] = Fn;
  }

  root.GoCardless.module = module;
  return root.GoCardless.exports = exports;

})(this);
