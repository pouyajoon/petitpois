var Studient = function(petitPoids, callback) {
    cvTools.heritate(Studient, ControllerView);
    this.init(petitPoids, "Studient", "Etudient");
    this.modelView.name = cvTools.createModelView('name', 'Nom', 'String');
    this.outputDOMStructure('body');
    return this.setup(callback);
  }


Studient.prototype.outputOne = function(output, item) {
  return item.name;
}