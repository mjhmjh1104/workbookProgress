// IE 8 doesn't support Array.prototype.forEach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    var T;
    if (this == null) throw new TypeError('Null or not defined');
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") throw new TypeError(callback + ' is not a function');
    if (arguments.length > 1) T = thisArg;
    for (var k = 0; k < len; k++) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
    }
  };
}
