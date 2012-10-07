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



importDays();

function importDays() {
  var year = 2012;


  var school = [];

  function createHoliday(zone, name, year, startMonth, startDay, endMonth, endDay){
    var start = new Date(year, startMonth - 1, startDay, 12, 0, 0);
    var end = new Date(year, endMonth - 1, endDay, 12, 0, 0);
    return {
      "start" : start,
      "end" : end,
      "name" : name
    }
  }

  function getPeriod(date, list){
    //console.log(date);
    var period = _.find(list, function(p){
      //console.log(date, p);
      return date <= p.end && date >= p.start;
    });
    //console.log(date, period);
    if (!_.isUndefined(period)){
      //console.log(period.name);
      return period.name;
    }

    return "Vacances";

  }

  school.push(createHoliday("C", "Pérriode 1", 2012, 9, 4, 10, 27));
  school.push(createHoliday("C", "Pérriode 2", 2012, 11, 12, 12, 22));
  school.push(createHoliday("C", "Pérriode 3", 2013, 1, 7, 3, 2));
  school.push(createHoliday("C", "Pérriode 4", 2013 + 1, 3, 18, 4, 27));
  school.push(createHoliday("C", "Pérriode 5", 2013 + 1, 5, 13, 7, 6));

  var ppSchema = require('./db/ppSchema');

  var className = "Day";
  var model = ppSchema[className + "Model"];
  var cAPI = require("./classes/ControllerAPI");
  var api = new cAPI(model);

  for (var m = 0; m < 12; m += 1) {

    var mlen = getMonthLen(year, m);
    for (var d = 1; d <= mlen; d += 1) {
      (function(d, m) {
        api.create(function(err, item) {
          item.date = new Date(year,m, d, 12, 0, 0);
          //item.date.setFullYear()
          // item.date.setFullYear(year);
          // item.date.setMonth(m);
          // item.date.setMonth(d);
          item.period = getPeriod(item.date, school);
          console.log(item.date);
          item.month = ppSchema.Months[m];
          item.day = d;
          item.year = year;
          item.order = year * 1000 + m * 32 + d;
          item.DayTemplate = null;
          item.saveToDB(function(err, dbitem) {
            //console.log(dbitem);
          });

        });
      }(d, m));
    }

  }

  console.log("done");

}