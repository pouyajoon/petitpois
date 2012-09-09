var moaSchema = require('../db/moaSchema');
//var Ant = require ('./ant');
var _ = require('underscore');

var StudientModel = moaSchema.StudientModel;

StudientModel.prototype.setup = function(_name, callback){
  this.model = StudientModel;
  this.name = _name;
  //console.log("a", this);
  return this.saveToDB(callback);
};

exports.getStudients = function(callback){
	StudientModel.find({}, function(err, studients){
		return callback(null, studients);
	});
};

exports.create = function(_name, callback){
  var studient = new StudientModel();
  //console.log("b");
  return studient.setup(_name, callback);
};


exports.getModel = function(){
  var models = [];
  _.each(DayTemplateModel.schema.paths, function(attr){
    var model = {};
    model.name = attr.path;
    model.type = attr.options.type.name;
    models.push(model);
  });
  return models;
};


exports.Model = StudientModel;