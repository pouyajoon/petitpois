var _ = require('underscore');

var ControllerAPI = function(model){
  this.model = model;
};

ControllerAPI.prototype.getItems = function(callback){
  this.model.find({}, function(err, studients){
    return callback(null, studients);
  });
};

ControllerAPI.prototype.create = function(callback){
  var item = new this.model();
  return item.setup(this.model, callback);
};


ControllerAPI.prototype.getModel = function(){
  var models = [];
  //console.log(this.model.schema.paths);
  _.each(this.model.schema.paths, function(attr){
    var model = {};
    model.name = attr.path;
    model.type = attr.options.type.name;
    if (!_.isUndefined(attr.enumValues)){
      model.enumValues = attr.enumValues;
      model.type = "Enum";

    }
    models.push(model);
  });
  console.log(models);
  return models;
};

module.exports = ControllerAPI;