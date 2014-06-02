'use strict';

var BaseView = require('../base-view');
var Modal = require('../modal/modal');
require('../modal/position');

function Modals(options) {
  this.setModalHTML = this.setModalHTML.bind(this);
  this.setModal = this.setModal.bind(this);
  this.getModal = this.getModal.bind(this);
  BaseView.call(this, options);
}

Modals.prototype = Object.create(BaseView.prototype);
Modals.prototype.constructor = Modals;

Modals.prototype.el = '[data-modal]';

Modals.prototype.ready = function() {
  return this.$el.on('click', $.proxy(this.onClick, this));
};

Modals.prototype.onClick = function(e) {
  e.preventDefault();
  return this.showModal();
};

Modals.prototype.getModals = function() {
  return this._modals || (this._modals = {});
};

Modals.prototype.getTarget = function() {
  var _ref;
  return this._target ||
    (this._target = (_ref = this.$el.data()) != null ?
      _ref.target : void 0);
};

Modals.prototype.getModal = function() {
  return this.getModals()[this.getTarget()];
};

Modals.prototype.setModal = function() {
  var instance = this.setModalHTML();
  if (typeof this.onCreate === 'function') {
    this.onCreate(instance);
  }
  this.setModalClass(instance.$el);
  this.getModals()[this.getTarget()] = instance;
  return instance;
};

Modals.prototype.getModalTriggerEl = function(modalTarget) {
  return this.$el.filter('[data-target=' + modalTarget + ']');
};

Modals.prototype.setModalClass = function($el) {
  var classNames = this.getModalTriggerEl(this.getTarget())
    .data('modal-class');
  if (classNames) {
    return $el.addClass(classNames);
  }
};

Modals.prototype.setModalHTML = function() {
  var instance = Modal.create();
  return instance.set($(this.getTarget()).show());
};

Modals.prototype.showModal = function() {
  var modal = this.getModal() || this.setModal();
  if (modal && typeof modal.show === 'function') {
    return modal.show();
  }
};

module.exports = Modals;
