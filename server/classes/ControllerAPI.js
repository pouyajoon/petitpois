var _ = require('underscore');
var mongoose = require('mongoose');


var ControllerAPI = function(model) {
    this.model = model;
  };

ControllerAPI.prototype.getItems = function(filter, callback) {
  console.log("filter", filter);

  var nfilter = {};
  var model= this.getModel();
  for (var f in filter){
    if (filter.hasOwnProperty(f)){
      if (!_.isUndefined(model[f])){
        var attr = model[f];
        switch(attr.type){
          case "HasOne" :
            nfilter[f] = mongoose.Types.ObjectId(filter[f]);
          break;
          default :
          nfilter[f] = filter[f];
          break;
        }
      }
    }
  }

  console.log("nfilter", nfilter); 

  this.model.find(nfilter, function(err, items) {
    console.log('res', items, err);
    return callback(null, items);
  });
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