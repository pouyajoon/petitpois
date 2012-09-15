ControllerView.prototype.getItem = function(DOMitem, callback) {
  this.pp.socket.emit("get" + this.name + "Item", DOMitem, function(err, dbItem) {
    dbItem = this.applyDBToViewTransformationsForItem(dbItem);
    return callback(err, dbItem);
  }.bind(this));
};





ControllerView.prototype.registerClickEditMode = function() {
  var id = "#" + this.getListItemID();
  var item = this.item;
  $(id + " a").on('click.edit-item', function(e) {
    this.getItem(item, function(err, dbItem) {
      $(id).off('click.edit-item');
      this.item = dbItem.item;
      this.createDOM({
        "item": dbItem
      }, id);
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
  this.pp.socket.emit("get" + this.name + "s", {}, function(err, items) {
    var res = [];
    _.each(items, function(i) {
      res.push({
        "name": i[nameKey],
        "value": i._id
      });
    });
    callback(err, res);
  }.bind(this));
};

ControllerView.prototype.getAll = function() {
  this.pp.socket.emit("get" + this.name + "s", {}, function(err, items) {
    var o = [];
    items = this.applyDBToViewTransformationsForItems(items);
    this.outputListItems(o, items);
    $("#" + this.name + "sList").html(o.join(''));
    this.getAllSetClickEvents(items);

  }.bind(this));
}

ControllerView.prototype.getItemsByFilter = function(filter, callback) {

  this.pp.socket.emit("get" + this.name + "s", {
    "filter": filter
  }, function(err, items) {
    items = this.applyDBToViewTransformationsForItems(items);
    return callback(err, items);
  }.bind(this));
}