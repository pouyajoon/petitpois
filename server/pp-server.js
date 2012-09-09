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

// var pageTest = {"path" : "/test", "view" : "test/test.jade", "renderOptions" : {"drawMode" : 'map'}};
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pp');

var serverOptions = {
  port: 8081,
  paths: [pageHome, pageController]
};
//pageAddDayTemplate
console.log('hi');

new Server(serverOptions, function(err, _server) {
  console.log('game initialized, error : ', err);

  var moaSchema = require('./db/moaSchema');


  _server.io.sockets.on('connection', function(socket) {
    console.log('connected');

    socket.on('getControllers', function(callback) {
      console.log("getControllers", moaSchema.modelControllers);
      return callback(moaSchema.modelControllers);
    });

    _.each(moaSchema.modelControllers, function(className) {

      var model = moaSchema[className + "Model"];
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
          console.log('get item', err, data, dbItem);
          if (dbItem != null) {
            dbItem.remove();
            return callback(err);
          }
        });
      });

      socket.on('add' + className, function(data, callback) {
        console.log("add");
        api.create(function(err, item) {
          var res = {};
          res.model = api.getModel();
          console.log("model", res.model);
          res.item = item;
          return callback(err, res);
        });
      });


      socket.on('get' + className + 'Model', function(data, callback) {
        return callback(null, api.getModel());
      });

      socket.on('get' + className + 'Item', function(data, callback) {
        var classInstance = new model();
        classInstance.model = model;
        classInstance.getOne({
          '_id': data._id
        }, function(err, dbItem) {
          console.log('get item', err, data, dbItem);
          if (dbItem != null) {
            return callback(err, dbItem);
          }
        });
      });

      socket.on('get' + className + 's', function(data, callback) {
        api.getItems(function(err, items) {
          return callback(err, items);
        });
      });

      socket.on('update' + className, function(data, callback) {
        var classInstance = new model();
        classInstance.model = model;
        classInstance.getOne({
          '_id': data._id
        }, function(err, item) {
          if (item != null) {
            _.each(api.getModel(), function(attr) {
              item[attr.name] = data[attr.name];
            });
            return item.saveToDB(callback);
          }
        });
      });
    });



  });

});