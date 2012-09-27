var ViewFillDay = function(pp) {




    var day = new Date(pp.urlParams.day) || Date.now();
    //var dayTemplateName = "GS 2012";
    var dayTemplateName = pp.urlParams.DayTemplateID;
    // var day = new Date();
    // day.setUTCFullYear(2012);
    // day.setUTCMonth(09);
    // day.setUTCDate(16);
    

    //console.log(day, dayTemplateName);

    function registerSkillsComboboxes(err, skills) {

      $.each(skills, function(i, skill) {
        skills[i].label = pp.c("Skill").outputOne(skill);
      });

      _.each(this.daysteps, function(daystep) {
        var id = "#" + daystep._id;
        $(id).autocomplete({
          'minLength': 0,
          'source': skills,
          'focus': function(event, ui) {
            $(id).val(ui.item.label);
            return false;
          },
          'select': function(event, ui) {
            $(id).val('');

            $("#container-" + daystep._id + " ul").append("<li>" + ui.item.label + "</li>");
            return false;
          }
        }).data("autocomplete")._renderItem = function(ul, item) {
          return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
        };
      });

    }


    function outputDaySteps(err, daysteps) {
      //console.log(daysteps);

      var o = [];

      o.push("<h1>", day.toDateString(), "</h1>");
      o.push("<table class='fillDay'>");
      o.push("<tr><th>Début</th><th>Durée</th><th>Type</th><th class='day'>Compétences</th><th class='day'>Activités</th></tr>");

      $.each(daysteps, function(i, daystep) {
        o.push("<tr><td>", daystep.startTime, "</td><td>", daystep.duration, "</td><td>", daystep.stepType, "</td>");
        o.push("<td id='container-", daystep._id, "'><input id='", daystep._id, "' type='text' class='search'/><p><ul/></[></td>");
        o.push("<td><textarea class='activities'></textarea></td></tr>");
      });

      o.push("</table>");
      $("#body-container").html(o.join(''));
      pp.c("Skill").getItemsByFilter({}, registerSkillsComboboxes.bind({
        "daysteps": daysteps
      }));
    }

    var filter = {
      "name": dayTemplateName
    };
    pp.c("DayTemplate").getItemsByFilter(filter, function(err, items) {
      var item = items[0];
      pp.c("DayStep").getItemsByFilter({
        "DayTemplate": item._id
      }, outputDaySteps);
    });
  }



// $(function() {

//   new PetitPoids(function(pp) {

//     ViewFillDay(pp);
//   });
// });