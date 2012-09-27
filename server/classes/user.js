var ppSchema = require('../db/ppSchema');
//var Ant = require ('./ant');
var _ = require('underscore');

var UserModel = ppSchema.UserModel;
// var Inventory = require ('./Inventory');
// var InventoryModel = ppSchema.InventoryModel;
// var AntModel = ppSchema.AntModel;


UserModel.prototype.setup = function(_email, _password, callback){
  this.model = UserModel;
  this.email = _email;
  if (!_.isUndefined(_password)){
    this.password = _password;
  }
};

exports.createUser = function(_email, _password, callback){
  var u = new UserModel();
  u.setup(_email, _password, function(err, _u){
    callback(err, u);
  });
};

exports.UserModel = UserModel;

// var User = function(_email, password, callback){

//   require('./heritate').heritate(this, User, require("../db/DataBaseItem"), UserModel);
//   this.data.email = _email;
//   if (typeof password !== "undefined"){
//     this.data.password = password;
//   }

//   new Inventory(function(err, i){
//     this.setInventory(i);
//     this.saveToDB(function(err, user){
//       return callback(err, this);
//     }.bind(this))
//   }.bind(this))
// }


// User.prototype.setInventory = function(_inventory) {
//   this.inventory = _inventory;
//   this.data.inventory = _inventory.data;
// };

// User.prototype.exists = function(callback){
//   this.hasOne({'email' : this.data.email}, callback);
// }

// User.prototype.existsWithPassword = function(callback){
//   return this.hasOne({'email' : this.data.email, 'password' : this.data.password}, callback);
// }
//module.exports = User;


