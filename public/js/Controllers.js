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
  var o = [];
  if(!_.isUndefined(item) && !_.isUndefined(item.name)) {
    o.push(item.name);
  } else {
    o.push(item._id);
  }
  return o.join('');
}

Skill.prototype.outputOneInMainList = function(item) {
  //console.log(item);
  var o = [];
  if(!_.isUndefined(item) && !_.isUndefined(item.name)) {
    o.push('<label>', item.name, '</label>');
    if(item.Children.length > 0) {
      o.push('  (', item.Children.length, ')');
      o.push("<ul class='list'>");
      for(var i = 0; i < item.Children.length; ++i) {
        o.push("<li>", this.outputOneInMainList(item.Children[i]), '</li>');
      }
      o.push("</ul>");
    }
  } else {
    o.push(item._id);
  }
  return o.join('');
}

Skill.prototype.getMainListFilter = function() {
  return {
    "Parent" : null
  };
};






var Period = function() {}
Period.prototype.outputOne = function(item) {
  return item.name;
};

var Day = function() {}
Day.prototype.outputOne = function(item) {
  if (_.isUndefined(item)){
    return 'none';
  }
  //console.log(item);

  var date = item.date;
  var o = [];
  if(item.date !== null) {
    var dText = $.datepicker.formatDate('D d M', item.date);
    o.push(dText);
  }
  if(!_.isUndefined(item.DayTemplate) && item.DayTemplate !== null) {
    var todayDate = cvAttrTools.dateToShortDate(item.date);
    console.log(item.date, todayDate);
    o.push('<br/>', '<a href="ViewFillDay.html?day=',todayDate,'">', item.DayTemplate.name, '</a>');
  }
  if(o.length === 0) {
    o.push("*");
  }
  return o.join('');
};

var SkillSubDomain = function() {}
SkillSubDomain.prototype.outputOne = function(item) {
  return item.name;
}

