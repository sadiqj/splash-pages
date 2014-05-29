/**
 * Dialog
 *
 * @version 0.9.1
 * @copyright Philip Harrison [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

(function() {
  'use strict';

  var VISIBLE = '_dialogVisible',
      ACTIVE = '_activeDialog',
      CONTENT_TAG = 'dialog-content',
      BACKDROP_CLASS = 'dialog-has-backdrop';

  var utils = {
    extend: function extend(target) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        source && Object.keys(source).forEach(function(prop) {
          Object.defineProperty(
            target, prop, Object.getOwnPropertyDescriptor(source, prop)
          );
        });
      });
      return target;
    },
    addClass: function addClass(el, name) {
      if (!el.className.match(name)) { el.className += ' ' + name; }
    },

    removeClass: function removeClass(el, name) {
      var match = new RegExp('(^|\\s+)' + name + '(\\s+|$)');
      if (match.test(el.className)) {
        el.className = el.className.replace(match, '');
      }
    }
  };

  var EventTarget = {
    /**
     * Emitter helper
     *
     * @private
     * @param {Object} object
     * @param {string|number} name
     * @returns {Array.<Function>}
     */
    _getListeners: function(name) {
      if (!this.__listeners) { this.__listeners = {}; }
      return this.__listeners[name] || (this.__listeners[name] = []);
    },

    /**
     * Asynchronously calls callback functions stored under the event name
     *
     * @param {string} name
     * @param {*} event
     */
    emit: function(name, event) {
      var _this = this;
      this._getListeners(name).forEach(function(listener) {
        listener.call(_this, event);
      }, this);
      return this;
    },

    /**
     * Stores callback functions under event name
     *
     * @param {string} name
     * @param {function()} listener Callback function to call on emit
     */
    on: function(name, listener) {
      var listeners = this._getListeners(name);
      if (listeners.indexOf(listener) === -1) { listeners.push(listener); }
      return this;
    },

    /**
     * Removes stored callback functions
     *
     * @param {string} event Name of event
     * @param {function()} listener Callback function to remove
     */
    off: function(event, listener) {
      if (!event) {
        delete this.__listeners;
      } else {
        var listeners = this._getListeners(event),
            index = listeners.indexOf(listener);
        if (index !== -1) { listeners.splice(index, 1); }
        if (!listener || !listeners.length) { delete this.__listeners[event]; }
      }
      return this;
    }
  };

  function getElement(html) {
    var el = document.createElement('div');
    el.innerHTML = html;
    return document.body.appendChild(el.firstElementChild);
  }

  /**
   * Dialog events triggered internally
   */
  var HIDE = '@@dialog-hide';
  var SHOW = '@@dialog-show';

  /**
   * Dialog default events
   * @enum {string}
   */
  var OPTIONS = {
    el: null,
    preventTrapFocus: false,
    preventHideOnClick: false,
    preventHideOnEscape: false,
    template: '<div class="dialog-center">' +
              '<div class="dialog-center__inner">' +
              '<' + CONTENT_TAG + ' class="dialog"' +
              '" role="dialog">' +
              '</' + CONTENT_TAG + '>' +
              '</div></div>'
  };

  function isValidOptions(options) {
    return options && options.el && !options.el.nodeType;
  }

  function error(message) {
    throw new Error(message);
  }

  /**
   * A Dialog
   *
   * @constructor
   * @param {Object} options
   */
  function Dialog(options) {
    if (!(this instanceof Dialog)) {
      return new Dialog(options);
    }

    // If provided, options.el must be Node
    if (isValidOptions(options)) {
      error('Dialog: el is not a Node');
    }

    // Extend default options with argument options
    this.options = utils.extend({}, OPTIONS, options);

    this._setElements(this);

    !this.options.preventTrapFocus && this._trapFocus();
    !this.options.preventHideOnClick && this._hideOnClick();
    !this.options.preventHideOnEscape && this._hideOnEscape();
  }

  utils.extend(Dialog.prototype, EventTarget, {
    /**
     * Sets open attribute on this.element
     *
     * Triggers SHOW
     */
    show: function show() {
      if (!this[VISIBLE]) {
        if (Dialog[ACTIVE]) { Dialog[ACTIVE].hide(); }
        Dialog[ACTIVE] = this;
        this.emit(SHOW, this);
        this._element.setAttribute('open', 'open');
        this._content.focus();
        this[VISIBLE] = true;
      }
      return this;
    },

    /**
     * Removes open attribute from this.element
     *
     * Triggers HIDE
     */
    hide: function hide() {
      if (this[VISIBLE]) {
        Dialog[ACTIVE] = null;
        this.emit(HIDE, this);
        this._element.removeAttribute('open');
        this[VISIBLE] = false;
      }
      return this;
    },

    /**
     * Appends node to content
     *
     * @param {Node} element
     */
    append: function append(element) {
      if (element && !element.nodeType) {
        error('Dialog: must be Node');
      }
      this._content.appendChild(element);
      return this;
    },

    /**
     * Hides dialog, removes internal event listeners,
     * and removes element from DOM
     */
    remove: function remove() {
      this.hide().off()._element.parentNode.removeChild(this._element);
      return this;
    },

    element: function element() {
      return this._element;
    },

    content: function content() {
      return this._content;
    },

    visible: function visible() {
      return !!this[VISIBLE];
    },

    /**
     * @private
     */
    _setElements: function _setElements() {
      // Create or set element (this.element)
      this._element = this.options.el || getElement(this.options.template);

      // Construct the content element
      this._content = this._element.getElementsByTagName(CONTENT_TAG)[0] ||
                      this._element;
      this._content.setAttribute('tabindex', -1);
      this._content.style.outline = 'none';
    },

    _buildEvent: function _buildEvent(el, ev, callback) {
      this.on(SHOW, function() {
        el.addEventListener(ev, callback, true);
      }).on(HIDE, function(){
        el.removeEventListener(ev, callback, true);
      });
    },

    /**
     * @private
     */
    _hideOnClick: function _hideOnClick() {
      var self = this;
      this._buildEvent(document, 'click', function(event){
        if (!self._content.contains(event.target)) {
          self.hide();
        }
      });
    },

    /**
     * @private
     */
    _trapFocus: function _trapFocus() {
      var self = this;
      function focusContent(event) {
        if (!self._content.contains(event.target)) {
          event.stopPropagation();
          self._content.focus();
        }
      }

      this._buildEvent(document, 'focus', focusContent);

      if (this.options.preventHideOnClick) {
        this._buildEvent(document, 'click', focusContent);
      }
    },

    /**
     * @private
     */
    _hideOnEscape: function _hideOnEscape() {
      var self = this;
      this._buildEvent(this._content, 'keyup', function(event){
        if (event.which === 27) {
          event.preventDefault();
          self.hide();
        }
      });
    },
  });

  this.Dialog = Dialog;
  this.Dialog.SHOW = SHOW;
  this.Dialog.HIDE = HIDE;
  this.Dialog.utils = utils;
  this.Dialog.EventTarget = EventTarget;
  this.Dialog.active = function active() {
    return this.Dialog[ACTIVE];
  };

  /**
   * Dialog.Backdrop
   *
   * @version 0.9.1
   * @copyright Philip Harrison [All Rights Reserved]
   * @license MIT License (see LICENSE.txt)
   */

  function DialogBackdrop(options) {
    // Guard against missing 'new' operator
    if (!(this instanceof DialogBackdrop)) {
      return new DialogBackdrop(options);
    }

    if (!options || !options.el || !options.el.nodeType) {
      error('DialogBackdrop: el is not a Node');
    }

    this._element = options.el;
  }

  this.Dialog.utils.extend(DialogBackdrop.prototype, {
    show: function show() {
      var self = this,
          scroll = this._getScroll();
      // Set scroll and top offset on page wrapper
      // Do this before setting the class
      // and while we still have page scroll
      if (scroll > 0 && scroll !== this.scrollPos) {
        this.scrollPos = scroll;
        this._element.style.top = '-' + scroll + 'px';
        setTimeout(function(){
          self._setScroll(0);
        }, 0);
      }

      utils.addClass(this._element, BACKDROP_CLASS);
      return this;
    },

    hide: function hide() {
      // Remove class
      // Do this before restoring scroll
      // so we get a back our page scroll
      utils.removeClass(this._element, BACKDROP_CLASS);

      // Restore scroll and top offset on page wrapper
      if (this.scrollPos) {
        this._element.style.top = '';
        this._setScroll(this.scrollPos);
        this.scrollPos = void 0;
      }
      return this;
    },

    _getScroll: function _getScroll() {
      return window.scrollY || window.pageYOffset || document.body.scrollTop;
    },

    _setScroll: function _setScroll(pos) {
      if (typeof pos !== 'number') {
        error('DialogBackdrop: pos is not a number');
      }
      window.scrollTo ? window.scrollTo(0, pos) : document.body.scrollTop = pos;
      return this;
    }
  });

  this.Dialog.Backdrop = DialogBackdrop;

}).call(this);
