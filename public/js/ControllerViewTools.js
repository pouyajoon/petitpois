var cvTools = function() {

  }

cvTools.heritate = function(_child, _parent) {
  for(var a in _parent.prototype) {
    if(typeof _child.prototype[a] === "undefined") {
      _child.prototype[a] = _parent.prototype[a];
    }
  }
};

cvTools.createModelView = function(id, name, type, readOnly, transformFunctionDBToView) {
  return {
    'id': id,
    'name': name,
    'type': type,
    'readOnly': (_.isUndefined(readOnly) ? false : readOnly)
  };
}


var cvAttrTools = {};

cvAttrTools.dateToTime = function(dateString) {
  if(_.isUndefined(dateString)) {
    return null;
  }
  try {
    var d = new Date(dateString);
    var res = d.toISOString().substring(11, 16);
    return res;
  } catch(e) {
    return dateString;
  }
}


cvAttrTools.dateToShortDate = function(dateString) {
//  debugger;
  //console.log(dateString);
  if(_.isUndefined(dateString)) {
    return null;
  }
  var d = new Date(dateString);
  var res = $.datepicker.formatDate('dd/mm/yy', d);
  //var res = d.toString("yyyy/MM/dd");
  //console.log(res);
  return res;
}


cvAttrTools.shortDateToDate = function(shortDate) {
 // debugger;
  if(_.isUndefined(shortDate) || shortDate === null || shortDate.length === 0) {
    var d = new Date();
    d.setTime(0);
    return d;
  }
  //console.log(shortDate);
  var l = shortDate.split("/");
  //console.log(l[1]);
  var i = parseFloat(l[1]);
  l[1] = i - 1;
  //console.log(i);
  var date = new Date(l[2], l[1], l[0]); //Date(0000, 00, 00, hours, minutes, 00);
  //console.log("d", date);
  return date;
}

// Date.prototype.toPPString = function(){
//   return $.datepicker.formatDate('yy/mm/dd', this);
// }

cvAttrTools.timeToDate = function(time) {
  if(_.isUndefined(time) || time.length === 0) {
    var d = new Date();
    d.setTime(0);
    return d;
  }

  var hours = time.substring(0, 2);
  var minutes = time.substring(3);
  var timeDate = new Date(); //Date(0000, 00, 00, hours, minutes, 00);
  timeDate.setTime((hours * 3600 + minutes * 60) * 1000);
  return timeDate;
}