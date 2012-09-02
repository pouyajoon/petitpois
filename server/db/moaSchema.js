var _ = require("underscore");
var DataBaseItem = require("./DataBaseItem");
var mongoose = require('mongoose');
require('mongoose-types').loadTypes(mongoose);

// exports.ZoneSchema = new mongoose.Schema({
//   "id" : {"type": String, "index": {"unique" : true}},
//   "ants" : [{"type" : mongoose.Schema.ObjectId, "ref" : exports.AntSchema}]
// });
// exports.ZoneModel = mongoose.model('ZoneModel', exports.ZoneSchema);

// exports.InventorySchema = new mongoose.Schema({
//   "ants" : [{"type" : mongoose.Schema.ObjectId, "ref" : exports.AntSchema}],
//   _user : { type: mongoose.Schema.ObjectId, ref: exports.UserSchema }
// });

// exports.InventoryModel = mongoose.model('InventoryModel', exports.InventorySchema);

exports.StudientSchema = new mongoose.Schema({
  "firstname" : {"type" : String},
  "lastname" : {"type" : String},
  "name" : {"type" : String},
  "birthdate" : {"type" : Date}
});




exports.DayStepSchemaTypes = ["ateliers",
            "regroupement",
            "accueils",
            "aide personnalisée",
            "motricité",
            "temps calme",
            "language-lecture",
            "jeux mathématiques",
            "travail collectif",
            "cantine",
            "récréation"];
            
exports.DayStepSchema = new mongoose.Schema({
  "startTime" : {"type" : Date},
  "duration" : {"type" : Number},
  "type" : exports.DayStepSchemaTypes
});


exports.DayStepSchemaTypes = ["ateliers",
            "regroupement",
            "accueils",
            "aide personnalisée",
            "motricité",
            "temps calme",
            "language-lecture",
            "jeux mathématiques",
            "travail collectif",
            "cantine",
            "récréation"];

exports.DayStepSchema = new mongoose.Schema({
  "duration" : {"type" : Date},
  "type" : exports.DayStepSchemaTypes
});

exports.DayTemplateSchema = new mongoose.Schema({
    "daysSteps" : [exports.DayStepSchema],
    "startTime" : {"type" : Date},
    "name" : {"type" : String}
});



exports.SkillSchema = new mongoose.Schema({
  "name" : {"type" : String},
  "description" : {"type" : String},
  "children" : [exports.SkillSchema],
  "parent" : {"type" : mongoose.Schema.ObjectId, "ref" : exports.SkillSchema}
});

exports.UserSchema = new mongoose.Schema({
  "email" : {"type": mongoose.SchemaTypes.Email, "index": {"unique" : true}},
  "password" : {"type" : String},
  "inventory" : {"type" : mongoose.Schema.ObjectId, "ref" : exports.InventorySchema}
});

exports.UserModel = mongoose.model('User', exports.UserSchema);
exports.StudientModel = mongoose.model('Studient', exports.StudientSchema);
exports.SkillModel = mongoose.model('Skill', exports.SkillSchema);

exports.DayStepModel = mongoose.model('DayStep', exports.DayStepSchema);
exports.DayTemplateModel = mongoose.model('DayTemplate', exports.DayTemplateSchema);

//_.extend(exports.UserModel, DataBaseItem);
//_.extend(exports.StudientModel, DataBaseItem);


var registerNodes = ["StudientModel", "SkillModel", "DayStepModel", "DayTemplateModel"];

_.each(registerNodes, function(node){
  exports[node].prototype.saveToDB = DataBaseItem.prototype.saveToDB;
  exports[node].prototype.getOne = DataBaseItem.prototype.getOne;
  exports[node].prototype.hasOne = DataBaseItem.prototype.hasOne;
});

// exports.SkillModel.prototype.saveToDB = DataBaseItem.prototype.saveToDB;
// exports.StudientModel.prototype.saveToDB = DataBaseItem.prototype.saveToDB;
// exports.SkillModel.prototype.saveToDB = DataBaseItem.prototype.saveToDB;
// exports.SkillModel.prototype.getOne = DataBaseItem.prototype.getOne;
// exports.SkillModel.prototype.hasOne = DataBaseItem.prototype.hasOne;
// //require("./../classes/user");
// exports.QueenSchema = new mongoose.Schema({
//   "name" : {"type" : String},
//   "action" : {"type": String, "default" : "idle", "enum" : ["move", "idle", "dig"]},
//   "angle" : {"type" : Number, "default" : 0},
//   "direction" : {"type" : Number, "default" : 0},
//   "position" : {
//     "x" : {"type": Number, "default" : 0},
//     "y" : {"type": Number, "default" : 0}
//   },
//   "size" : {
//     "w" : {"type": Number, "default" : 0},
//     "h" : {"type": Number, "default" : 0}
//   }
// });
// exports.QueenModel = mongoose.model('QueenModel', exports.QueenSchema);

// exports.AntSchema = new mongoose.Schema({
//   "action" : {"type": String, "default" : "idle", "enum" : ["move", "idle", "dig"]},
//   "_inventory" : {"type" : mongoose.Schema.ObjectId, "ref" : exports.InventorySchema},
//   "_zone" : {"type" : mongoose.Schema.ObjectId, "ref" : exports.ZoneSchema},
//   "_user" : {"type" : mongoose.Schema.ObjectId, "ref" : exports.UserSchema},
//   "angle" : {"type" : Number, "default" : 0},
//   "direction" : {"type" : Number, "default" : 0},
//   "position" : {
//     "x" : {"type": Number, "default" : 0},
//     "y" : {"type": Number, "default" : 0}
//   },
//   "size" : {
//     "w" : {"type": Number, "default" : 61},
//     "h" : {"type": Number, "default" : 50}
//   }
// });
// exports.AntModel = mongoose.model('AntModel', exports.AntSchema);


// require('./../classes/heritate').implement(exports.AntModel, require("./DataBaseItem"));
//require('./../classes/heritate').implement(exports.DayTemplateModel, require("./DataBaseItem"));
// require('./../classes/heritate').implement(exports.InventoryModel, require("./DataBaseItem"));
// require('./../classes/heritate').implement(exports.ZoneModel, require("./DataBaseItem"));

