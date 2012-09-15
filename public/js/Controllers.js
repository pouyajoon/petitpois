var DayTemplate = function(petitPoids, container, callback) {
    cvTools.heritate(DayTemplate, ControllerView);
    this.init(petitPoids, "DayTemplate", "Journée Type");
    this.attributes = ['name', 'startTime', 'daySteps'];
    return this.setup(container, callback);
  }


DayTemplate.prototype.outputOne = function(output, dayTemplate) {
  return dayTemplate.name + " - " + dayTemplate.startTime;
}


var DayStep = function(petitPoids, container, callback) {
    cvTools.heritate(DayStep, ControllerView);
    this.init(petitPoids, "DayStep", "Etape");
    this.attributes = ['duration', 'stepType', 'DayTemplate'];
    return this.setup(container, callback);
  }


DayStep.prototype.outputOne = function(output, item) {
  return item.stepType + " (" + item.duration + ")";
}

var Studient = function(petitPoids, container, callback) {
    cvTools.heritate(Studient, ControllerView);
    this.init(petitPoids, "Studient", "Etudiant");

    this.attributes = ['firstname', 'lastname'];
    // this.modelView.name = cvTools.createModelView('name', 'Nom', 'String');
    // this.modelView.firstname = cvTools.createModelView('firstname', 'Prénom', 'String');
    return this.setup(container, callback);
  }


Studient.prototype.outputOne = function(output, item) {
  return item.firstname + " " + item.lastname;
}