
ControllerView.prototype.update = function() {
  this.updateItemFromDOM();
  //console.log(this.item);
  this.pp.socket.emit("update" + this.name, this.item, function(err, dt) {
    console.log("update api answer", err, this.item);
    if (err) {
      return this.catchError(err);
    }
    this.addMessage("Update done");
  }.bind(this));
};

ControllerView.prototype.updateItemFromDOM = function() {
  this.browseModelView({}, function(attr, attrView, itemValue) {
    var DOMValue = $("#" + this.getAttrDOMID(attrView.id)).val();
    switch (attrView.type) {
    case "Time":
      this.item[attrView.id] = cvAttrTools.timeToDate(DOMValue).toISOString();
      break;
    case "HasOne":
      //console.log("hasOne", attrView, this.item, DOMValue);
      this.item[attrView.id] = DOMValue;
      if (_.isUndefined(DOMValue) || DOMValue.length === 0) {
        this.item[attrView.id] = null;
      }
      break;
    case "HasMany":
      if (_.isUndefined(DOMValue) || DOMValue.length === 0) {
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