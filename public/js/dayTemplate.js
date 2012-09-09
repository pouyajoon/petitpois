var DayTemplate = function(petitPoids, callback) {
    cvTools.heritate(DayTemplate, ControllerView);
    this.init(petitPoids, "DayTemplate", "Journée Type");
    this.modelView.name = cvTools.createModelView('name', 'Nom de la journée', 'String');
    this.modelView.startTime = cvTools.createModelView('startTime', 'Début de la journée', 'Time');
    return this.setup(callback);
  }


DayTemplate.prototype.outputOne = function(output, dayTemplate) {
  return dayTemplate.name + "</br>" + dayTemplate.startTime;
}