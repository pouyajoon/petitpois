var _ = require('underscore');
var mongoose = require('mongoose');
var pp = require('./../db/ppSchema');

var ControllerAPI = function(model) {
    this.model = model;
    this.modelItem = new this.model();
    this.modelItem.model = model;
    this.modelAttributes = this.getModel();
  };


function createControllerAPI(className) {
  var model = pp[className + "Model"];
  var api = new ControllerAPI(model);
  return api;
}

ControllerAPI.prototype.getItems = function(filter, callback) {
  //console.log("filter get items", filter);
  var nfilter = {};
  var wfilter = {};
  for(var f in filter) {
    if(filter.hasOwnProperty(f)) {
      if(f === '_id') {
        //console.log("get id type", typeof filter[f]);
        if((typeof filter[f]) === "string") {
          nfilter[f] = mongoose.Types.ObjectId(filter[f]);
        } else {
          nfilter[f] = filter[f];
        }

      }

      if(!_.isUndefined(this.modelAttributes[f])) {
        var attr = this.modelAttributes[f];
        switch(attr.type) {
        case 'HasOne':
          wfilter[f] = [];
          if(_.isArray(filter[f])) {
            for(var i = 0; i < filter[f].length; i += 1) {
              wfilter[f].push(mongoose.Types.ObjectId(filter[f][i]));
            }
          } else {
            if((typeof filter[f]) === "string") {
              wfilter[f].push(mongoose.Types.ObjectId(filter[f]));
            } else if(filter[f] === null) {
              wfilter[f].push(null);
            } else {
              nfilter[f] = filter[f];
            }
          }
          break;
        case 'Number':
          nfilter[f] = filter[f];
          break;
        default:
          wfilter[f] = filter[f];
          break;
        }
      }
    }
  }


  var query = this.model.find(nfilter).sort('order');
  for(var f in wfilter) {
    if(wfilter.hasOwnProperty(f)) {
      query = query.where(f). in (wfilter[f]);
    }
  }
  //  console.log("origin filter", filter, "find filter", nfilter, "where filter ", wfilter);
  // populate results
  for(var attrName in this.modelAttributes) {
    var attr = this.modelAttributes[attrName];
    switch(attr.type) {
    case 'HasOne':
      query = query.populate(attr.name);
      break;
    case 'HasMany':
      // transform id list to populated object list
      query = query.populate(attr.name, null, null, {
        'sort': [
          ['order', 1]
        ]
      });
      break;
    default:
      break;
    }
  }
  query.exec(function(err, items) {
    // fetch (populate) the children of the HasMany properties which have been populated above
    this.populateHasMany(items, function(err, items) {
      return callback(err, items);
    });
  }.bind(this));
};


ControllerAPI.prototype.populateHasMany = function(items, callback) {



  if(_.isUndefined(items) || items.length === 0) {
    return callback(null, items);
  }

  var modelUpdate = 0;
  var modelsNum = this.getModelAttributesLength();


  var that = this;


  function updateModelAttr() {
    //console.log(that.modelAttributes, modelUpdate);
    var attrName = Object.keys(that.modelAttributes)[modelUpdate];
   // console.log('attr name', attrName);
    var attr = that.modelAttributes[attrName];
    //console.log('attr', attr);
    switch(attr.type) {
    case 'HasMany':
      var c = createControllerAPI(attr.controller);
      var itemUpdated = 1;
      var countItems = items.length;

      //console.log("has many", attr.name, "num items", items.length);

      function itemUpdatedCallback() {
        if(itemUpdated >= countItems) {
          return modelAttributeUpdated();
        }
        itemUpdated += 1;
      }
      // broswe each level 0 item
      for(var i = 0; i < countItems; i += 1) {
        (function(i, aName) {
          var updated = 1;
          var count = items[i][attr.name].length;

          function itemHasManyUpdated() {
            if(updated >= count) {
              return itemUpdatedCallback();
            }
            updated += 1;
          }
          if(count === 0) {
            return itemHasManyUpdated();
          }
          // broswe each has many items
          for(var j = 0; j < count; j += 1) {
            (function(i, j) {
              var filter = {};
              filter._id = items[i][aName][j]._id;
              c.getItem(filter, function(err, nitem) {
                items[i][aName][j] = nitem;
                return itemHasManyUpdated();
              });
            }(i, j));
          }
        }(i, attr.name));
      }
      break;
    default:
      modelAttributeUpdated();
      break;
    }

  }

  function modelAttributeUpdated() {
      //console.log('num', modelsNum, modelUpdate);
    if(modelUpdate >= modelsNum - 1) {

      return callback(null, items);
    }
    modelUpdate += 1;
    updateModelAttr();
  }

  if(items.length === 0) {
    return callback(null, items);
  }
  updateModelAttr();

  //for(var attrName in this.modelAttributes) {
  //}
};


ControllerAPI.prototype.reorderHasOneControllers = function(parentItem, callback) {
  for(var attrName in this.modelAttributes) {
    var attr = this.modelAttributes[attrName];
    switch(attr.type) {
    case 'HasOne':
      // load has many for parent controller
      var filter = {};
      filter[attr.controller] = parentItem._id;
      this.getItems(filter, function(err, items) {
        // reset parent children
        parentItem[this.model.modelName] = [];
        parentItem.save(function(err) {
          // push again children in correct order
          for(var i = 0; i < items.length; ++i) {
            parentItem[this.model.modelName].push(items[i]);
          }
          // save parent
          parentItem.saveToDB(callback);
        }.bind(this));
      }.bind(this));
      break;
    default:
      break;
    }
  }
};

ControllerAPI.prototype.getItem = function(item, callback) {
  var filter = {
    '_id': item._id
  };
  this.getItems(filter, function(err, items) {
    if(items[0] !== null) {
      return callback(err, items[0]);
    }
  });
};



ControllerAPI.prototype.updateHasOneForItem = function(attrV, item, parentControllerData, callback) {
  (function(attrV, modelName, item) {
    // update has many for the target item if required
    // c = target controller
    var parentController = new ControllerAPI(pp[attrV.controller + 'Model']);
    parentController.getItem({
      '_id': item[attrV.name]
    }, function(err, parentItem) {
      // find new has one item in target
      if(_.isUndefined(parentControllerData) || _.isUndefined(parentControllerData.parentAttribute)) {
        return callback({
          error: 'parentAttribute or parentControllerData isUndefined'
        })
      }
      var itemExists = _.find(parentItem[parentControllerData.parentAttribute], function(i) {
        return i._id == item._id;
      });
      // if parent item has a HasMany attribute
      if(_.isUndefined(itemExists) && _.isArray(parentItem[parentControllerData.parentAttribute])) {
        parentItem[parentControllerData.parentAttribute].push(item._id);
        parentItem.saveToDB(function(err) {
          return callback();
        }.bind(this));
      } else {
        return callback();
      }
    }.bind(this));
  }(attrV, this.model.modelName, item));

};

ControllerAPI.prototype.getModelAttributesLength = function() {
  var models = this.getModel();
  var modelsNum = 0;
  for(var attr in models) {
    if(models.hasOwnProperty(attr)) {
      modelsNum += 1;
    }
  }
  return modelsNum;
};

ControllerAPI.prototype.updateItem = function(data, callback) {
  var item = data.item;
  var filter = {
    '_id': item._id
  };
  this.getItem(filter, function(err, dbItem) {
    if(dbItem != null) {

      var models = this.getModel();
      var modelsNum = this.getModelAttributesLength();
      var that = this;
      var attributeUpdatedNum = 1;

      function attributeUpdated() {
        if(attributeUpdatedNum === modelsNum) {
          dbItem.saveToDB(function(err, i) {
            return that.getItem(filter, callback);
          });
        }
        attributeUpdatedNum += 1;
      }
      for(var attr in models) {
        if(models.hasOwnProperty(attr)) {

          var attrV = models[attr];
          switch(attrV.type) {
          case 'HasMany':
            attributeUpdated();
            break;
          case 'HasOne':
            attributeUpdated();

            dbItem[attr] = item[attr];
            if(item[attr] === "null" || item[attr] === null) {
              dbItem[attr] = null;
              attributeUpdated();
            } else {
              this.updateHasOneForItem(attrV, item, data.parentController, attributeUpdated);
              attributeUpdated();
            }
            break;
          default:
            dbItem[attr] = item[attr];
            attributeUpdated();
            break;
          }
        }
      }
    }
  }.bind(this));
};

ControllerAPI.prototype.create = function(callback) {
  var item = new this.model();
  return item.setup(this.model, callback);
};



ControllerAPI.prototype.getModel = function() {
  var models = {};
  _.each(this.model.schema.paths, function(attr) {
    var model = {};
    model.name = attr.path;
    model.type = attr.options.type.name;
    model.displayName = attr.options.displayName;

    if(!_.isUndefined(attr.options.viewType)) {
      model.type = attr.options.viewType;
      model.controller = attr.options.controller;
    }

    model.readOnly = false;
    if(!_.isUndefined(attr.options.readOnly)) {
      model.readOnly = attr.options.readOnly;
    }

    model.hidden = false;
    if(!_.isUndefined(attr.options.hidden)) {
      model.hidden = attr.options.hidden;
    }
    if((typeof attr.options.type) === 'object') {
      model.type = attr.options.type[0].viewType;
      model.controller = attr.options.type[0].controller;
      model.displayName = attr.options.type[0].displayName;

    }

    if(model.type === 'ObjectId') {
      model.type = attr.options.viewType;
    }
    if(model.type === 'Enum') {
      if(!_.isUndefined(attr.options.sortEnumValues) && attr.options.sortEnumValues === true) {
        model.enumValues = attr.enumValues.sort();
      } else {
        model.enumValues = attr.enumValues;
      }
    }
    if(model.name === '_id') {
      model.type = 'String';
    }

    model.search = true;
    if(!_.isUndefined(attr.options.search)) {
      model.search = attr.options.search;
    }

    model.id = model.name;
    models[model.name] = model;
  }.bind(this));
  return models;
};

module.exports = ControllerAPI;