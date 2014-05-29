(function(global) {
  'use strict';

  var redefine = global._.redefine;

  /**
   *  var Customer = ObjectFactory.create({
   *    AUTHORIZED_STATUS: 'authorised',
   *    meta: {
   *      alive: true
   *    },
   *    isAuthorized: function isAuthorized() {
   *      return this.status === this.AUTHORIZED_STATUS;
   *    }
   *  });
   *
   *  var customer = Customer.create({
   *    name: 'Frank',
   *    status: 'authorised'
   *  });
   *
   *  function assert(assertion, message) {
   *    function error(message) { throw 'AssertionError: ' + message; }
   *    !assertion && error(message);
   *  }
   *
   */

  /**
   * @type {Object}
   */
  var strictDescriptors = redefine.as({
    enumerable: false,
    configurable: false,
    writable: false
  });

  /**
   * @type {Object}
   */
  var enumDescriptors = redefine.as({
    enumerable: true,
    configurable: true,
    writable: true
  });

  var placeholder = redefine.from(null);

  /**
   * @type {Object}
   */
  var ObjectFactoryMethods = redefine.mixin({
    /**
     * Returns object factory that inherits from ObjectFactory
     * The create method is overwritten on the returned factory
     * @param  {Object} object
     * @param  {Object} descriptors
     * @return {Object}
     */
    create: function create(attrs, descriptors) {
      return redefine.from(this,
        (attrs || placeholder),
        (descriptors || enumDescriptors)
      );
    }
  }, global.eddy);

  /**
   * Object with `create`, `on`, `once`, `off`, `trigger`, `boundTo`, `emit`
   * methods
   * @type {Object}
   */
  var ObjectFactory = redefine.from(null,
    ObjectFactoryMethods,
    strictDescriptors
  );

  global.ObjectFactory = ObjectFactory;

})(this);
