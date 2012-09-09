var Studient = function(petitPoids, callback) {
    cvTools.heritate(Studient, ControllerView);
    this.init(petitPoids, "Studient", "Etudiant");
    this.modelView.name = cvTools.createModelView('name', 'Nom', 'String');
    return this.setup(callback);
  }


Studient.prototype.outputOne = function(output, item) {
  return item.name;
}