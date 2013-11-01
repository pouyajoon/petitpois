ControllerView.prototype.setupSearch = function(output) {
  //return;
  output.push("<ul class='pp-search-zone'>");
  this.browseModelView(this.item, function(attr, attrView, value) {
    this.item._id = 'pp-search-zone';
    var o = [];
    switch (attrView.type) {
    case "Enum":
      o.push("<li data-attr-name='", attrView.name, "'>");
      var values = this.EnumValuesToComboboxList(attrView.enumValues);
      this.outputCheckBox(o, values, value, attrView.id);
      o.push("</li>");
      break;
    case "HasOne":
      var view = this.pp.c(attrView.controller);
      console.log(attrView);
      if (!_.isUndefined(attrView.search) && attrView.search === false){
        break;
      }
      view.getItemsForComboBoxes("name", function(err, cbValues) {
        var o = [];
        o.push("<li data-attr-name='", attrView.name, "'>");
        this.outputCheckBox(o, cbValues, value, attrView.id);
        o.push("</li>");
        var zone = $(o.join(''));
        zone.on('change', this.searchFilterHasChanged.bind(this));
        $("ul.pp-search-zone").append(zone).buttonset();
      }.bind(this));
      break;
    }
    output.push(o.join(''));
  }.bind(this));
  output.push('</ul>');

};


ControllerView.prototype.getSearchFilter = function() {

  var filter = {};
  $(".pp-search-zone div.checkbox input:checked").map(function(val, i) {
    //console.log(this, val, i);
    var name = $(this).parent().parent().attr('data-attr-name');
    //var val = $(this).val();
    if (_.isUndefined(filter[name])) {
      filter[name] = [];
    }
    //if (val )
    filter[name].push($(this).attr('data-cb-value'));
    // if (val !== "") {
    //   filter[name] = val;
    // }
  });
  return filter;
};

ControllerView.prototype.searchFilterHasChanged = function(e) {
  this.getAndOutput(this.getSearchFilter(), "#" + this.name + "sList");
};

ControllerView.prototype.addJSActionsForSearchItems = function() {
  $(".pp-search-zone input").on('change', this.searchFilterHasChanged.bind(this));
  $('.checkbox').buttonset();
};