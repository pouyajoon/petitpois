ControllerView.prototype.createInputForAttr = function(o, attrView, value) {
  switch(attrView.type) {
  case "Enum":
    this.outputComboBox(o, this.EnumValuesToComboboxList(attrView.enumValues), value, attrView.id);
    break;
  case "HasOne":
    break;
  case "HasMany":
    break;
  default:
    var readOnly = "";
    if(attrView.readOnly === true) {
      readOnly = " readonly='readonly' ";
    }
    o.push("<input type='text' ", readOnly, " class='ui-widget ui-widget-content' id='", this.getAttrDOMID(attrView.id), "' value=\"", value, "\"/>");
    break;
  }
};

ControllerView.prototype.EnumValuesToComboboxList = function(values) {
  var cbValues = [];
  _.each(values, function(e) {
    cbValues.push({
      "name": e,
      "value": e
    });
  });
  return cbValues;
};


ControllerView.prototype.createDOMDoActionsForOneInput = function(attr, attrView, value, callback) {

  switch(attrView.type) {
  case "HasOne":

    var view = this.pp.c(attrView.controller);

    view.getItemsForComboBoxes("name", function(err, cbValues) {
      var o = [];
      this.outputComboBox(o, cbValues, value, attrView.id);
      var containerID = "#" + this.getAttrDOMID(attrView.id) + "-structure div.label";
      $(containerID).after(o.join(''));
      this.setComboBoxes(attrView);
    }.bind(this));

    break;
  case 'HasMany':
    var viewController = this.pp.c(attrView.controller);

    var filter = {};
    filter[this.name] = this.item._id;
    viewController.containerControllerID = this.name;


    //viewController.getItemsByFilter(filter, function(err, items) {
    //console.log(this.item);
    items = this.item[viewController.name];
    //console.log(items.length, items);
    items = viewController.applyDBToViewTransformationsForItems(items);
    var options = [];
    options.push("<li class='has-many-options'>");
    viewController.outputControllerActionButtons(options, this.getAttrDOMID(attrView.id));
    options.push("</li>")


    var o = [];
    viewController.outputListItems(o, items, this.getAttrDOMID(attrView.id), options.join(''));
    $('#' + this.getAttrDOMID(attrView.id) + "-structure").append(o.join(''));
    var f = {
      "name": this.name,
      "value": filter[this.name]
    };
    viewController.registerAddEvent(this.getAttrDOMID(attrView.id), [f]);
    viewController.getAllSetClickEvents(items);



    $("#list-" + this.getAttrDOMID(attrView.id)).sortable("cancel");


    $("#list-" + this.getAttrDOMID(attrView.id)).sortable({
      "stop": function(s) {
        var orderedItems = [];
        $("#list-" + this.getAttrDOMID(attrView.id) + " li.list-item").each(function(order, li) {
          var oItem = {
            "_id": $(li).attr("data-item-id"),
            "order": order
          };
          orderedItems.push(oItem);
        }.bind(this));
        viewController.updateAll(orderedItems, function(err) {
          viewController.addMessage("Update all done.")
          var s = $('#' + this.getAttrDOMID(attrView.id) + "-structure");
          s.css('height', s.height() + "px");
          $('#' + this.getAttrDOMID(attrView.id) + "-structure").children().last().remove();

          //console.log("filter order", filter);
          //}
          //viewController.getItem(filter, 
          this.getItem({"_id" : this.item._id}, function(err, nitem) {
            //console.log("new item", nitem);
            this.item[viewController.name] = nitem[viewController.name];
            this.createDOMDoActionsForOneInput(attr, attrView, value, function() {
              s.attr('style', '');

            });

          }.bind(this));



        }.bind(this));
      }.bind(this)
    }).bind(this);

    delete this.pp.models[this.name]["guid"];

    if(!_.isUndefined(callback)) {
      return callback();
    }

    break;
  }


  if(attrView.hidden === true) {
    $('#' + this.getAttrDOMID(attrView.id) + "-structure").hide();
  }

};

ControllerView.prototype.createDOMDoActionsForInput = function() {
  this.browseModelView(this.item, function(attr, attrView, value) {
    this.createDOMDoActionsForOneInput(attr, attrView, value);
  }.bind(this));
};

ControllerView.prototype.getListItemID = function() {
  return "list-item-" + this.getClassDOMID();
};

ControllerView.prototype.createDOMOutputEditAttr = function(container) {
  var o = [];
  o.push("<div class='", this.name, " item-big' id='", this.getClassDOMID() + "'>");
  o.push("<ul id='edit-list-", this.getClassDOMID() + "' class='", this.name, " edit-list'>");

  o.push('<li class="item-actions">');
  o.push("<button class='item-action' id='close-", this.getClassDOMID(), "' data-item-id='", this.item._id, "'>Fermer</button>");
  o.push("<button class='item-action item-action-delete' id='delete-", this.getClassDOMID(), "' data-item-id='", this.item._id, "'>Supprimer</button>");
  o.push('</li>');



  //o.push("<li class='item-name'>", this.outputOne(this.item), "</li>");
  this.browseModelView(this.item, function(attr, attrView, value) {

    o.push("<li id='", this.getAttrDOMID(attrView.id), "-structure' class='", this.getClassDOMID(), "-structure edit-attr ");
    if(attrView.name === "order") {
      o.push(" pp-hidden-attr ");
    }
    o.push("'>");
    o.push("<div class='label'>", attrView.displayName, " : </div>");
    this.createInputForAttr(o, attrView, value);
    o.push("</li>");
  }.bind(this));


  o.push("</ul>");
  o.push("</div>");
  $(container).html(o.join(''));

  this.createDOMDoActionsForInput();

};

ControllerView.prototype.outputDOMEditAttr = function(first_argument) {
  // body...
};

ControllerView.prototype.setComboBoxes = function(attrView) {
  $("#" + this.getAttrDOMID(attrView.id)).combobox().change(this.update.bind(this)); // attr('id', this.getAttrDOMID(attrView.id)).change(this.update);
};

ControllerView.prototype.createDOMDoJSActions = function() {

  this.browseModelView(this.item, function(attr, attrView, value) {


    //console.log(attrView);
    switch(attrView.type) {
    case "Time":
      if(!attrView.readOnly) {
        $('#' + this.getAttrDOMID(attrView.id)).timepicker({
          onSelect: this.update.bind(this)
        });
      }
      break;
    case "Date":
      if(!attrView.readOnly) {
        $('#' + this.getAttrDOMID(attrView.id)).datepicker({
          onChange: this.update.bind(this)
        }).datepicker("option", "showAnim", "drop").datepicker("option", "dateFormat", "dd/mm/yy").datepicker("setDate", value);
      }
      break;
    case "Enum":
      this.setComboBoxes(attrView);
      break;
    default:
      // UPDATE AFTER FOCUS OUT
      $("#" + this.getAttrDOMID(attrView.id)).focusout(function(e) {
        this.update();
      }.bind(this));

    }
  }.bind(this));


};


ControllerView.prototype.createDOMAddJSEditAttrUpdate = function() {
  

  var itemDOMID = "#" + this.getListItemID();

  var item = this.item;
  //console.log("register items options : itemDOMID", itemDOMID, this.containerControllerID);
  // DELETE ON CLICK ON DELETE BUTTON
  var deleteID = "#delete-" + this.getClassDOMID();


  $(deleteID).click(function(e) {
    var id = $(deleteID).attr('data-item-id');
    this.pp.socket.emit("delete" + this.name + "Item", {
      "controller": this.name,
      "id": id
    }, function(err) {
      this.item = item;
      $("#" + this.getListItemID()).remove();
    }.bind(this));
  }.bind(this));


  // CLOSE ON CLICK ON CLOSE BUTTON
  var closeID = "#close-" + this.getClassDOMID();
  $(closeID).click(function(e) {
    this.update(function(err, dbItem) {
      var o = [];
      this.item = dbItem;
      this.getListItemLink(o, dbItem);
      $(itemDOMID).html(o.join(''));
      this.registerClickEditMode();
    }.bind(this));

    // this.getItem(item, function(err, dbItem) {
    // }.bind(this));
  }.bind(this));
};



ControllerView.prototype.getListItemLink = function(output, item) {
  var o = this.outputOne(item).trim();
  if(o.length === 0) {
    o = item._id;
  }

  output.push('<a>', o, '</a>');
};

ControllerView.prototype.outputListItem = function(output) {
  output.push('<li data-item-id="', this.item._id, '" id="', this.getListItemID(), '" class="list-item list-item-', this.name, '">');
  this.getListItemLink(output, this.item);
  output.push('</li>');
}

ControllerView.prototype.outputListItems = function(output, items, id, firstLine) {
  output.push('<ul id="list-', id, '" class="list">');
  if(!_.isUndefined(firstLine)) {
    output.push(firstLine);
  }
  _.each(items, function(item) {
    this.item = item;
    this.outputListItem(output);
  }.bind(this));
  output.push('</ul>');
}


ControllerView.prototype.createDOM = function(data, container) {

  this.item = data.item;

  this.createDOMOutputEditAttr(container);

  this.createDOMDoJSActions();
  this.createDOMAddJSEditAttrUpdate();

  if(!_.isUndefined(this.containerControllerID)) {
    //$("#" + this.getClassDOMID() + "-" + this.containerControllerID + "-structure").hide();
  }

}