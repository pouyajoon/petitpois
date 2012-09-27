function ViewCalendar(pp) {


  var dtc = pp.c("DayTemplate");
  dtc.getItemsByFilter({}, function(err, daytemplates) {


    var calendar = CalendarTable();
    calendar.__proto__.appendInDay = function(o, id, date) {
      o.push("<ul class='small'>");
      _.each(daytemplates, function(dt) {
        var d = date.toPPString();
        o.push("<li id='daytemplate-", id, "' class='calendar-daytemplate'><a href='/ViewFillDay.html?day=", d, "'>", dtc.outputOne(dt), "</a></li>");
      });
      o.push("</ul>");
    }

    calendar.__proto__.doJSActions = function() {
      //$(".calendar-daytemplate").each(function(i, li) {});
    }


    calendar.appendTable("#body-container");
    calendar.fillDays(2012, 8);

  });


}