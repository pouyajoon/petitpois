var _ = require('underscore');
var mongoose = require('mongoose');
var pp = require('./../db/ppSchema');

var ControllerAPI = function(model) {
    this.model = model;
    this.modelItem = new this.model();
    this.modelItem.model = model;
    this.modelAttributes = this.getModel();
  };


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
              //  console.log("has one", filter[f], filter[f][i]);
              wfilter[f].push(mongoose.Types.ObjectId(filter[f][i]));
            }
          } else {
            if((typeof filter[f]) === "string") {
              wfilter[f].push(mongoose.Types.ObjectId(filter[f]));

            } else {
              nfilter[f] = filter[f];
            }


          }

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
  //console.log("origin filter", filter, "find filter", nfilter, "where filter ", wfilter);
  // populate results
  for(var attrName in this.modelAttributes) {
    var attr = this.modelAttributes[attrName];
    switch(attr.type) {
    case 'HasOne':
      query = query.populate(attr.name);
      break;
    case 'HasMany':
      query = query.populate(attr.name, null, null, {'sort' : [['order', 1]]});
      break;

    default:
      break;
    }
  }
  query.exec(callback);
};

ControllerAPI.prototype.reorderHasOneControllers = function(parentItem, callback) {
  for(var attrName in this.modelAttributes) {
    var attr = this.modelAttributes[attrName];
    switch(attr.type) {
    case 'HasOne':
      // load has many for parent controller
      //console.log('parentItem', parentItem);
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
  //console.log(filter, item);
  this.getItems(filter, function(err, items) {
    //console.log("items", err, items);
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

    console.log("parent Controller", parentController.model.modelName);
    parentController.getItem({
      '_id': item[attrV.name]
    }, function(err, parentItem) {
      // find new has one item in target
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

ControllerAPI.prototype.updateItem = function(data, callback) {
  console.log("updateItem", data);
  var item = data.item;
  var filter = {
    '_id': item._id
  };
  this.getItem(filter, function(err, dbItem) {
    if(dbItem != null) {
      var models = this.getModel();
      var modelsNum = 0;
      for(var attr in models) {
        if(models.hasOwnProperty(attr)) {
          modelsNum += 1;
        }
      }

      var that = this;
      var attributeUpdatedNum = 1;

      function attributeUpdated() {
        if(attributeUpdatedNum >= modelsNum) {
          console.log("LAST SAVE", dbItem);
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
              console.log("NULL", attr, item);
              dbItem[attr] = null;
              attributeUpdated();
            } else {
              console.log("updateITEM", item, attrV);
              //dbItem[attr] = item[attr//new mongoose.Types.ObjectId(item[attr]);
              this.updateHasOneForItem(attrV, item, data.parentController, attributeUpdated);
              attributeUpdated();
            }

            //console.log("updateITEM TYPEOF", item, attr, typeof(item[attr]), item[attr]);
            break;
          default:
            dbItem[attr] = item[attr];
            //console.log("update")
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

    model.id = model.name;
    models[model.name] = model;
  }.bind(this));
  return models;
};

module.exports = ControllerAPI;