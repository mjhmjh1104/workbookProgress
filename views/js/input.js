var inputs = document.getElementsByTagName('input');

Array.prototype.forEach.call(inputs, function(item) {
  item.addEventListener('click', select);
});

function select(e) {
  this.select();
  this.setSelectionRange(0, this.value.length);
}
