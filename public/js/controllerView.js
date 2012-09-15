
var ControllerView = function() {

  }


ControllerView.prototype.init = function(pp, name, displayName, modelView) {
  this.pp = pp;
  this.name = name;
  this.displayName = displayName;
  this.item = {};
  this.modelView = {};
};

ControllerView.prototype.setup = function(container, callback) {
  this.outputDOMStructure(container);
  $("#add" + this.name).click(function(e) {
    this.pp.socket.emit('add' + this.name, {}, function(err, dbItem) {
      var o = [];
      dbItem = this.applyDBToViewTransformationsForItem(dbItem);
      this.item = dbItem.item;
      this.outputListItem(o);
      $("#" + this.name + "-list").append(o.join(''));
      this.registerClickEditMode(this.item);            
      this.createDOM(dbItem, "#" + this.getListItemID());

    }.bind(this));
  }.bind(this));
  this.pp.socket.emit("get" + this.name + "Model", {}, function(err, model) {
    this.model = model;
    return callback(null, this);
  }.bind(this));
}


ControllerView.prototype.getClassDOMID = function() {
  return this.name + "-" + this.item._id;
}


ControllerView.prototype.outputDOMStructure = function(container) {
  var o = [];
  o.push('<h1 class="controller-name">', this.displayName, '</h1>');
  o.push('<button class="controller-action" id="add', this.name, '">Ajouter ', this.displayName, '</button>');
  o.push('<div id="', this.name, 'sList"></div>');
  //o.push('<ul id="', this.name, 's" class="item-big-container"></ul>');
  $(container).html(o.join(''));
}



ControllerView.prototype.applyDBToViewValue = function(type, value) {
  switch (type) {
  case "Time":
    return cvAttrTools.dateToTime(value);
    break;
  }
  return value;
};


ControllerView.prototype.applyDBToViewTransformationsForItem = function(dbItem) {
  this.browseModelView(dbItem, function(attr, attrView, value) {
    dbItem[attrView.id] = this.applyDBToViewValue(attrView.type, value);
  }.bind(this));
  return dbItem;
};


ControllerView.prototype.applyDBToViewTransformationsForItems = function(items) {
  $.each(items, function(i, item) {
    items[i] = this.applyDBToViewTransformationsForItem(item);
  }.bind(this));
  return items;
};


ControllerView.prototype.outputComboBox = function(o, cbValues, selected, attrID) {
  o.push("<select id='", this.getAttrDOMID(attrID), "' class='combobox'>");
  _.each(cbValues, function(cbV) {
    o.push("<option value='", cbV.value, "' ", (cbV.value === selected) ? "selected='selected' " : "", ">");
    o.push(cbV.name, "</option>");
  });
  o.push("</select>");
};


ControllerView.prototype.browseModelView = function(item, callback) {
  //console.log(this.model);
  _.each(this.attributes, function(attr) {
    var attrView = this.model[attr];
    //console.log("Attr", this.model, attr, attrView);
    if (!_.isUndefined(attr)) {
      var value = item[attr];
      callback(attr, attrView, value);
    }
  }.bind(this));
}



ControllerView.prototype.getAttrDOMID = function(id) {
  return this.name + "-" + this.item._id + "-" + id;
}


ControllerView.prototype.catchError = function(err) {
  var message = err;
  if (_.isObject(err)) {
    message = err.message;
  }

  $("#err-zone").html(message);
  $("#err-zone").fadeIn(250, function() {
    $("#err-zone").fadeOut(1000);
  });
}


ControllerView.prototype.addMessage = function(message) {
  $("#message-zone").html(message);
  $("#message-zone").fadeIn(500, function() {
    $("#message-zone").fadeOut(5000);
  });
};
