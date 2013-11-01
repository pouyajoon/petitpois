  var ppSchema = require('./db/ppSchema');

  var mongoose = require("mongoose");
  mongoose.connect('mongodb://localhost/pp');

  //mongoose.disconnect();
  // var Studient = require ('./classes/studient');
  // var Skill = require ('./classes/skill');
  // var DayStep = require ('./classes/dayStep');

  function err(err, e) {
    console.log("ERROR", err, e);
  }

  function end() {
    mongoose.disconnect();
  };


  var Step = require('common').step;
  var _ = require('underscore');

  // var steps = [];
  // var date = new Date(0000, 00, 00, 09, 30, 00);
  // var duration = new Date(0000, 00, 00, 00, 15, 00);
  // //console.log(date, duration);
  // Step([
  //  function(next){ DayStep.create(date, duration, steps, end); }
  //  // function(steps, next, b) {
  //  //  console.log(steps, next, b);
  //  // }
  // ]);
  // DayStep.create(Date.now(), 15, steps, function(err, step, steps){
  //    console.log("steps end", steps);
  //    end();
  //  })
  // Step([
  //     function(next){ Skill.create("s1", next); },
  //     function(next){ Skill.create("s2", next); },
  //     function(next){ Skill.create("s3", next); },
  //     function(next){ Skill.create("s4", next); },
  //     function(next){ Skill.createChildrenAndAddToParent("s1", "s1_1", next); },
  //     function(next){ Skill.createChildrenAndAddToParent("s1", "s1_2", next); },
  //     function(next){ Skill.createChildrenAndAddToParent("s1_1", "s1_1_1", next); },
  //     function(next){ Skill.create("s5", end); }
  // ]);
  //  Step([
  //    function(next){ Studient.create("Jeanne", next); },
  //    function(next){ Studient.create("Pouya", end); }
  // ]);

  function getMonthLen(theYear, theMonth) {
    var oneDay = 1000 * 60 * 60 * 24
    var thisMonth = new Date(theYear, theMonth, 1)
    var nextMonth = new Date(theYear, theMonth + 1, 1)
    var len = Math.ceil((nextMonth.getTime() - thisMonth.getTime()) / oneDay)
    return len
  }


  var ppSchema = require('./db/ppSchema');
  var className = "Day";
  var model = ppSchema[className + "Model"];
  var cAPI = require("./classes/ControllerAPI");
  var dayApi = new cAPI(model);
  var periodApi = new cAPI(ppSchema["PeriodModel"]);


  function createPeriod(zone, name, year, startMonth, startDay, endMonth, endDay, order, callback) {
    var start = new Date(year, startMonth - 1, startDay, 12, 0, 0);
    var end = new Date(year, endMonth - 1, endDay, 12, 0, 0);
    periodApi.create(function(err, item) {
      item.startDate = start;
      item.endDate = end;
      item.name = name;
      item.order = order;
      item.saveToDB(callback);
    });
  }



  Step([

  function(next) {
    createPeriod("C", "Période 1", 2012, 9, 4, 10, 27, 0, next);
  }, function(next) {
    createPeriod("C", "Période 2", 2012, 11, 12, 12, 22, 1, next);
  }, function(next) {
    createPeriod("C", "Période 3", 2013, 1, 7, 3, 2, 2, next);
  }, function(next) {
    createPeriod("C", "Période 4", 2013, 3, 18, 4, 27, 3, next);
  }, function(next) {
    createPeriod("C", "Période 5", 2013, 5, 13, 7, 6, 4, function() {
      // importDays(2012);
      // importDays(2013);
    });
  }]);



  function importDays(year) {
    function getPeriod(date, callback) {
      periodApi.model.find().where("startDate").lte(date).where("endDate").gte(date).exec(function(err, items) {
        if(items.length === 1) {
          return callback(null, items[0]);
        } else {
          return callback(null, null);
        }
      });
    }

    for(var m = 0; m < 12; m += 1) {

      var mlen = getMonthLen(year, m);
      for(var d = 1; d <= mlen; d += 1) {
        (function(d, m) {
          dayApi.create(function(err, item) {
            item.date = new Date(year, m, d, 12, 0, 0);
            item.month = ppSchema.Months[m];
            item.day = d;
            item.year = year;
            item.order = year * 1000 + m * 32 + d;
            item.DayTemplate = null;
            getPeriod(item.date, function(err, p) {
              if(p != null) {
                item.Period = p._id.toString();
              } else {
                item.Period = null;
              }
              var d = {};
              d.item = item;
              dayApi.updateItem(d, function(err, i) {
                console.log(item.date);
              });
            });
          });
        }(d, m));
      }

    }

    //console.log("done");
  }