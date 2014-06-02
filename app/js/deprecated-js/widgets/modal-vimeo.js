'use strict';

var Modals = require('./modals');
var Froogaloop = require('froogaloop');

function ModalVimeo(options) {
  this.setModal = this.setModal.bind(this);
  Modals.call(this, options);
}

ModalVimeo.prototype = Object.create(Modals.prototype);
ModalVimeo.prototype.constructor = ModalVimeo;

ModalVimeo.prototype.el = '[data-modal-vimeo]';

ModalVimeo.prototype.ready = function() {
  Modals.prototype.ready.apply(this, arguments);
  return this.initAutoplay();
};

ModalVimeo.prototype.setModal = function() {
  Modals.prototype.setModal.apply(this, arguments);
  return this.initVimeoPlayer();
};

ModalVimeo.prototype.getVimeoPlayer = function() {
  return this.getModal().videoPlayer;
};

ModalVimeo.prototype.initVimeoPlayer = function() {
  var instance = this.getModal();
  var iframe = instance.$el.find('iframe')[0];
  var player = instance.videoPlayer = Froogaloop(iframe);
  instance.on('hide', $.proxy(this.onHide, this));

  player.addEvent('ready', $.proxy(function() {
    player.addEvent('pause', $.proxy(this.onPause, this));
    player.addEvent('play', $.proxy(this.onPlay, this));
    player.addEvent('finish', $.proxy(this.onFinish, this));
    player.addEvent('playProgress', $.proxy(this.onProgress, this));
  }, this));

  return instance;
};

ModalVimeo.prototype.initAutoplay = function() {
  var search = location.search.substring(1);
  var autoPlay = search && search.match(/autoplay\=([^&]+)/);
  var autoPlayTarget = autoPlay && autoPlay[1];
  if (autoPlayTarget && this.getTarget().match(autoPlayTarget)) {
    return this.play();
  }
};

ModalVimeo.prototype.play = function() {
  this.showModal();
  return this.getVimeoPlayer().api('ready', (function(_this) {
    return function() {
      return _this.getVimeoPlayer().api('play');
    };
  })(this));
};

ModalVimeo.prototype.onHide = function() {
  return this.getVimeoPlayer().api('pause');
};

// Override these event handlers in your subclass
ModalVimeo.prototype.onFinish = function() {
}

ModalVimeo.prototype.onPlay = function() {
}

ModalVimeo.prototype.onPause = function() {
}

ModalVimeo.prototype.onProgress = function(data) {
}

module.exports = ModalVimeo;
