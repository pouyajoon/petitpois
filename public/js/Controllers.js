var DayTemplate = function(petitPoids, container, callback) {
    cvTools.heritate(DayTemplate, ControllerView);
    this.init(petitPoids, "DayTemplate", "Journée Type");
    this.attributes = ['name', 'startTime', 'daySteps'];
    return this.setup(container, callback);
  }


DayTemplate.prototype.outputOne = function(dayTemplate) {
  return dayTemplate.name + " - " + dayTemplate.startTime;
}


var DayStep = function(petitPoids, container, callback) {
    cvTools.heritate(DayStep, ControllerView);
    this.init(petitPoids, "DayStep", "Etape");
    this.attributes = ['stepType', 'startTime', 'duration', 'DayTemplate'];
    return this.setup(container, callback);
  }


DayStep.prototype.outputOne = function(item) {
  return "<b>" + item.stepType +"</b> à " + item.startTime.replace(/:/g, "h") + " pendant " + item.duration.replace(/:/g, "h") + "m";// + " - " + item.order;
}

var Studient = function(petitPoids, container, callback) {
    cvTools.heritate(Studient, ControllerView);
    this.init(petitPoids, "Studient", "Etudiant");
    this.attributes = ['firstname', 'lastname'];
    return this.setup(container, callback);
  }


Studient.prototype.outputOne = function(item) {
  return item.firstname + " " + item.lastname;
}

var Skill = function(petitPoids, container, callback) {
    cvTools.heritate(Skill, ControllerView);
    this.init(petitPoids, "Skill", "Compétence");
    this.attributes = ['SkillSubDomain', 'name', 'description'];
    return this.setup(container, callback);
  }

var SkillDomain = function(petitPoids, container, callback) {
    cvTools.heritate(SkillDomain, ControllerView);
    this.init(petitPoids, "SkillDomain", "Domaine");
    this.attributes = ['name', 'SkillSubDomains'];
    return this.setup(container, callback);
  }

var SkillSubDomain = function(petitPoids, container, callback) {
    cvTools.heritate(SkillSubDomain, ControllerView);
    this.init(petitPoids, "SkillSubDomain", "Sous-Domaine");
    this.attributes = ['SkillDomain', 'name', 'skills'];
    return this.setup(container, callback);
  }

