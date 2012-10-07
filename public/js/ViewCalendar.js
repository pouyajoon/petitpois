function ViewCalendar(pp) {


  var dtc = pp.c("DayTemplate");
  dtc.getItemsByFilter({}, function(err, daytemplates) {


    var calendar = CalendarTable();
    calendar.appendInDay = function(o, id, date) {
      o.push("<ul class='small'>");
      _.each(daytemplates, function(dt) {
        var d = date.toPPString();
        o.push("<li id='daytemplate-", id, "' class='calendar-daytemplate'><a href='/ViewFillDay.html?day=", d, "'>", dtc.outputOne(dt), "</a></li>");
      });
      o.push("</ul>");
    }
    calendar.setTable("#body-container");


    calendar.fillDays(2012, 8);

    $(".calendar-daytemplate a").click(function(e) {
      pp.loadPageFromLink("ViewFillDay", this);
      return false;
    });

    // var o = [];
    // o.toULList(calendar.monthsNames, function(i, v, o) {
    //   o.push("id='", v, "' class='calendar-month' data-item-value='", i, "'");
    // });


    // $("#body-container").children().first().before(o.join(''));


    // $(".calendar-month").each(function(i, m){
    //   $(this).on("click", function(e){

    //   });
    // });

  });
}



// Array.prototype.toULList = function(input, liAttributes) {
//   this.openUL();
//   for (var i = 0; i < input.length; i += 1) {
//     this.push("<li ");
//     var idF;
//     var value = input[i];
//     if (!_.isUndefined(liAttributes)) {
//       liAttributes(i, value, this);
//     }
//     this.push(">", value);
//     this.push("</li>");
//   }
//   this.closeUL();
// };


// Array.prototype.openUL = function() {
//   //console.log(this);
//   this.push("<ul>");
// };

// Array.prototype.closeUL = function() {
//   this.push("</ul>");
// };

// Array.prototype.addLI = function(content, id) {
//   this.push("<li");
//   if (!_.isUndefined(id)) {
//     this.push(" id='", id, "' ");
//   }
//   this.push('>');
//   this.push(content, "</li>");
// };