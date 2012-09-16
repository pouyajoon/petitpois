var PetitPoids = function(callback) {
    this.socket = io.connect("http://pouyaair:8081");

    this.socket.on('connect', function(data) {
      //console.log('connected', data);
    });

    $(window).scroll(function() {

      var stop = $(window).scrollTop();
      console.log("scroll", stop);


      if (stop === 0){
        $("#top-menu-container").removeClass('scrolling');
      } else {
        $("#top-menu-container").addClass('scrolling');
      }
    });

    // this.socket.on('data', function(data) {
    //   $.each(data.studients, function(i, s) {
    //     $('body').append(s.name + "</br>");
    //   });
    // }.bind(this));
    this.socket.on('disconnect', function(data) {}.bind(this));
    return callback(this)
  }


PetitPoids.prototype.loadController = function(name, container, callback) {
  //$("head").append('<script type="text/javascript" src="/js/' + name + '.js"></script>');
  $("head").append('<link rel="stylesheet" href="/css/' + name + '.css"/>');

  new window[name](this, container, function(err, viewController) {
    return callback(err, viewController);
  });

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


