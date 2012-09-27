var _ = require("underscore");
var DataBaseItem = require("./DataBaseItem");
var mongoose = require('mongoose');
require('mongoose-types').loadTypes(mongoose);


exports.mongoose = mongoose;
exports.schemas = {};
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
exports.schemas.StudientSchema = new mongoose.Schema({
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
    //"viewType": "Date"
  }
});



exports.DayStepSchemaTypes = ["ateliers", "regroupement", "accueils", "aide personnalisée", "motricité", "temps calme", "language-lecture", "jeux mathématiques", "travail collectif", "cantine", "récréation"];

exports.schemas.DayStepSchema = new mongoose.Schema({
  "duration": {
    "type": Date,
    "displayName": "Durée",
    "viewType": "Time"
  },
  "startTime": {
    "type": Date,
    "displayName": "Horraire Début",
    "viewType": "Time",
    "readOnly": true,
    'hidden': true
  },
  "stepType": {
    "type": String,
    'enum': exports.DayStepSchemaTypes,
    "displayName": "Type de l'étape",
    "viewType": "Enum"
  },
  "DayTemplate": {
    "type": mongoose.Schema.ObjectId,
    "ref": exports.schemas.DayTemplate,
    "controller": "DayTemplate",
    "displayName": "Journée type",
    "viewType": "HasOne"
  },
  "order": {
    "type": Number,
    "default": 0,
    "displayName": "Ordre"
  }
});


exports.schemas.DayBookSchema = new mongoose.Schema({
  "dayDate": {
    "type": Date,
    "displayName": "Date"
  },
  "DayTemplate": {
    "type": mongoose.Schema.ObjectId,
    "ref": exports.schemas.DayTemplate,
    "controller": "DayTemplate",
    "displayName": "Journée type",
    "viewType": "HasOne"
  },
  "DayStep": {
    "type": mongoose.Schema.ObjectId,
    "ref": exports.schemas.DayStep,
    "controller": "DayStep",
    "displayName": "Etape",
    "viewType": "HasOne"
  }  
});


exports.schemas.DayTemplateSchema = new mongoose.Schema({
  "name": {
    "type": String,
    "displayName": "Nom"
  },
  "startTime": {
    "type": Date,
    "displayName": "Début de la journée",
    "viewType": "Time"
  },
  "daySteps": {
    "type": [exports.schemas.DayStepSchema],
    "controller": "DayStep",
    "displayName": "Etapes",
    "viewType": "HasMany"
  }

});

exports.schemas.SkillSubDomainSchema = new mongoose.Schema({
  "name": {
    "type": String,
    "displayName": "Nom"
  },
  "skills": {
    "type": [exports.schemas.SkillSchema],
    "controller": "Skill",
    "displayName": "Compétences",
    "viewType": "HasMany"
  },
  "SkillDomain": {
    "type": mongoose.Schema.ObjectId,
    "ref": exports.schemas.SkillDomainSchema,
    "controller": "SkillDomain",
    "displayName": "Domaine",
    "viewType": "HasOne"
  }
});


exports.schemas.SkillDomainSchema = new mongoose.Schema({
  "name": {
    "type": String,
    "displayName": "Nom"
  },
  "SkillSubDomains": {
    "type": [exports.schemas.SkillSubDomainSchema],
    "controller": "SkillSubDomain",
    "displayName": "Sous-Domaines",
    "viewType": "HasMany"
  }
});

exports.schemas.SkillSchema = new mongoose.Schema({
  "name": {
    "type": String,
    "displayName": "Nom"
  },
  "description": {
    "type": String,
    "displayName": "Description"
  },
  "SkillSubDomain": {
    "type": mongoose.Schema.ObjectId,
    "ref": exports.schemas.SkillSubDomainSchema,
    "controller": "SkillSubDomain",
    "displayName": "Sous-Domaine",
    "viewType": "HasOne"
  }
});



exports.schemas.UserSchema = new mongoose.Schema({
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


//exports.schemas.modelControllers = ["DayTemplate", "Studient", "Skill", "DayStep", "SkillDomain", "SkillSubDomain"];

exports.modelControllers = [];
for (var schemaName in exports.schemas) {
  if (exports.schemas.hasOwnProperty(schemaName)) {
    var controllerName = schemaName.replace(/Schema/g, "");
    var modelName = controllerName + "Model";
    //console.log(schemaName, controllerName, modelName);
    exports[modelName] = mongoose.model(controllerName, exports.schemas[schemaName]);
    exports.modelControllers.push(controllerName);
    require('./../classes/heritate').implement(exports[modelName], require("./DataBaseItem"));

  }
}

require('./../classes/heritate').implement(exports.DayStepModel, require("./../classes/DayStep").API);