var inputs = document.getElementsByTagName('input');

Array.prototype.forEach.call(inputs, function(item) {
  item.addEventListener('click', bottomBorder);
});

function bottomBorder(e) {
  var bottom = document.createElement('div');

  bottom.style.left = this.offsetLeft + 'px';
  bottom.style.top = this.offsetTop + 'px';

  bottom.classList.add('bottomBorder');
  this.appendChild(bottom);
}
