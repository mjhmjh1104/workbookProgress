if (ieVersion() > 0) {
  var ieError = document.createElement('div');
  if (ieVersion() <= 8) {
    ieError.className += 'ieError';
    ieError.appendChild(document.createTextNode('You\'re using IE ' + ieVersion().toString() + '. IE under 8 is not supported.'));
    document.getElementsByTagName('body')[0].insertBefore(ieError, document.getElementsByTagName('body')[0].childNodes[0]);
  }

  if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function(callback) {
      for (var i = 0; i < this.length; i++) {
        callback.apply(this, [this[i], i, this]);
      }
    }
  }

    // IE doesn't support HTML5
  Array.prototype.forEach.call(
    Array.prototype.slice.call(
      document.getElementsByTagName('button'))
      .filter(function(item) {
    return item.getAttribute('form') != null;
  }), function(item) {
    item.addEventListener('click', function(e) {
      Array.prototype.forEach.call(
        Array.prototype.slice.call(
          document.getElementsByTagName('form'))
          .filter(function(form) {
        return form.id == item.getAttribute('form');
      }), function(item) {
        item.submit();
      });
    });
  });
}

function formFilter(item) {
  return item.getAttribute('form') != null;
}

function ieVersion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0) return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
  else if (navigator.userAgent.match(/Trident.*rv\:11\./)) return 11;
  else return -1;
}
