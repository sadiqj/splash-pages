'use strict';

var angular = require('angular');
require('./ng-gc-ga-event-tracker-directive');

describe('ngGcGaEventTrackerDirective', function() {
  beforeEach(module('ngGcGaEventTrackerDirective'));

  var scope, elm, $rootScope, $compile, $window;

  function setup(options) {
    scope = $rootScope.$new();
    scope.options = options;
    elm = angular.element(
      '<form name="form" ng-gc-ga-event-tracker=options>' +
      '</form>'
    );
    $compile(elm)(scope);
    scope.$digest();
  }

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    $window = $injector.get('$window');
  }));

  it('checks options', function() {
    expect(function() {
      setup({
        event: 'click',
        category: 'forms',
        action: 'click-form',
        label: ''
      });
    }).toThrow('Invalid options: event, category, action, label');
  });

  it('binds click', function() {
    setup({
      event: 'click',
      category: 'forms',
      action: 'click-form',
      label: 'signup'
    });

    elm.trigger('click');

    expect($window._gaq[1]).toEqualData([
      '_trackEvent', 'forms', 'click-form', 'signup'
    ]);
  });
});
