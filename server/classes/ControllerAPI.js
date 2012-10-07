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
        console.log("get id type", typeof filter[f]);
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
      query = query.populate(attr.name);
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

ControllerAPI.prototype.updateItem = function(item, callback) {
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
            dbItem[attr] = item[attr];
            (function(attrV, modelName, item) {
              var c = new ControllerAPI(pp[attrV.name + 'Model']);
              c.getItem({
                '_id': item[attrV.name]
              }, function(err, hasOneItem) {
                var itemExists = _.find(hasOneItem[modelName], function(i) {
                  return i._id == item._id;
                });
                if(_.isUndefined(itemExists)) {
                  hasOneItem[modelName].push(item._id);
                  hasOneItem.saveToDB(function(err) {
                    attributeUpdated();
                  }.bind(this));
                } else {
                  attributeUpdated();
                }
              }.bind(this));
            }(attrV, this.model.modelName, item));
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

    model.id = model.name;
    models[model.name] = model;
  }.bind(this));
  return models;
};

module.exports = ControllerAPI;