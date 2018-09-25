if (ieVersion() > 0) {
  var ieError = document.createElement('div');
  ieError.classList.add('ieError');
  ieError.appendChild(document.createTextNode('You\'re using IE ' + ieVersion().toString() + '. IE is not supported.'));
  document.getElementsByTagName('body')[0].insertBefore(ieError, document.getElementsByTagName('body')[0].childNodes[0]);

  // IE doesn't support HTML5
  Array.prototype.forEach.call(Array.prototype.slice.call(document.getElementsByTagName('button')).filter(function(item) {
    return item.getAttribute('form') != null;
  }), function(item) {
    item.addEventListener('click', function(e) {
      Array.prototype.forEach.call(Array.prototype.slice.call(document.getElementsByTagName('form')).filter(function(form) {
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
