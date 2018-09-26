if (typeof Array.prototype.forEach != 'function') {
  Array.prototype.forEach = function(callback) {
    for (var i = 0; i < this.length; i++) {
      callback.apply(this, [this[i], i, this]);
    }
  }
}

Array.prototype.forEach.call(
  document.getElementsByClassName('rippleItem'), function(item) {
  item.addEventListener('mousedown', createRipple);
});

function createRipple(e) {
  var circle = document.createElement('div');

  var radius = Math.max(this.clientWidth, this.clientHeight);
  circle.style.width = circle.style.height = radius + 'px';
  circle.style.left = e.clientX - this.offsetLeft - radius / 2 + 'px';
  circle.style.top = e.clientY - this.offsetTop - radius / 2 + 'px';
  circle.style.opacity = 0;

  circle.classList.add('ripple');
  this.appendChild(circle);
}

function ieVersion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0) return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
  else if (navigator.userAgent.match(/Trident.*rv\:11\./)) return 11;
  else return -1;
}
