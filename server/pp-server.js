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
var pageHome = {
  'path': '/:controller',
  'view': 'home.jade'
};
// var pageTest = {"path" : "/test", "view" : "test/test.jade", "renderOptions" : {"drawMode" : 'map'}};
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pp');

var serverOptions = {
  port: 8081,
  paths: [pageHome]
};
//pageAddDayTemplate

console.log('hi');

new Server(serverOptions, function(err, _server) {
  console.log('game initialized, error : ', err);

  var moaSchema = require('./db/moaSchema');

  var DT = require('./classes/dayTemplate');
  DT.getModel();
  // var DT = moaSchema.DayTemplateModel();
  //var moaSchema = require("./db/moaSchema");
  var Studient = require('./classes/studient');
  var Skill = require('./classes/skill');

  _server.io.sockets.on('connection', function(socket) {
    console.log('connected');

    Studient.getStudients(function(err, studients) {
      console.log(err, studients);
      Skill.getRootSkills(function(err, skills) {

        console.log(skills);
        var res = {
          'studients': studients,
          'skills': skills
        };
        socket.emit('data', res);
      });
    });



    var modelController = ['DayTemplate'];
    _.each(modelController, function(className) {
      var classFile = require('./classes/' + className);


      socket.on('get' + className + 'Model', function(data, callback) {
        return callback(null, classFile.getModel());
      });


      socket.on('delete' + className + 'Item', function(data, callback) {
        var id = data.id;
        var classInstance = new classFile.Model();
        classInstance.model = classFile.Model;
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
        classFile.create(function(err, item) {
          var res = {};
          res.model = classFile.getModel();
          res.item = item;
          return callback(err, res);
        });
      });

      socket.on('get' + className + 'Item', function(data, callback) {
        var classInstance = new classFile.Model();
        classInstance.model = classFile.Model;
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
        classFile.getDayTemplates(function(err, items) {
          return callback(err, items);
        });
      });

      socket.on('update' + className, function(data, callback) {
        var classInstance = new classFile.Model();
        classInstance.model = classFile.Model;
        classInstance.getOne({
          '_id': data._id
        }, function(err, item) {
          //console.log('get', data, err, item);
          if (item != null) {
            _.each(classFile.getModel(), function(attr){
              item[attr.name] = data[attr.name];
            });
            return item.saveToDB(callback);
          }
        });
      });
    });



  });

});