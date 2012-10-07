var ppSchema = require('../db/ppSchema');
var _ = require('underscore');

var DayStepModel = ppSchema.DayStepModel;
var cAPI = require("./ControllerAPI");
var api = new cAPI(DayStepModel);


var DayStepAPI = function() {};

DayStepAPI.prototype.doAfterUpdateAll = function(err, lastItem, parentItem, callback) {
  var item = lastItem;

  console.log("after update all", item);
  if(_.isUndefined(item.DayTemplate)) {
    return callback(err, item);
  }
  var dayTemplateAPI = new cAPI(ppSchema.DayTemplateModel);
  var filter = {
    "_id": item.DayTemplate
  };
  dayTemplateAPI.getItem(filter, function(err, dayTemplateItem) {
    var currentTime = dayTemplateItem.startTime;
    console.log("currentTime", currentTime);
    var items = dayTemplateItem.DayStep;

    var itemsUpdated = 1;
    var itemUpdated = function(err) {
        console.log("orderd", itemsUpdated, err, items.length);
        if(itemsUpdated >= items.length) {
          return dayTemplateAPI.getItem(filter, callback);
        }
        itemsUpdated += 1;
      }
    var i = 0;
    _.each(items, function(dbItem) {
      dbItem.startTime = Date.parse(currentTime.toString());
      currentTime.setTime(currentTime.getTime() + dbItem.duration.getTime());
      dbItem.save(itemUpdated);
      i += 1;
    });
  });
}
exports.API = DayStepAPI;