var DayStep = function(petitPoids, callback) {
    cvTools.heritate(DayStep, ControllerView);
    this.init(petitPoids, "DayStep", "Etape");
    this.modelView.stepType = cvTools.createModelView('stepType', 'Type de l\'étape', 'String');
    // this.modelView.startTime = cvTools.createModelView('startTime', 'Début de la journée', 'Time');
    return this.setup(callback);
  }


DayStep.prototype.outputOne = function(output, dayTemplate) {
  return dayTemplate._id;
}