var inputs = document.getElementsByTagName('input');

if (ieVersion() >= 9) Array.prototype.forEach.call(inputs, function(item) {
  item.addEventListener('click', select);
});

function select(e) {
  this.select();
  this.setSelectionRange(0, this.value.length);
}

function ieVersion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0) return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
  else if (navigator.userAgent.match(/Trident.*rv\:11\./)) return 11;
  else return -1;
}
