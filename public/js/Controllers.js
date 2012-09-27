var DayTemplate = function() {}

DayTemplate.prototype.outputOne = function(dayTemplate) {
  return dayTemplate.name + " - " + dayTemplate.startTime;
}

var DayStep = function() {}

DayStep.prototype.outputOne = function(item) {
  var startTime = item.startTime && item.startTime.replace(/:/g, "h") ;
  var duration = item.duration && item.duration.replace(/:/g, "h");
  return "<b>" + item.stepType + "</b> à " + startTime + " pendant " + duration + "m"; // + " - " + item.order;
}

var Studient = function() {}

Studient.prototype.outputOne = function(item) {
  return item.firstname + " " + item.lastname;
}

var Skill = function() {}

Skill.prototype.outputOne = function(item) {
  return item.name;
}

// var SkillDomain = function() {}
// var SkillSubDomain = function() {}