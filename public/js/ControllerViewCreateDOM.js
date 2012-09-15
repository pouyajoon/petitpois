ControllerView.prototype.createInputForAttr = function(o, attr, attrView, value) {
  //console.log(attrView, attr);
  switch (attrView.type) {
  case "Enum":
    var cbValues = [];
    _.each(attrView.enumValues, function(e) {
      cbValues.push({
        "name": e,
        "value": e
      });
    });
    this.outputComboBox(o, cbValues, value, attrView.id);
    //$("#" +this.getAttrDOMID(attrView.id)).
    break;

  case "HasOne":
    //o.push("<span id='", this.getAttrDOMID(attrView.id), "'></span>");
    //    this.outputComboBox(o, ["hop"], value);
    //$("#" +this.getAttrDOMID(attrView.id)).
    break;
  case "HasMany":
    break;


  case "ExternalItems":
    o.push("<div id='", this.getAttrDOMID(attrView.id), "'></div>");

    // o.push("<ul id='",this.getAttrDOMID(attrView.id),"'>");
    // o.push('</ul>');
    break;
  default:
    o.push("<input class='ui-widget ui-widget-content' id='", this.getAttrDOMID(attrView.id), "' value='", value, "'/>");
    break;
  }
};


ControllerView.prototype.createDOMDoActionsForInput = function() {
  this.browseModelView(this.item, function(attr, attrView, value) {
    switch (attrView.type) {
    case "HasOne":

      this.pp.loadController(attrView.controller, "#empty", function(err, viewController) {
        viewController.getItemsForComboBoxes("name", function(err, cbValues) {
          var o = [];
          this.outputComboBox(o, cbValues, value, attrView.id);
          var containerID = "#" + this.getAttrDOMID(attrView.id) + "-structure div.label";
          $(containerID).after(o.join(''));
          this.setComboBoxes(attrView);
        }.bind(this));
        //console.log(attrView.controller, "loaded");
      }.bind(this));

      break;
    case 'HasMany':
      //console.log(attr, attrView, value);
      this.pp.loadController(attrView.controller, "#empty", function(err, viewController) {
        var filter = {};
        filter[this.name] = this.item._id;

        viewController.getItemsByFilter(filter, function(err, items) {

          var o = [];

          viewController.outputListItems(o, items);
          //listIt(o, viewController.name, items, viewController.outputOne.bind(this));
          //o.push('<ul class="HasMany-list">');

          $('#' + this.getAttrDOMID(attrView.id) + "-structure").append(o.join(''));

          viewController.getAllSetClickEvents(items);

          // $.each(items, function(i, item) {
          //   this.item = item;
          //   $("#" + this.getListItemID()).append('<ul id="' + this.name + 's-' + item._id + '"></ul>');
          //   $("#" + this.getListItemID() + " a").click(function(e) {
          //     console.log("click on", item);
          //     this.getAllSetClickEvents(items);
          //   }.bind(this));

          // }.bind(viewController));

          //o.push('</ul>');
          //console.log(items);
        }.bind(this));

      }.bind(this));

      break;
      // case "ExternalItems":
      //   //o.push("<div id='", this.getAttrDOMID(attrView.id), "'></div>");
      //   // o.push("<ul id='",this.getAttrDOMID(attrView.id),"'>");
      //   // o.push('</ul>');
      //   this.pp.loadController(attr.externalSchema, "#" + this.getAttrDOMID(attrView.id) + "-structure", function(err, viewController) {
      //     console.log(attr.externalSchema, "loaded");
      //   });
      //   break;
    }
  }.bind(this));

};


ControllerView.prototype.getListItemID = function() {
  return "list-item-" + this.getClassDOMID();
};

ControllerView.prototype.createDOMOutputEditAttr = function(container) {
  var o = [];
  o.push("<li class='", this.name, " item-big' id='", this.getClassDOMID() + "'>");
  o.push('<div class="item-actions">');
  o.push("<button class='item-action' id='close-", this.getClassDOMID(), "' data-item-id='", this.item._id, "'>Fermer</button>");
  o.push("<button class='item-action' id='delete-", this.getClassDOMID(), "' data-item-id='", this.item._id, "'>Supprimer</button>");
  o.push('</div>');
  o.push("<ul id='edit-list-", this.getClassDOMID() + "' class='", this.name, " edit-list'>");
  this.browseModelView(this.item, function(attr, attrView, value) {
    o.push("<li id='", this.getAttrDOMID(attrView.id), "-structure' class='", this.getClassDOMID(), "-structure edit-attr'>");
    o.push("<div class='label'>", attrView.displayName, " : </div>");
    this.createInputForAttr(o, attr, attrView, value);
    o.push("</li>");
  }.bind(this));
  o.push("</ul>");
  o.push("</li>");
  $(container).html(o.join(''));
  this.createDOMDoActionsForInput();


};

ControllerView.prototype.setComboBoxes = function(attrView) {
  //combobox().next().children('input')
  //console.log("#" + this.getAttrDOMID(attrView.id));
  $("#" + this.getAttrDOMID(attrView.id)).change(this.update.bind(this)); // attr('id', this.getAttrDOMID(attrView.id)).change(this.update);
};

ControllerView.prototype.createDOMDoJSActions = function() {
  this.browseModelView(this.item, function(attr, attrView, value) {
    switch (attrView.type) {
    case "Time":
      $('#' + this.getAttrDOMID(attrView.id)).timepicker({
        onSelect: this.update.bind(this)
      });
      break;
    case "Enum":
      this.setComboBoxes(attrView);
      break;
    }
  }.bind(this));
};


ControllerView.prototype.createDOMAddJSEditAttrUpdate = function() {

  // UPDATE AFTER FOCUS OUT
  $("#" + this.getClassDOMID() + " .edit-attr input").focusout(function(e) {
    //console.log('focus out');
    this.update();
  }.bind(this));

  
var itemDOMID = "#" + this.getListItemID();
  var item = this.item;
  
  // DELETE ON CLICK ON DELETE BUTTON
  var deleteID = "#delete-" + this.getClassDOMID();
  $(deleteID).click(function(e) {
    var id = $(deleteID).attr('data-item-id');
    this.pp.socket.emit("delete" + this.name + "Item", {
      "controller": this.name,
      "id": id
    }, function(err) {
      this.item = item;
      $("#" + this.getListItemID()).fadeOut(function(){
        $(this).remove();
      });
    }.bind(this));
  }.bind(this));

  // CLOSE EVENT
  var closeID = "#close-" + this.getClassDOMID();
  $(closeID).click(function(e) {
    this.getItem(item, function(err, dbItem) {
      var o = [];
      this.item = dbItem;
      this.getListItemLink(o, dbItem);
      $(itemDOMID).html(o.join(''));
      this.registerClickEditMode();
    }.bind(this));
  }.bind(this));



};



ControllerView.prototype.getListItemLink = function(output, item) {
  output.push('<a>', this.outputOne(output, this.item), '</a>');
};

ControllerView.prototype.outputListItem = function(output) {
  output.push('<li id="', this.getListItemID(), '" class="list-item list-item-', this.name, '">');
  this.getListItemLink(output, this.item);
  output.push('</li>');
}

ControllerView.prototype.outputListItems = function(output, items) {
  output.push('<ul id="', this.name, '-list" class="list">');
  _.each(items, function(item) {
    this.item = item;
    this.outputListItem(output);
  }.bind(this));
  output.push('</ul>');
}


ControllerView.prototype.createDOM = function(data, container) {

  this.item = data.item;
  //console.log(this.item);
  this.createDOMOutputEditAttr(container);
  this.createDOMDoJSActions();
  this.createDOMAddJSEditAttrUpdate();
}