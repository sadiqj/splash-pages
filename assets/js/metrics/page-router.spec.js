'use strict';

require('./page-router');

describe('ngGcPageRouterService', function() {

  beforeEach(module('ngGcPageRouterService'));
  var ngGcPageRouter;

  function setup(page) {
    page = page || '/test.html';
    module(function($provide) {
      $provide.value('$window', {
        location: {
          pathname: page
        }
      });
    });

    inject(function(_ngGcPageRouter_) {
      ngGcPageRouter = _ngGcPageRouter_;
    });
  }

  describe('input', function() {
    beforeEach(setup);

    it('throws for no callback', function() {
      expect(function() {
        ngGcPageRouter('/first');
      }).toThrow('onMatchCallback must be a fn');
    });

    it('throws for no page', function() {
      expect(function() {
        ngGcPageRouter(200);
      }).toThrow('pathToMatch must be a string');
    });
  });

  describe('location', function() {
    beforeEach(function() {
      setup('/test');
    });

    it('/test', function() {
      var called;
      ngGcPageRouter('/test', function() {
        called = true;
      });

      expect(called).toBe(true);
    });
  });

  describe('location', function() {
    beforeEach(function() {
      setup('/');
    });

    it('/', function() {
      var called;
      ngGcPageRouter('/', function() {
        called = true;
      });

      expect(called).toBe(true);
    });
  });

  describe('stacked wildcard', function() {
    beforeEach(function() {
      setup('/direct-debit');
    });

    it('/direct-debit match', function() {
      var calledNever;
      var calledMatch;

      ngGcPageRouter('/direct-debit/sepa*', function() {
        calledNever = true;
      });

      ngGcPageRouter('/direct-debit*', function() {
        calledMatch = true;
      });

      expect(calledMatch).toBe(true);
      expect(calledNever).toBe(undefined);
    });
  });

  describe('reverse stacked wildcard', function() {
    beforeEach(function() {
      setup('/direct-debit/sepa');
    });

    it('/direct-debit/sepa match', function() {
      var calledMatch;
      var calledNever;

      ngGcPageRouter('/direct-debit/sepa*', function() {
        calledMatch = true;
      });

      ngGcPageRouter('/direct-debit*', function() {
        calledNever = true;
      });

      expect(calledMatch).toBe(true);
      expect(calledNever).toBe(undefined);
    });
  });

  describe('is called with sanitized location', function() {
    beforeEach(function() {
      setup('/direct-debit/sepa/');
    });

    it('/direct-debit/sepa match', function() {
      var calledMatch;
      ngGcPageRouter('/direct-debit/sepa', function(location) {
        calledMatch = location;
      });

      expect(calledMatch).toEqual('/direct-debit/sepa');
    });
  });

  describe('only call wildcard when path is not registered', function() {
    beforeEach(function() {
      setup('/direct-debit');
    });

    it('/direct-debit/sepa match', function() {
      var calledMatch;
      var calledNever;

      ngGcPageRouter('/direct-debit', function() {
        calledMatch = true;
      });

      ngGcPageRouter('/*', function() {
        calledNever = true;
      });

      expect(calledMatch).toBe(true);
      expect(calledNever).toBe(undefined);
    });
  });

  describe('wildcard called when path is not previously matched', function() {
    beforeEach(function() {
      setup('/direct-debit');
    });

    it('/*', function() {
      var calledMatch;
      var calledNever;

      ngGcPageRouter('/direct', function() {
        calledNever = true;
      });

      ngGcPageRouter('/*', function() {
        calledMatch = true;
      });

      expect(calledMatch).toBe(true);
      expect(calledNever).toBe(undefined);
    });
  });
});
