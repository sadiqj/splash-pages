'use strict';

var angular = require('angular');

require('angular-mocks');
require('./ng-gc-ga-event-tracker-directive');

describe('ngGcGaEventTrackerDirective', function() {
  beforeEach(angular.mock.module('ngGcGaEventTrackerDirective'));

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

  beforeEach(angular.mock.inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    $window = $injector.get('$window');
  }));

  it('checks options', function() {
    expect(function() {
      setup({
        event: 'click',
        label: ''
      });
    }).toThrow('Invalid options: event, label');
  });

  it('binds click', function() {
    setup({
      event: 'click',
      label: 'signup'
    });

    elm.trigger('click');

    expect($window.dataLayer[1]).toEqualData([
      '_trackEvent', 'forms', 'click-form', 'signup'
    ]);
  });
});
