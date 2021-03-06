
ControllerView.prototype.update = function(callback) {
  this.updateItemFromDOM();

  var data = {};
  data.item = this.item;
  data.parentController = this.containerController;
  this.pp.socket.emit("update" + this.name, data, function(err, dbItem) {
    console.log("update api answer", err, this.item);
    if (err) {
      return this.catchError(err);
    }
    this.addMessage("Update done");
    if (!_.isUndefined(callback) && _.isFunction(callback)){
      return callback(null, this.applyDBToViewTransformationsForItem(dbItem));
    }
  }.bind(this));
};


ControllerView.prototype.updateAll = function(items, callback){
  var data = {};
  data.items = items;
  data.parentController = this.containerController.name;
  this.pp.socket.emit("updateAll" + this.name, data, function(err) {
    //console.log("update all api answer", err);
    if (err) {
      return this.catchError(err);
    }
    this.addMessage("Update All Done");
    return callback(null);
  }.bind(this));

}


ControllerView.prototype.updateItemFromDOM = function() {
  this.browseModelView({}, function(attr, attrView, itemValue) {
    var DOMValue = $("#" + this.getAttrDOMID(attrView.id)).val();
    switch (attrView.type) {
    case "Time":
      this.item[attrView.id] = cvAttrTools.timeToDate(DOMValue).toISOString();
      break;
    case "Date":
    var d = cvAttrTools.shortDateToDate(DOMValue).toISOString();
      this.item[attrView.id] = d;
      //console.log("u", d);
      break;


    case "HasOne":
      //console.log("hasOne", attrView, this.item, DOMValue);
      this.item[attrView.id] = DOMValue;
      if (_.isUndefined(DOMValue) || DOMValue === null || DOMValue.length === 0) {
        this.item[attrView.id] = null;
      }
      break;
    case "HasMany":
      if (_.isUndefined(DOMValue) || DOMValue === null || DOMValue.length === 0) {
        DOMValue = [];
      }
      this.item[attrView.id] = DOMValue;
      break;
    default:
      this.item[attrView.id] = DOMValue;
      break;
    }
  }.bind(this));
};