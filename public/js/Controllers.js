var DayTemplate = function() {}

DayTemplate.prototype.outputOne = function(dayTemplate) {
  return dayTemplate.name + " - " + dayTemplate.startTime;
}

var DayStep = function() {}

DayStep.prototype.outputOne = function(item) {
  var startTime = item.startTime && item.startTime.replace(/:/g, "h");
  var duration = item.duration && item.duration.replace(/:/g, "h");
  return "<b>" + item.stepType + "</b> à " + startTime + " pendant " + duration + "m"; // + " - " + item.order;
}

var Studient = function() {}

Studient.prototype.outputOne = function(item) {
  return item.firstname + " " + item.lastname;
}

var Skill = function() {}



Skill.prototype.outputOne = function(item) {
  if (!_.isUndefined(item) && !_.isUndefined(item.name)) {
    return item.name;
  } else {
    return item._id;
  }
}

//$.datepicker.setDefaults($.datepicker.regional["fr"]);

var Day = function() {}
Day.prototype.outputOne = function(item) {
  var date = item.date;
  var o = [];
  if (item.date !== null) {
    //var d = $.datepicker.formatDate('DD, MM d', item.date, {dayNamesShort: $.datepicker.regional['fr'].dayNamesShort, dayNames: $.datepicker.regional['fr'].dayNames, monthNamesShort: $.datepicker.regional['fr'].monthNamesShort, monthNAmes: $.datepicker.regional['fr'].monthNames});
    //console.log(item.date);
    //var d = Date.parse(item.date);
    var dText = $.datepicker.formatDate('D d M', item.date);
    //console.log(d, dText);
    // var d = new Date();
    // d.setDate(item.date);
    // console.log(d, item.date);
    o.push(dText);
    //o.push(item.date);
  }
  if (item.DayTemplate !== null) {
    o.push('<br/>', item.DayTemplate.name);
  }
  if (o.length === 0) {
    o.push("*");
  }
  return o.join('');
};

var SkillSubDomain = function() {}
SkillSubDomain.prototype.outputOne = function(item) {
  return item.name;
}


// var SkillSubDomain = function() {}