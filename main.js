
var header = document.createElement('header');
var h1 = document.createElement('h1');

h1.setAttribute('class', 'title');
h1.textContent = 'Minimum viable view library';

document.body.appendChild(header);
header.appendChild(h1);


var h2 = el('h2',
  'Juha Lindstedt',
  ' ',
  el('a', { href: 'http://pakastin.fi', target: '_blank' },
    'pakastin.fi'
  )
);

mount(document.body, h2);


var h3 = el('h3', 'About me');

mount(document.body, h3);

function Li (data) {
  this.el = el('li', data);
}

var items = [
  'Started with Flash in 1999',
  'Work with small businesses and advertising agencies',
  'Entrepreneur since 2006',
  'Started with Node.js in 2011',
  'Lead developer of iDiD digital signage (idid.fi)'
].map(function (item) {
  return new Li(item);
});

var ul = el('ul',
  items
);

mount(document.body, ul);

setTimeout(function () {
  items.reverse();
  setChildren(ul, items);
}, 1000);


function Card () {
  this.el = el('div', { class: 'card' },
    this.img = el('img'),
    this.name = el('p')
  )
}

Card.prototype.update = function (data) {
  this.img.width = data.img.width;
  this.img.height = data.img.height;
  this.img.src = data.img.src;
  this.name.textContent = data.name;
}

var data = new Array(50);

for (var i = 0; i < data.length; i++) {
  var width = Math.random() * 75 + 75 | 0;
  var height = Math.random() * 75 + 75 | 0;

  data[i] = {
    id: i,
    img: {
      width: width,
      height: height,
      src: 'https://unsplash.it/' + width + '/' + height
    },
    name: 'Image ' + (i + 1)
  }
}

var list = new List(Card, 'id');

var cards = el('div', { class: 'cards' },
  list
);

list.update(data);

mount(document.body, cards);


update();

function update () {
  data.sort(function () {
    return Math.random() - .5;
  });
  list.update(data.slice(0, Math.random() * 25 + 25 | 0));
  setTimeout(update, 1000);
}
