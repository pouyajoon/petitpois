
var ControllerView = function() {

  }


ControllerView.prototype.init = function(pp, name, displayName, modelView) {
  this.pp = pp;
  this.name = name;
  this.displayName = displayName;
  this.item = {};
  this.modelView = {};
};


ControllerView.prototype.outputOne = function(item) {
  return item.name + " *";
}

ControllerView.prototype.registerAddEvent = function(id, extraAttributes) {
  //console.log("Add register", id, extraAttributes);
//  var containerControllerID = this.containerControllerID;
  $("#add" + id).click(function(e) {

    this.pp.socket.emit('add' + this.name, {}, function(err, dbItem) {
      //console.log("add", id, dbItem);
      var o = [];
      dbItem.item = this.applyDBToViewTransformationsForItem(dbItem.item);
      this.item = dbItem.item;
      //console.log(this.item);
      if (!_.isUndefined(extraAttributes)){
        _.each(extraAttributes, function(eAttr){
          this.item[eAttr.name] = eAttr.value;
        }.bind(this));        
      }
      this.outputListItem(o);
      $("#list-" + id).append(o.join(''));

      this.registerClickEditMode(); 
//      this.containerControllerID = containerControllerID;         
      this.createDOM(dbItem, "#" + this.getListItemID());

    }.bind(this));
  }.bind(this));
};

ControllerView.prototype.setup = function(container, callback) {
  this.setOptionsHTML(container);
  this.registerAddEvent(this.name);
  this.pp.socket.emit("get" + this.name + "Model", {}, function(err, model) {
    this.model = model;
    return callback(null, this);
  }.bind(this));
}


ControllerView.prototype.getClassDOMID = function() {
  return this.name + "-" + this.item._id;
}


ControllerView.prototype.outputControllerActionButtons = function(output, id) {
  output.push('<button class="controller-action" id="add', id, '">Ajouter ', this.displayName, '</button>');
};

ControllerView.prototype.outputOptionsHTML = function(output) {
  output.push('<h1 class="controller-name">', this.displayName, '</h1>');
  this.outputControllerActionButtons(output, this.name);
  output.push('<div id="', this.name, 'sList"></div>');
};

ControllerView.prototype.setOptionsHTML = function(container) {
  var o = [];
  this.outputOptionsHTML(o);
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
