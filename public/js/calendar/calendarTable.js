var CalendarTable = function() {
    this.id = Math.floor(Math.random() * 9999999999);
    var that = this;
    var daysNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    var monthsNames = ["Janvier", "Février", "Mars", "Avril", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];



    function outputHeader(o) {
      o.push("<tr>");
      for (var i = 0; i < daysNames.length; i += 1) {
        o.push("<th>", daysNames[i], "</th>")
      }
      o.push("</tr>");
    }

    function getFirstDay(theYear, theMonth) {
      var firstDate = new Date(theYear, theMonth, 1)
      return firstDate.getDay()
    }
    // number of days in the month

    function getMonthLen(theYear, theMonth) {
      var oneDay = 1000 * 60 * 60 * 24
      var thisMonth = new Date(theYear, theMonth, 1)
      var nextMonth = new Date(theYear, theMonth + 1, 1)
      var len = Math.ceil((nextMonth.getTime() - thisMonth.getTime()) / oneDay)
      return len
    }

    function outputContentStructure(o) {
      o.push("<tr>");
      // layout 6 rows of fields for worst-case month
      for (var i = 1; i < 43; i++) {
        o.push("<td class='calendar-day' id='", that.id, '-', "day-", i, "'>");
        o.push("<div class='day-header'>", "</div>");
        o.push("<div class='day-body'>", "</div>");
        o.push("</td>");
        if (i % 7 == 0) {
          o.push("</tr><tr>");
        }
      }
    }



    function outputTable() {
      var o = [];
      o.push("<table id='", that.id, "' class='calendar'>");
      outputHeader(o);
      outputContentStructure(o);
      o.push("</table>");
      return o.join('');
    }

    function fillDays(theYear, theMonth) {

      // initialize date-dependent variables
      // which is the first day of this month?
      var firstDay = getFirstDay(theYear, theMonth) + 1;
      // total number of <TD>...</TD> tags needed in for loop below
      var howMany = getMonthLen(theYear, theMonth)

      // set month and year in top field
      //form.oneMonth.value = theMonths[theMonth] + " " + theYear
      // fill fields of table
      
      for (var i = 0; i < 43; i++) {

        var tdID = "#" + that.id + "-day-" + i;
        if (i < firstDay || i >= (howMany + firstDay)) {
          // before and after actual dates, empty fields
          // address fields by name and [index] number
          $(tdID).html("").removeClass("ok");
        } else {
          // enter date values
          var theDay = i - firstDay + 1;
          $(tdID).children(".day-header").html(theDay).addClass("ok");
          var date = new Date(theYear, theMonth - 1, theDay);
          var o = [];
          that.appendInDay(o, i, date);
          $(tdID).children(".day-body").html(o.join(''));
        }
      }

    }


    function appendTable(container) {
      var table = outputTable();
      $(container).append(table);
      that.doJSActions();
    }
    return {
      "appendTable": appendTable,
      "fillDays": fillDays
    };

  };

CalendarTable.prototype.appendInDay = function(o, id, date) {
}

CalendarTable.prototype.doJSActions = function() {
}