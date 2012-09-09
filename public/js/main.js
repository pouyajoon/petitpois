$(function() {


  if (G_CONTROLLER.length > 0) {

    $("head").append('<script type="text/javascript" src="/js/' + G_CONTROLLER + '.js"></script>');
    $("head").append('<link rel="stylesheet" href="/css/' + G_CONTROLLER + '.css"/>');
  }

  new PetitPoids(function(pp) {

    pp.getModelControllers();
    if (G_CONTROLLER.length > 0) {
      new window[G_CONTROLLER](pp, function(err, viewController) {
        viewController.getAll();
      });
    }
  });
});


function listIt(output, id, data, draw) {
  output.push('<ul class="', id, '">');
  _.each(data, function(d) {
    output.push('<li id="list-item-', id, "-", d._id, '" class="list-item list-item-', id, '">');
    output.push(draw(output, d));
    output.push('</li>');
  });
  output.push('</ul>');
}


function addSkillsInDOM(skills) {
  var output = [];
  output.push('<ul>');
  $.each(skills, function(i, s) {
    output.push('<li>', s.name);
    output.push('<ul>');
    $.each(s.children, function(j, s1) {
      output.push('<li>', s1.name, "</li>");
    });
    output.push('</ul>');
    output.push('</li>');
  });
  output.push('</ul>');
  $('#skills').append(output.join(""));
}

var PetitPoids = function(callback) {
    this.socket = io.connect("http://pouyaair:8081");

    this.socket.on('connect', function(data) {
      //console.log('connected', data);
    });

    // this.socket.on('data', function(data) {
    //   $.each(data.studients, function(i, s) {
    //     $('body').append(s.name + "</br>");
    //   });
    // }.bind(this));
    this.socket.on('disconnect', function(data) {}.bind(this));
    return callback(this)
  }


PetitPoids.prototype.getModelControllers = function() {
  this.socket.emit('getControllers', function(controllers) {
    //console.log(controllers);
    var o = [];
    o.push("<nav class='cleafix' id='top-menu'>");
    _.each(controllers, function(c) {
      var active = (G_CONTROLLER === c) ? "class='active'" : "";
      o.push("<a ", active, " href='/", c, ".html'>", c, "</a>");
    });
    o.push("</nav>");
    $("#top-menu-container").html(o.join(''));
  });
};


function dateToString(date) {
  if (date === null) return "00:00";
}


function setupDayStep() {
  $("#addDayStep").click(function(e) {
    addDayStep();
  });
}

steps = [];

function addDayStep() {
  var output = [];
  var stepID = steps.length + 1;
  output.push("<li class='dayStep'>");
  output.push("<ul class='structure'>");
  output.push("<li class='daystep-structure'><button id='deleteStep-", stepID, "'>Supprimer</button></li>");
  output.push("<li class='daystep-structure'>Durée de l'étape : <input id='step-", stepID, "'></input></li>");
  output.push("</ul>");
  output.push("</li>");

  $("#steps").append(output.join(''));
  steps.push($("#step-" + stepID));
  setTimePicker(stepID);
}


function setTimePicker(stepID) {
  $('#' + stepID).timepickr({
    trigger: 'click',
    convention: 24,
    rangeMin: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'],
    updateLive: true
    //resetOnBlur:false
  });
}