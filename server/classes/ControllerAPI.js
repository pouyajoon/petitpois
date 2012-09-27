var _ = require('underscore');
var mongoose = require('mongoose');


var ControllerAPI = function(model) {
    this.model = model;
    this.modelItem = new this.model();
    this.modelItem.model = model;
    this.modelAttributes = this.getModel();
  };


ControllerAPI.prototype.getItems = function(filter, callback) {
  console.log("filter", filter);
  var nfilter = {};
  for (var f in filter) {
    if (filter.hasOwnProperty(f)) {
      if (!_.isUndefined(this.modelAttributes[f])) {
        var attr = this.modelAttributes[f];
        switch (attr.type) {
        case "HasOne":
          nfilter[f] = mongoose.Types.ObjectId(filter[f]);
          break;
        default:
          nfilter[f] = filter[f];
          break;
        }
      }
    }
  }
  this.model.find(nfilter).sort("order").exec(callback);
};


ControllerAPI.prototype.getItem = function(item, callback) {
  this.modelItem.getOne({
    '_id': item._id
  }, function(err, dbItem) {
    if (dbItem != null) {
      return callback(err, dbItem);
    }
  });
}

ControllerAPI.prototype.updateItem = function(item, callback) {
  this.modelItem.getOne({
    '_id': item._id
  }, function(err, dbItem) {
    if (dbItem != null) {
      var models = this.getModel();
      for (var attr in models) {
        if (models.hasOwnProperty(attr)) {
          dbItem[attr] = item[attr];
        }
      }
      return dbItem.saveToDB(callback);
    }
  }.bind(this));
};

ControllerAPI.prototype.create = function(callback) {
  var item = new this.model();
  return item.setup(this.model, callback);
};




ControllerAPI.prototype.getModel = function() {
  var models = {};
  _.each(this.model.schema.paths, function(attr) {
    var model = {};
    model.name = attr.path;
    model.type = attr.options.type.name;
    model.displayName = attr.options.displayName;

    if (!_.isUndefined(attr.options.viewType)) {
      model.type = attr.options.viewType;
      model.controller = attr.options.controller;
    }

    model.readOnly = false;
    if (!_.isUndefined(attr.options.readOnly)) {
      model.readOnly = attr.options.readOnly;
    }

    model.hidden = false;
    if (!_.isUndefined(attr.options.hidden)) {
      model.hidden = attr.options.hidden;
    }

    if (model.type === 'ObjectId') {
      model.type = attr.options.viewType;
    }
    if (model.type === "Enum") {
      model.enumValues = attr.enumValues.sort();
    }
    if (model.name === "_id") {
      model.type = 'String';
    }

    model.id = model.name;
    models[model.name] = model;
  }.bind(this));
  return models;
};

module.exports = ControllerAPI;