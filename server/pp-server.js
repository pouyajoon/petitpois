var express = require('express');
var _ = require('underscore');
//var libAuth = require ('./classes/autentication');
//var User = require('./classes/user.js');
var Server = require('./lib/Server.js');
//var Game = require('./classes/game');
// var pageZoom = {"path" : "/zoom", "view" : "game/home.jade", "login" : libAuth.requireLogin, "renderOptions" : {"drawMode" : 'zoom'}};
// var pageMap = {"path" : "/map", "view" : "game/home.jade", "renderOptions" : {"drawMode" : 'map'}};
//var pageHome = {"path" : "/", "view" : "home.jade", "login" : libAuth.requireLogin, "renderOptions" : {"drawMode" : 'map'}};
// var pageAddDayTemplate = {
//   'path': '/dayTemplate',
//   'view': 'dayTemplate.jade',
//   'renderOptions': {
//     'drawMode': 'map'
//   }
// };
var pageController = {
  'path': '/:controller\.html',
  'view': 'home.jade'
};

var pageHome = {
  'path': '/',
  'view': 'home.jade'
};

// var pageFillDay = {
//   'path': '/fillDay',
//   'view': 'fillDay.jade'
// };
// var pageTest = {"path" : "/test", "view" : "test/test.jade", "renderOptions" : {"drawMode" : 'map'}};
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pp');

var serverOptions = {
  port: 8081,
  paths: [pageHome, pageController]
};
//pageAddDayTemplate
console.log('hi');



function getModels(ppSchema) {
  var models = {};
  _.each(ppSchema.modelControllers, function(className) {
    var model = ppSchema[className + "Model"];
    var cAPI = require("./classes/ControllerAPI");
    var api = new cAPI(model);

    models[className] = api.getModel();
  });
  return models;
}

new Server(serverOptions, function(err, _server) {
  console.log('game initialized, error : ', err);
  var ppSchema = require('./db/ppSchema');


  _server.io.sockets.on('connection', function(socket) {
    //console.log('connected');
    socket.on('getControllers', function(callback) {
      //console.log("getControllers", ppSchema.modelControllers);
      return callback(ppSchema.modelControllers);
    });

    socket.on('getModels', function(data, callback) {
      var models = getModels(ppSchema);
      return callback(null, models);
    });


    _.each(ppSchema.modelControllers, function(className) {

      var model = ppSchema[className + "Model"];
      var cAPI = require("./classes/ControllerAPI");
      var api = new cAPI(model);



      //var classFile = require('./classes/' + className);
      socket.on('delete' + className + 'Item', function(data, callback) {
        var id = data.id;
        var classInstance = new model();
        classInstance.model = model;
        classInstance.getOne({
          '_id': data.id
        }, function(err, dbItem) {
          //console.log('get item', err, data, dbItem);
          if(dbItem != null) {
            dbItem.remove();
            return callback(err);
          }
        });
      });

      socket.on('add' + className, function(data, callback) {
        // /console.log("add");
        api.create(function(err, item) {
          var res = {};
          res.model = api.getModel();
          //console.log("model", res.model, item);
          //console.log(item);
          res.item = item;
          return callback(err, res);
        });
      });


      socket.on('get' + className + 'Model', function(data, callback) {
        return callback(null, api.getModel());
      });

      socket.on('get' + className + 'Item', function(data, callback) {
        return api.getItem(data, callback);
      });

      socket.on('get' + className + 's', function(data, callback) {
        //console.log("data.filter", data.filter);
        return api.getItems(data.filter, callback);
      });


      socket.on('updateAll' + className, function(data, callback) {


        console.log("updateALL", data);
        var updated = 1;


        var classInstance = new model();
        classInstance.model = model;
        var models = api.getModel();

        function checkUpdates(err, item) {
          //console.log(updated, err, item, data.items.length);
          if(updated >= data.items.length) {
            //console.log("check Update", item);
            api.reorderHasOneControllers(item[data.parentController], function(err, parentItem) {
              console.log("parent ITEM", parentItem);
              if(_.isFunction(classInstance.doAfterUpdateAll)) {
                return classInstance.doAfterUpdateAll(err, item, null, callback);
              } else {
                return callback(null);
              }
            });

            //api.reorderHasOneControllers(item[0])
            //console.log("doAfterUpdateAll", classInstance.doAfterUpdateAll);
          }
          updated += 1;
        }

        _.each(data.items, function(item) {

          //console.log(className, "received", item);
          api.getItem({
            '_id': item._id
          }, function(err, gItem) {
            //console.log("get", gItem);
            if(gItem != null) {
              for(var attr in models) {
                if(models.hasOwnProperty(attr)) {
                  if(!_.isUndefined(item[attr])) {
                    gItem[attr] = item[attr];
                  }
                }
              }
              console.log("saved", gItem);
              return gItem.saveToDB(checkUpdates);
            }
          });
        })
      });
      socket.on('update' + className, function(data, callback) {
        api.updateItem(data, callback);
      });
    });



  });

});