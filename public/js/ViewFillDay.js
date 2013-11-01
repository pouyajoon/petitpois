var ViewFillDay = function(pp) {

    function removeSearchEngineZone(text) {
      var out = text.replace(/\<span class='pp-item-found'\>/g, '');
      out = out.replace(/\<\/span\>/g, '');
      return out;
    }

    //console.log(pp.urlParams);
    var day = new Date(pp.urlParams.day) || Date.now();
    //var dayTemplateName = "GS 2012";
    var dayTemplateName = pp.urlParams.DayTemplateID;
    // var day = new Date();
    // day.setUTCFullYear(2012);
    // day.setUTCMonth(09);
    // day.setUTCDate(16);
    //console.log(day, dayTemplateName);

    function registerSkillsComboboxes(err, skills) {

      var that = this;

      function createObjectives(daystep, item) {
        var o = [];

        var newInputID = daystep._id + '-' + item._id;
        o.push("<table class='results'><tr><td colspan='2'><h3>", removeSearchEngineZone(item.name), "</h3></td></tr><tr><th>Compétences</th><th>Activités</th></tr>");
        o.push("<tr><td><input id='", newInputID, "'/><ul/></td><td><textarea class='activities'></textarea></td></tr>");
        o.push('</table>');
        var objectiveTag = $("#container-" + daystep._id + " p.results");
        objectiveTag.append(o.join('')).show();
        var input = $('#' + newInputID);
        ppLibs.autocomplete(input, skills, function(nitem) {

          input.next().next().append('<li>' + removeSearchEngineZone(nitem.name) + '</li>');
          //createObjectives(daystep, nitem, that.appendIn);
        });


      }

      //console.log('skills', skills);
      // $.each(skills, function(i, skill) {
      //   skills[i].label = pp.c("Skill").outputOne(skill);
      // });
      _.each(this.daysteps, function(daystep) {
        var id = "#" + daystep._id;

        ppLibs.autocomplete(id, skills, function(item) {
          createObjectives(daystep, item, that.appendIn);
        });

        // $(id).autocomplete({
        //   'minLength': 0,
        //   'source': skills,
        //   'focus': function(event, ui) {
        //     $(id).val(ui.item.label);
        //     return false;
        //   },
        //   'select': function(event, ui) {
        //     $(id).val('');
        //     $("#container-" + daystep._id + " ul").append("<li>" + ui.item.label + "</li>");
        //     return false;
        //   }
        // }).data("autocomplete")._renderItem = function(ul, item) {
        //   return $("<li></li>").data("item.autocomplete", item).append("<a>0" + item.label + "</a>"+"<a>1" + item.label + "</a>"+"<ul><li><a>2" + item.label + "</a></li></ul>").appendTo(ul);
        // };
      });

    }


    function outputDaySteps(err, daysteps) {
      //console.log('daysteps', daysteps);
      var o = [];

      o.push("<h1>", day.toDateString(), "</h1>");
      o.push("<table class='fillDay'>");
      o.push("<tr><th>Début</th><th>Durée</th><th>Type</th><th class='day'>Objectifs</th>");
      //o.push('<th class="day">Activités</th>');
      o.push('</tr>');

      $.each(daysteps, function(i, daystep) {
        o.push("<tr><td>", daystep.startTime, "</td><td>", daystep.duration, "</td><td>", daystep.stepType, "</td>");
        o.push("<td id='container-", daystep._id, "'><div class='search-zone'><input id='", daystep._id, "' type='text' class='search'/></div><p class='results'></p></td>");
        //o.push("<td><textarea class='activities'></textarea></td></tr>");
      });

      o.push("</table>");
      $("#body-container").html(o.join(''));
      pp.c("Skill").getItemsByFilter({
        'Parent': null
      }, registerSkillsComboboxes.bind({
        "daysteps": daysteps
      }));
    }

    var filter = {
      "name": dayTemplateName
    };
    pp.c("DayTemplate").getItemsByFilter(filter, function(err, items) {
      if(items.length > 0) {
        var item = items[0];
        pp.c("DayStep").getItemsByFilter({
          "DayTemplate": item._id
        }, outputDaySteps);
      }
    });
  }



  // $(function() {
  //   new PetitPoids(function(pp) {
  //     ViewFillDay(pp);
  //   });
  // });