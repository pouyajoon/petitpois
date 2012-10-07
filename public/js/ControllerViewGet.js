ControllerView.prototype.getItem = function(DOMitem, callback) {
  this.pp.socket.emit("get" + this.name + "Item", DOMitem, function(err, dbItem) {
    dbItem = this.applyDBToViewTransformationsForItem(dbItem);
    //console.log("get item", dbItem);
    return callback(err, dbItem);
  }.bind(this));
};


ControllerView.prototype.registerClickEditMode = function(containerControllerID) {
  var id = "#" + this.getListItemID();
  var item = this.item;
  $(id + " a").on('dblclick.edit-item', function(e) {
    this.getItem(item, function(err, dbItem) {
      $(id).off('dblclick.edit-item');
      this.item = dbItem.item;
      this.createDOM({
        "item": dbItem
      }, id, containerControllerID);
    }.bind(this));
  }.bind(this));
}

ControllerView.prototype.getAllSetClickEvents = function(items) {
  _.each(items, function(item) {
    this.item = item;
    this.registerClickEditMode();
  }.bind(this));
};


ControllerView.prototype.getItemsForComboBoxes = function(nameKey, callback) {
  this.getItemsByFilter({}, function(err, items) {
    var res = [];
    _.each(items, function(i) {
      res.push({
        "name": this.outputOne(i),
        "value": i._id
      });
    }.bind(this));
    callback(err, res);
  }.bind(this));
};


ControllerView.prototype.getOneAndOutput = function() {
  this.getItemsByFilter({}, function(err, items) {
    var o = [];
    //console.log(err, items);
    this.outputListItems(o, items, this.name);
    $("#" + this.name + "sList").html(o.join(''));
    this.getAllSetClickEvents(items);

  }.bind(this));
}


ControllerView.prototype.getAndOutput = function(filter, container) {
  //console.log("filter", filter, container);
  this.getItemsByFilter(filter, function(err, items) {
    //console.log(items.length);
    var o = [];
    this.outputListItems(o, items, this.name);
    $(container).html(o.join(''));
    this.getAllSetClickEvents(items);

  }.bind(this));
}

ControllerView.prototype.getItemsByFilter = function(filter, callback) {
  this.pp.socket.emit("get" + this.name + "s", {
    "filter": filter
  }, function(err, items) {
    //console.log(items);
    items = this.applyDBToViewTransformationsForItems(items);
    return callback(err, items);
  }.bind(this));
}