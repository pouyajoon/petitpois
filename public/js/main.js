
String.prototype.log = function(){
  console.log(this.toString());
}



function loadControllerAsMainContent(controller){
      var c = pp.c(controller);
      c.setContainer('#body-container');
      c.getAndOutput({}, "#" + controller + "sList");

}

$(function() {


//  G_CONTROLLER.log();
  new PetitPoids(function(pp) {
    //console.log(pp.models);

    if (!_.isUndefined(G_CONTROLLER) && !_.isUndefined(pp.models[G_CONTROLLER])){
      loadControllerAsMainContent(G_CONTROLLER);
    } else {
      if (_.include(pp.customMenuLinks, G_CONTROLLER)){
        window[G_CONTROLLER](pp);
      }
    }
  });
});

