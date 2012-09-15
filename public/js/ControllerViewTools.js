var cvTools = function() {

  }

cvTools.heritate = function(_child, _parent) {
  for (var a in _parent.prototype) {
    if (typeof _child.prototype[a] === "undefined") {
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
  if (_.isUndefined(dateString)) {
    return null;
  }
  var d = new Date(dateString);
  var res = d.toISOString().substring(11, 16);
  return res;
}


cvAttrTools.timeToDate = function(time) {
  var hours = time.substring(0, 2);
  var minutes = time.substring(3);
  var timeDate = new Date(); //Date(0000, 00, 00, hours, minutes, 00);
  timeDate.setTime((hours * 3600 + minutes * 60) * 1000);
  return timeDate;
}