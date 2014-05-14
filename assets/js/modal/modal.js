/*global modal:false console:false define:true module:true */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function(name, context, definition) {
  if (typeof module !== "undefined") {
    return module.exports = definition(name, context);
  } else if (typeof define === "function" && typeof define.amd === "object") {
    return define(definition);
  } else {
    return context[name] = definition(name, context);
  }
})("modal", this, function(name, context) {
  "use strict";
  var Events, Modal, activeModal, api, config, doc, dom, getUniqueId, idCounter, onDocClick, preventModalClose, triggerClose;
  idCounter = 0;
  getUniqueId = function(prefix) {
    idCounter++;
    if (prefix) {
      return prefix + idCounter;
    } else {
      return idCounter;
    }
  };
  activeModal = false;
  doc = context.document;
  preventModalClose = false;
  api = {};
  config = {
    modalClass: "modal",
    contentClass: "content",
    closeClass: "close",
    modalContainerId: "modal-container",
    modalBackdropId: "modal-backdrop"
  };
  dom = {
    el: function(options) {
      var elem;
      elem = doc.createElement("div");
      if (options.className) {
        elem.className = options.className;
      }
      if (options.id) {
        elem.id = options.id;
      }
      return elem;
    },
    modal: function() {
      var close, content, elem;
      elem = this.el({
        className: config.modalClass
      });
      elem.setAttribute("tabindex", 0);
      close = this.el({
        tag: "i",
        className: config.closeClass
      });
      content = this.el({
        className: config.contentClass
      });
      elem.appendChild(close);
      elem.appendChild(content);
      return elem;
    },
    containerEl: null,
    backdropEl: null,
    getContainer: function() {
      if (this.containerEl) {
        return this.containerEl;
      }
      this.containerEl = dom.el({
        id: config.modalContainerId
      });
      this.backdropEl = dom.el({
        id: config.modalBackdropId
      });
      this.containerEl.appendChild(this.backdropEl);
      return doc.body.appendChild(this.containerEl);
    },
    attach: function() {
      var elem;
      elem = this.modal();
      return this.getContainer().appendChild(elem);
    }
  };
  Events = {
    on: function() {
      if (!this.o) {
        this.o = $({});
      }
      return this.o.on.apply(this.o, arguments);
    },
    off: function() {
      if (!this.o) {
        this.o = $({});
      }
      return this.o.off.apply(this.o, arguments);
    },
    trigger: function() {
      if (!this.o) {
        this.o = $({});
      }
      return this.o.trigger.apply(this.o, arguments);
    }
  };
  Modal = (function() {
    function Modal(el) {
      this._onMousedown = __bind(this._onMousedown, this);
      this._onKeydownEvent = __bind(this._onKeydownEvent, this);
      this._onKeydown = __bind(this._onKeydown, this);
      this._onClickoutside = __bind(this._onClickoutside, this);
      this._onCancel = __bind(this._onCancel, this);
      this._onHide = __bind(this._onHide, this);
      this._onShow = __bind(this._onShow, this);
      var $content;
      this.id = getUniqueId();
      this.backdrop = true;
      this.visible = false;
      this.$el = null;
      this.el = null;
      if (el) {
        this.$el = el instanceof $ ? el : $(el);
        this.backdrop = false;
      } else {
        this.$el = $(dom.attach(this.id));
      }
      $content = this.$el.find("." + config.contentClass);
      this.$content = $content.length ? $content : this.$el;
      this.el = this.$el[0];
      this.el.setAttribute("data-modal-id", this.id);
      this.on("show", this._onShow);
      this.on("hide", this._onHide);
      this.on("cancel", this._onCancel);
      this.on("clickoutside", this._onClickoutside);
      this.$el.on("keydown", this._onKeydownEvent);
      this.$content.on("click", this._onMousedown);
      this;
    }

    Modal.prototype.show = function(options) {
      this.trigger("show", options);
      this.$el.show().focus();
      if (this.backdrop) {
        this.showBackdrop();
      }
      return this;
    };

    Modal.prototype.hide = function(options) {
      this.trigger("hide", options);
      this.$el.hide().blur();
      if (this.backdrop) {
        this.hideBackdrop();
      }
      return this;
    };

    Modal.prototype.showBackdrop = function() {
      $(dom.backdropEl).show();
      return this;
    };

    Modal.prototype.hideBackdrop = function() {
      return $(dom.backdropEl).hide();
    };

    Modal.prototype.set = function() {
      var arg, args, _i, _len;
      args = $.makeArray(arguments);
      this.$content.empty();
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        this.$content.append(arg);
      }
      return this;
    };

    Modal.prototype._onShow = function(event, options) {
      if (options == null) {
        options = {};
      }
      if (this.visible) {
        return false;
      }
      this.visible = true;
      preventModalClose = true;
      setTimeout(function() {
        return preventModalClose = false;
      }, 16);
      if (!options.silent) {
        return api.trigger("show", this);
      }
    };

    Modal.prototype._onHide = function(event, options) {
      if (options == null) {
        options = {};
      }
      if (!this.visible) {
        return false;
      }
      this.visible = false;
      if (!options.silent) {
        return api.trigger("hide", this);
      }
    };

    Modal.prototype._onCancel = function() {
      this.hide();
      return api.trigger("cancel", this);
    };

    Modal.prototype._onClickoutside = function() {
      this.hide();
      return api.trigger("clickoutside", this);
    };

    Modal.prototype._onKeydown = function(key) {
      if (key === 27) {
        event.preventDefault();
        return this.trigger("cancel");
      }
    };

    Modal.prototype._onKeydownEvent = function(event) {
      return this._onKeydown(event.which);
    };

    Modal.prototype._onMousedown = function(event) {
      preventModalClose = true;
    };

    return Modal;

  })();
  $.extend(Modal.prototype, Events);
  $.extend(api, Events);
  api.instances = [];
  api.create = function(selector) {
    var modal;
    modal = new Modal(selector);
    this.trigger("add", modal);
    this.instances.push(modal);
    return modal;
  };
  api.destroy = function(modal) {
    var i, instance, _i, _len, _ref, _results;
    if (!modal || modal.el.nodeType !== 1) {
      return false;
    }
    modal.hide();
    modal.off();
    modal.$el.remove();
    _ref = this.instances;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      instance = _ref[i];
      if (instance === modal) {
        _results.push(this.instances.splice(i, 1));
      }
    }
    return _results;
  };
  api.getById = function(id) {
    var instance, _i, _len, _ref;
    _ref = this.instances;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      instance = _ref[_i];
      if (instance.id === id) {
        return instance;
      }
    }
  };
  api.getActive = function() {
    return activeModal;
  };
  api.getContainer = $.proxy(dom.getContainer, dom);
  api.fn = Modal.prototype;
  api.on("show", (function(_this) {
    return function(event, current) {
      if (activeModal != null ? activeModal.visible : void 0) {
        activeModal.hide({
          silent: true
        });
      }
      return activeModal = current;
    };
  })(this)).on("hide", (function(_this) {
    return function(event, current) {
      if (activeModal === current) {
        return activeModal = false;
      }
    };
  })(this));
  triggerClose = function() {
    var active;
    if (active = api.getActive()) {
      if (!preventModalClose && active.visible) {
        active.trigger("clickoutside");
      }
    }
    return preventModalClose = false;
  };
  onDocClick = function(event) {
    if (event.which === 3) {
      return;
    }
    triggerClose();
  };
  $(function() {
    return $(document).on("click", onDocClick);
  });
  return api;
});
