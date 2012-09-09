var cvTools = function() {

  }

cvTools.heritate = function(_child, _parent) {
  for (var a in _parent.prototype) {
    if (typeof _child.prototype[a] === "undefined") {
      _child.prototype[a] = _parent.prototype[a];
    }
  }
};

cvTools.createModelView = function(id, name, type, readOnly, transformFunctionDBToView) {
  return {
    'id': id,
    'name': name,
    'type': type,
    'readOnly': (_.isUndefined(readOnly) ? false : readOnly)
  };
}


var cvAttrTools = {};

cvAttrTools.dateToTime = function(dateString) {
  if (_.isUndefined(dateString)) {
    return null;
  }
  var d = new Date(dateString);
  var res = d.toISOString().substring(11, 16);
  return res;
}


cvAttrTools.timeToDate = function(time) {
  var hours = time.substring(0, 2);
  var minutes = time.substring(3);
  var timeDate = new Date(); //Date(0000, 00, 00, hours, minutes, 00);
  timeDate.setTime((hours * 3600 + minutes * 60) * 1000);
  return timeDate;
}


var ControllerView = function() {

  }


ControllerView.prototype.init = function(pp, name, displayName, modelView) {
  this.pp = pp;
  this.name = name;
  this.displayName = displayName;
  this.item = {};
  this.modelView = {};
};

ControllerView.prototype.setup = function(callback) {
  $("#add" + this.name).click(function(e) {
    this.pp.socket.emit('add' + this.name, {}, function(err, dbItem) {
      this.createDOM(dbItem);
    }.bind(this));
  }.bind(this));
  this.pp.socket.emit("get" + this.name + "Model", {}, function(err, model) {
    this.model = model;
    return callback(null, this);
  }.bind(this));
}


ControllerView.prototype.outputDOMStructure = function(container) {
  var o = [];
  o.push('<h1>', this.displayName, '</h1>');
  o.push('<div id="', this.name, 'sList"></div>');
  o.push('<hr/><button id="add', this.name, '">Ajouter ', this.displayName, '</button><hr/>');
  o.push('<ul id="', this.name, 's"></ul>');
  $(container).html(o.join(''));
}


ControllerView.prototype.applyDBToViewTransformationsForItem = function(dbItem) {
  this.browseModelView(dbItem, function(attr, attrView, value) {
    dbItem[attrView.id] = this.applyDBToViewValue(attrView.type, value);
  }.bind(this));
  return dbItem;
};

ControllerView.prototype.applyDBToViewValue = function(type, value) {
  switch (type) {
  case "Time":
    return cvAttrTools.dateToTime(value);
    break;
  }
  return value;
};

ControllerView.prototype.getItem = function(DOMitem, callback) {
  this.pp.socket.emit("get" + this.name + "Item", DOMitem, function(err, dbItem) {
    dbItem = this.applyDBToViewTransformationsForItem(dbItem);
    return callback(err, dbItem);
  }.bind(this));
};


ControllerView.prototype.applyDBToViewTransformationsForItems = function(items) {
  $.each(items, function(i, item) {
    items[i] = this.applyDBToViewTransformationsForItem(item);
  }.bind(this));
  return items;
};



ControllerView.prototype.getAllSetClickEvents = function(items) {
  _.each(items, function(item) {
    var id = "#list-item-" + this.name + "-" + item._id;
    $(id).click(function(e) {
      this.getItem(item, function(err, dbItem) {
        this.createDOM({
          "item": dbItem
        });
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

ControllerView.prototype.getAll = function() {
  this.pp.socket.emit("get" + this.name + "s", {}, function(err, items) {
    var o = [];
    items = this.applyDBToViewTransformationsForItems(items);
    listIt(o, this.name, items, this.outputOne);
    $("#" + this.name + "sList").html(o.join(''));
    this.getAllSetClickEvents(items);

  }.bind(this));
}


ControllerView.prototype.getClassDOMID = function() {
  return this.name + "-" + this.item._id;
}

ControllerView.prototype.createDOM = function(data) {

  this.item = data.item;

  this.createDOMOutputEditAttr();
  this.createDOMDoJSActions();
  this.createDOMAddJSEditAttrUpdate();
}

ControllerView.prototype.createDOMOutputEditAttr = function() {
  var o = [];
  o.push("<li class='", this.name, "' id='", this.getClassDOMID() + "'>");
  o.push("<button id='delete-", this.getClassDOMID(), "' data-item-id='", this.item._id, "'>Supprimer</button>");
  o.push("<ul id='edit-list-", this.getClassDOMID() + "' class='", this.name, "'>");
  this.browseModelView(this.item, function(attr, attrView, value) {
    o.push("<li class='", this.getClassDOMID(), "-structure edit-attr'>");
    o.push(attrView.name, " : ");
    o.push("<input id='", this.getAttrDOMID(attrView.id), "' value='", value, "'/>");
    o.push("</li>");
  }.bind(this));
  o.push("</ul>");
  o.push("</li>");
  $("#" + this.name + "s").html(o.join(''));
};

ControllerView.prototype.createDOMDoJSActions = function() {
  this.browseModelView(this.item, function(attr, attrView, value) {
    switch (attrView.type) {
    case "Time":
      setTimePicker(this.getAttrDOMID(attrView.id));
      break;
    }
  }.bind(this));
};


ControllerView.prototype.createDOMAddJSEditAttrUpdate = function() {
  $("#" + this.getClassDOMID() + " .edit-attr").focusout(function(e) {
    this.update();
  }.bind(this));
  var deleteID = "#delete-" + this.getClassDOMID();
  $(deleteID).click(function(e) {
    var id = $(deleteID).attr('data-item-id');
    this.pp.socket.emit("delete" + this.name + "Item", {
      "controller": this.name,
      "id": id
    }, function(err) {
      $("#" + this.name + "-" + id).fadeOut();
      this.getAll();
    }.bind(this));
  }.bind(this));

};

ControllerView.prototype.browseModelView = function(item, callback) {
  _.each(this.model, function(attr) {
    var attrView = this.modelView[attr.name];
    if (!_.isUndefined(attrView)) {
      var value = item[attrView.id];
      callback(attr, attrView, value);
    }
  }.bind(this));
}



ControllerView.prototype.getAttrDOMID = function(id) {
  return this.name + "-" + this.item._id + "-" + id;
}


ControllerView.prototype.updateItemFromDOM = function() {
  this.browseModelView({}, function(attr, attrView, itemValue) {
    var DOMValue = $("#" + this.getAttrDOMID(attrView.id)).val();
    switch (attrView.type) {
    case "Time":
      this.item[attrView.id] = cvAttrTools.timeToDate(DOMValue).toISOString();
      break;
    default:
      this.item[attrView.id] = DOMValue;
      break;
    }
  }.bind(this));
};

ControllerView.prototype.update = function() {
  this.updateItemFromDOM();
  this.pp.socket.emit("update" + this.name, this.item, function(err, dt) {
    this.getAll();
  }.bind(this));
};