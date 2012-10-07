
String.prototype.log = function(){
  console.log(this.toString());
}




$(function() {


//  G_CONTROLLER.log();
  new PetitPoids(function(pp) {
    //console.log(pp.models);
    pp.loadView(G_CONTROLLER);
  });
});

