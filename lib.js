
function el (tagName) {
  var element = document.createElement(tagName);

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];

    if (mount(element, arg)) {
      continue;
    } else if (typeof arg === 'object') {
      for (var attr in arg) {
        if (element[attr] != null) {
          element[attr] = arg[attr];
        } else {
          element.setAttribute(attr, arg[attr]);
        }
      }
    }
  }

  return element;
}

function mount (parent, child, before) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;

  if (childEl instanceof Node) {
    if (before) {
      var beforeEl = before.el || before;
      parentEl.insertBefore(childEl, beforeEl);
    } else {
      parentEl.appendChild(childEl);
    }
  } else if (typeof childEl === 'string' || typeof childEl === 'number' || typeof childEl === 'boolean') {
    mount(parentEl, document.createTextNode(childEl));
  } else if (childEl instanceof Array) {
    for (var i = 0; i < childEl.length; i++) {
      mount(parentEl, childEl[i]);
    }
  } else if (childEl instanceof List) {
    childEl.parent = parent;
    mount(parentEl, childEl.views);
  } else {
    return false;
  }
  return true;
}

function setChildren (parent, children) {
  var parentEl = parent.el || parent;
  var traverse = parentEl.firstChild;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var childEl = child.el || child;

    if (childEl === traverse) {
      traverse = traverse.nextSibling;
      continue;
    }

    mount(parentEl, childEl, traverse);
  }

  while (traverse) {
    var next = traverse.nextSibling;

    parentEl.removeChild(traverse);

    traverse = next;
  }
}

function List (View, key) {
  this.View = View;
  this.views = [];

  if (key) {
    this.key = key;
    this.lookup = {};
  }
}

List.prototype.update = function (data) {
  var View = this.View;
  var views = this.views;
  var parent = this.parent;
  var key = this.key;

  views.length = data.length;

  if (key) {
    var oldLookup = this.lookup;
    var lookup = {};

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var id = item[key];
      var view = oldLookup[id];

      if (!view) {
        view = new View();
      }
      lookup[id] = views[i] = view;

      view.update && view.update(item);
    }
    this.lookup = lookup;
  } else {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var view = views[i];

      if (!view) {
        view = views[i] = new View();
      }

      view.update && view.update(item);
    }
  }

  parent && setChildren(parent, views);
}
