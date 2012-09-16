var moaSchema = require('../db/moaSchema');
var _ = require('underscore');

var DayStepModel = moaSchema.DayStepModel;


// DayStepModel.prototype.setup = function(startTime, duration, callback){
//   this.model = DayStepModel;
//   this.startTime = startTime;
//   this.duration = duration;
//   return this.saveToDB(callback);
// };
// exports.create = function(startTime, duration, steps, callback){
//   var a = new DayStepModel();
//   return a.setup(startTime, duration, function(err, step){
//    steps.push(step);
//    return callback(null, steps, callback);
//   });
// };
var cAPI = require("./ControllerAPI");
var api = new cAPI(DayStepModel);


var DayStepAPI = function() {

  };


//var mongoose = require('mongoose');
DayStepAPI.prototype.doCustomActionAfterSave = function(err, item, callback) {

  if (_.isUndefined(item.DayTemplate)) {
    return callback(err, item);
  }



  var dayTemplateAPI = new cAPI(moaSchema.DayTemplateModel);
  var filter = {
    "_id": item.DayTemplate
  };
  dayTemplateAPI.getItem(filter, function(err, dayTemplateItem) {
    var currentTime = dayTemplateItem.startTime;
    console.log("currentTime", currentTime);


    filter = {
      "DayTemplate": item.DayTemplate.toString()
    };
    api.getItems(filter, function(err, items) {

      var itemsUpdated = 1;
      var itemUpdated = function(err) {
          console.log(itemsUpdated, err);
          if (itemsUpdated >= items.length) {
            return callback(null, item);
          }
          itemsUpdated += 1;
        }

        var i = 0;
      _.each(items, function(dbItem) {
        if (i === 0){
          dbItem.startTime = currentTime;
        } else {
          var newTime = new Date();
          newTime.setTime(currentTime.getTime() + dbItem.duration.getTime());
    
          dbItem.startTime = newTime;

        }
        
        
        currentTime = dbItem.startTime;
//        console.log("newTime", newTime, "start time", dbItem.startTime);
        if (item._id === dbItem._id){
          item.startTime = dbItem.startTime;          
        }

        dbItem.save(itemUpdated);
        i += 1;
      });

      //console.log(items);
    });
  });


}

exports.API = DayStepAPI;