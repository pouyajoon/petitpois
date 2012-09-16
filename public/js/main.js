$(function() {

  new PetitPoids(function(pp) {

    pp.getModelControllers();
    if (G_CONTROLLER.length > 0) {
      pp.loadController(G_CONTROLLER, '#body-container', function(err, viewController) {
        viewController.getAll();
      });
    }
  });
});



// function listIt(output, id, data, draw) {
//   output.push('<ul class="', id, '">');
//   _.each(data, function(d) {
//     output.push('<li id="list-item-', id, "-", d._id, '" class="list-item list-item-', id, '">');
//     output.push('<a>', draw(output, d), '</a>');
//     output.push('</li>');
//   });
//   output.push('</ul>');
// }


// function addSkillsInDOM(skills) {
//   var output = [];
//   output.push('<ul>');
//   $.each(skills, function(i, s) {
//     output.push('<li>', s.name);
//     output.push('<ul>');
//     $.each(s.children, function(j, s1) {
//       output.push('<li>', s1.name, "</li>");
//     });
//     output.push('</ul>');
//     output.push('</li>');
//   });
//   output.push('</ul>');
//   $('#skills').append(output.join(""));
// }



// function dateToString(date) {
//   if (date === null) return "00:00";
// }
// function setupDayStep() {
//   $("#addDayStep").click(function(e) {
//     addDayStep();
//   });
// }
// steps = [];
// function addDayStep() {
//   var output = [];
//   var stepID = steps.length + 1;
//   output.push("<li class='dayStep'>");
//   output.push("<ul class='structure'>");
//   output.push("<li class='daystep-structure'><button id='deleteStep-", stepID, "'>Supprimer</button></li>");
//   output.push("<li class='daystep-structure'>Durée de l'étape : <input id='step-", stepID, "'></input></li>");
//   output.push("</ul>");
//   output.push("</li>");
//   $("#steps").append(output.join(''));
//   steps.push($("#step-" + stepID));
//   setTimePicker(stepID);
// }