var moaSchema = require('../db/moaSchema');
var _ = require('underscore');

var DayStepModel = moaSchema.DayStepModel;


DayStepModel.prototype.setup = function(startTime, duration, callback){
  this.model = DayStepModel;
  this.startTime = startTime;
  this.duration = duration;
  return this.saveToDB(callback);
};


exports.create = function(startTime, duration, steps, callback){
  var a = new DayStepModel();
  return a.setup(startTime, duration, function(err, step){
  	steps.push(step);
  	return callback(null, steps, callback);
  });
};