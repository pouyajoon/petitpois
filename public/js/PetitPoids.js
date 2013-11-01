var PetitPoids = function(callback) {
  this.socket = io.connect("http://localhost:8081");

  this.customMenuLinks = ["ViewFillDay", 'ViewSetClasses'];


  this.getURLParams = getURLParams;
  this.urlParams = this.getURLParams();

  this.socket.on('connect', function(data) {
    this.loadModelControllers(function(controllers) {
      this.outputMenu(G_CONTROLLER);
      return this.getModels(null, callback);
    }.bind(this));
  }.bind(this));

  setupScroll();

  this.socket.on('disconnect', function(data) {}.bind(this));


  // function initDefaultViews(err, callback) {
  //   _.each(this.controllers, function(cname) {
  //     //window[cname] = new ControllerView();
  //   }.bind(this));
  // }

  function setupScroll() {
    $(window).scroll(function() {

      var stop = $(window).scrollTop();
      //console.log("scroll", stop);
      if (stop === 0) {
        $("#top-menu-container").removeClass('scrolling');
      } else {
        $("#top-menu-container").addClass('scrolling');
      }
    });
  }

  function getURLParams() {
    var match, pl = /\+/g,
      // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function(s) {
        return decodeURIComponent(s.replace(pl, " "));
      },
      query = window.location.search.substring(1),
      urlParams = {};

    while (match = search.exec(query))
      urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
  }
}


PetitPoids.prototype.loadControllerAsMainContent = function(controller) {
  var c = this.c(controller);
  c.setContainer('#body-container');
  var filter = {};
  if (!_.isUndefined(c.getMainListFilter)) {
    filter = c.getMainListFilter();
  }
  c.getAndOutput(filter, "#" + controller + "sList");
}

// PetitPoids.prototype.loadController = function(name, container, callback) {
//   $("head").append('<link rel="stylesheet" href="/css/' + name + '.css"/>');
//   new window[name](this, container, function(err, viewController) {
//     return callback(err, viewController);
//   });
// }


PetitPoids.prototype.loadView = function(controller) {
  if (!_.isUndefined(controller) && !_.isUndefined(this.models[controller])) {
    this.loadControllerAsMainContent(controller);
  } else {
    if (_.include(this.customMenuLinks, controller)) {
      window[controller](this);
    }
  }
};

PetitPoids.prototype.getModels = function(err, callback) {
  this.socket.emit('getModels', {}, function(err, models) {
    this.models = models;
    _.each(this.controllers, function(cname) {
      if (!_.isUndefined(window[cname])) {
        cvTools.heritate(window[cname], ControllerView);
      }
    });
    return callback(this);
  }.bind(this));

}


PetitPoids.prototype.c = function(cname) {
  var controller;
  if (_.isUndefined(window[cname])) {
    controller = new ControllerView();
  } else {
    controller = new window[cname]();
  }
  controller.init(this, cname, cname);
  return controller;
}


PetitPoids.prototype.loadModelControllers = function(callback) {
  this.socket.emit('getControllers', function(controllers) {
    this.controllers = controllers;
    return callback(controllers);
  }.bind(this));

}

PetitPoids.prototype.outputMenu = function(menuActive) {
  var o = [];
  o.push("<nav class='cleafix' id='top-menu'>");
  _.each(this.controllers, function(c) {
    var active = (menuActive === c) ? "class='active'" : "";
    o.push("<a ", active, " href='/", c, ".html'>", c, "</a>");
  });
  _.each(this.customMenuLinks, function(c) {
    var active = (menuActive === c) ? "class='active'" : "";
    o.push("<a ", active, " href='/", c, ".html'>", c, "</a>");
  });


  o.push("</nav>");
  $("#top-menu-container").html(o.join(''));

  var that = this;
  $("nav a").click(function(e) {
    var title = $(this).html();
    that.loadPageFromLink(title, this);
    return false;
  });

  window.onpopstate = this.onpopstate.bind(this);
};


PetitPoids.prototype.onpopstate = function(event) {
  //console.log("event", event, event.state);
  if (event.state !== null) {
    this.loadPage(event.state.controller, event.state.url, false);
  }

};

PetitPoids.prototype.loadPage = function(controller, url, pushHistoryState) {
  var pushState = true;
  if (!_.isUndefined(pushHistoryState)) {
    pushState = pushHistoryState;
  }
  $("nav a.active").removeClass("active");
  //console.log(url);
  $("nav a").filter(function(i) {
    return $(this).text() === controller;
  }).addClass("active");
  if (pushState) {
    var state = {
      "controller": controller,
      "url": url
    };
    window.history.pushState(state, controller, url);
  }
  this.urlParams = this.getURLParams();
  this.loadView(controller);
};

PetitPoids.prototype.loadPageFromLink = function(controller, sourceLink) {
  var url = $(sourceLink).attr('href');
  this.loadPage(controller, url);
};