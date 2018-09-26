if (ieVersion() != -1) {
  var version = document.createElement('div');
  if (ieVersion() > 8) version.classList.add('version');
  else version.classList += 'version';
  version.appendChild(document.createTextNode('IE ' + ieVersion().toString() + ' detected.'));
  document.getElementsByTagName('body')[0].insertBefore(version, document.getElementsByTagName('body')[0].childNodes[0]);
}

function ieVersion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0) return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
  else if (navigator.userAgent.match(/Trident.*rv\:11\./)) return 11;
  else return -1;
}
