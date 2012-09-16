var moaSchema = require('../db/moaSchema');
var _ = require('underscore');

var DayTemplateModel = moaSchema.DayTemplateModel;


// DayTemplateModel.prototype.setup = function(callback){
//   this.model = DayTemplateModel;
//   this.name = "";
//   this.startTime = null;
//   this.steps = [];

// // this.getOne({"name" : "q"}, function(err, dt){
// // 	console.log(err, dt, "updated DayTemplate");
// // });  

//   return this.saveToDB(callback);
// };


// exports.getItems = function(callback){
// 	DayTemplateModel.find({}, function(err, data){
// 		return callback(null, data);
// 	});
// };

// exports.getModel = function(){
//   var models = [];
//   _.each(DayTemplateModel.schema.paths, function(attr){
//     var model = {};
//     model.name = attr.path;
//     model.type = attr.options.type.name;
//     models.push(model);
//   });
//   return models;
// };

// exports.create = function(callback){
//   var a = new DayTemplateModel();
//   return a.setup(callback);
// };

exports.Model = DayTemplateModel;

//var DataBaseItem = require("./../db/DataBaseItem");
//require('./heritate').implement(DayTemplateModel, DataBaseItem);


// var registerNodes = ["StudientModel", "SkillModel", "DayStepModel", "DayTemplateModel"];


// _.each(registerNodes, function(node){
//   exports[node].prototype.saveToDB = DataBaseItem.prototype.saveToDB;
//   exports[node].prototype.getOne = DataBaseItem.prototype.getOne;
//   exports[node].prototype.hasOne = DataBaseItem.prototype.hasOne;
// });

//DayTemplateModel.prototype.getOne = DataBaseItem.prototype.getOne;

//console.log(DayTemplateModel);

//exports.module = D
