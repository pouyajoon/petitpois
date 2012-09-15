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
  "firstname": {
    "type": String,
    "displayName": "Prénom"
  },
  "lastname": {
    "type": String,
    "displayName": "Nom de famille"
  },
  "birthdate": {
    "type": Date,
    "displayName": "Date de naissance"
  }
});

exports.DayStepSchemaTypes = ["ateliers", "regroupement", "accueils", "aide personnalisée", "motricité", "temps calme", "language-lecture", "jeux mathématiques", "travail collectif", "cantine", "récréation"];

exports.DayStepSchema = new mongoose.Schema({
  "duration": {
    "type": Date,
    "displayName": "Durée",
    "viewType": "Time"
  },
  "stepType": {
    "type": String,
    'enum': exports.DayStepSchemaTypes,
    "displayName": "Type de l'étape",
    "viewType": "Enum"
  },
  "DayTemplate": {
    "type": mongoose.Schema.ObjectId,
    "ref": exports.DayTemplate,
    "controller": "DayTemplate",
    "displayName": "Journée type",
    "viewType": "HasOne"
  }
});

exports.DayTemplateSchema = new mongoose.Schema({
  "daySteps": {
    "type": [exports.DayStepSchema],
    "controller": "DayStep",
    "displayName": "Etapes",
    "viewType": "HasMany"
  },
  "startTime": {
    "type": Date,
    "displayName": "Début de la journée",
    "viewType": "Time"
  },
  "name": {
    "type": String,
    "displayName": "Nom"
  }
});


exports.SkillSchema = new mongoose.Schema({
  "name": {
    "type": String,
    "displayName": "Nom"
  },
  "description": {
    "type": String,
    "displayName": "Description"
  },
  //"children": [exports.SkillSchema],
  "parent": {
    "type": mongoose.Schema.ObjectId,
    "ref": exports.SkillSchema,
    "controller": "Skill",
    "displayName": "Parent",
    "viewType": "HasOne"
  }
});

exports.UserSchema = new mongoose.Schema({
  "email": {
    "type": mongoose.SchemaTypes.Email,
    "index": {
      "unique": true
    }
  },
  "password": {
    "type": String
  }
});


exports.modelControllers = ["DayTemplate", "Studient", "Skill", "DayStep"];

_.each(exports.modelControllers, function(controllerName) {
  var modelName = controllerName + "Model";
  var schemaName = controllerName + "Schema";
  exports[modelName] = mongoose.model(controllerName, exports[schemaName]);
  require('./../classes/heritate').implement(exports[modelName], require("./DataBaseItem"));
});