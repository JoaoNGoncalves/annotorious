goog.provide('yuma.viewer');

goog.require('goog.style');
goog.require('goog.dom');
goog.require('goog.dom.query');

/**
 * A popup bubble widget to show annotation details.
 * @param {element} parentEl the DOM element to attach to
 * @param {yuma.modules.image.ImageAnnotator} annotator reference to the annotator
 * @constructor
 */
yuma.viewer.Popup = function(parentEl, annotator) {      
  /** @private **/
  this._annotator = annotator;

  /** @private **/
  this._element = goog.soy.renderAsElement(yuma.templates.popup);

  /** @private **/
  this._text = goog.dom.query('.yuma-popup-text', this._element)[0];

  /** @private **/
  this._timer;

  var btnDelete = goog.dom.query('.yuma-popup-action-delete', this._element)[0];

  var self = this;
  goog.events.listen(btnDelete, goog.events.EventType.CLICK, function(event) {
    // Throw event
  });
  
  goog.events.listen(this._element, goog.events.EventType.MOUSEOVER, function(event) {
    self.clearHideTimer();
  });
  
  goog.events.listen(this._element, goog.events.EventType.MOUSEOUT, function(event) {
    self.startHideTimer();
  });
  
  goog.style.setOpacity(this._element, 0.0);
  goog.dom.appendChild(parentEl, this._element);
}

yuma.viewer.Popup.prototype.show = function(annotation, x, y) {
  this._text.innerHTML = annotation.text;
  this.setPosition(x, y);
  goog.style.setOpacity(this._element, 1.0); 
}

yuma.viewer.Popup.prototype.setPosition = function(x, y) {
  goog.style.setPosition(this._element, new goog.math.Coordinate(x, y));
}

yuma.viewer.Popup.prototype.startHideTimer = function() {
  if (!this._timer) {
    var self = this;
    this._timer = window.setTimeout(function() {
      goog.style.setOpacity(self._element, 0.0);
      self._annotator.fireEvent(yuma.events.EventType.POPUP_HIDDEN);
      delete self._timer;
    }, 300);
  }
}

yuma.viewer.Popup.prototype.clearHideTimer = function() {
  if (this._timer) {
    window.clearTimeout(this._timer);
    delete this._timer;
  }
}