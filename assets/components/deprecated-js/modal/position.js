var Modal = require('./modal');
var $ = require('jquery');

var getOffsetPosition = function($el) {
  var offset;
  offset = $.extend({
    width: $el.width(),
    height: $el.height()
  }, $el.offset());
  return offset;
};

var getStyles = function(anchor, element, options) {
  var tp;
  tp = null;
  switch (options.pos) {
    case "bottom":
      tp = {
        top: anchor.top + anchor.height + options.offset,
        left: anchor.left + anchor.width / 2 - element.width / 2
      };
      break;
    case "top":
      tp = {
        top: anchor.top - element.height - options.offset,
        left: anchor.left + anchor.width / 2 - element.width / 2
      };
      break;
    case "left":
      tp = {
        top: anchor.top + anchor.height / 2 - element.height / 2,
        left: anchor.left - anchor.width - options.offset
      };
      break;
    case "right":
      tp = {
        top: anchor.top + anchor.height / 2 - element.height / 2,
        left: anchor.left + anchor.width + options.offset
      };
  }
  return tp;
};

var getSize = function($element) {
  var height, size, width;
  $element.css({
    position: "absolute",
    display: "block",
    visibility: "hidden"
  });
  document.body.appendChild($element[0]);
  width = $element.outerWidth(false);
  height = $element.outerHeight(false);
  $element.detach();
  $element.css({
    visibility: "",
    display: ""
  });
  size = {
    width: width,
    height: height
  };
  return size;
};

Modal.fn.position = function(anchor, options) {
  var element, parent, styles;
  if (!anchor) {
    return false;
  }
  options = $.extend({
    pos: "bottom",
    offset: 20
  }, options);
  element = getSize(this.$el);
  parent = getOffsetPosition($(anchor));
  styles = getStyles(parent, element, options);
  this.$el.css(styles).addClass("pos-" + options.pos);
  Modal.getContainer().appendChild(this.el);
  return this;
};
