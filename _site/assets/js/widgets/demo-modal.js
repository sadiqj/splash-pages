(function() {
  'use strict';

  var Widgets = window.GoCardless.module('widgets');

  Widgets.Views.DemoModal = (function() {
    function DemoModal() {
      this.setModal = this.setModal.bind(this);
      return DemoModal.__super__.constructor.apply(this, arguments);
    }

    window.classExtends(DemoModal, Widgets.Views.ModalVimeo);

    DemoModal.prototype.onFinish = function() {
      this.triggerMixpanelEvent('finish');
    }

    DemoModal.prototype.onPlay = function() {
      this.triggerMixpanelEvent('play');
    }

    DemoModal.prototype.onPause = function() {
      this.triggerMixpanelEvent('pause');
    }

    DemoModal.prototype.onProgress = function(data) {
      var percentage = parseFloat(data.percent);

      // If the user has hit a third of the way through, and we haven't
      // already incremented their demo plays this session, do it
      if (percentage > 0.33 && !this.triggeredDemoPlaysIncrement) {
        this.incrementMixpanelProperty('Demo Plays');
        this.triggeredDemoPlaysIncrement = true;
      }
    }

    DemoModal.prototype.triggerMixpanelEvent = function(type) {
      window.gct('track', 'Video', {
        'Path': window.location.pathname,
        'Type': type
      });
    }

    DemoModal.prototype.incrementMixpanelProperty = function(property) {
      window.gct('people.increment', property);
    }

    return DemoModal;

  })();

}).call(this);
