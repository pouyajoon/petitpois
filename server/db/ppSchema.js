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


exports.schemas.ClassSchema = new mongoose.Schema({
  "name": {
    "type": String,
    "displayName": "Nom"
  },
  "order": {
    "type": Number,
    "default": 0,
    "displayName": "Ordre"
  }
});

exports.Periods = ["Vacances", "Pérriode 1", "Pérriode 2", "Pérriode 3", "Pérriode 4", "Pérriode 5"];
exports.Years = [2012, 2013];
exports.Months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
exports.schemas.DaySchema = new mongoose.Schema({
  "date": {
    "type": Date,
    "displayName": "Date"
  },
  "day": {
    "type": Number,
    "displayName": "Jour"
  },
  "month": {
    "type": String,
    "viewType": "Enum",
    "enum": exports.Months,
    "displayName": "Mois",
    "readOnly": true
  },
  "year": {
    "type": String,
    "viewType": "Enum",
    "enum": exports.Years,
    "displayName": "Année",
    "readOnly": true
  },
  "Period": {
    "type": mongoose.Schema.ObjectId,
    "ref": "Period",
    "viewType": "HasOne",
    "controller": "Period",
    "displayName": "Pérriode"
  },
  "order": {
    "type": Number,
    "default": 0,
    "displayName": "Ordre"
  },
  "DayTemplate": {
    "type": mongoose.Schema.ObjectId,
    "ref": "DayTemplate",
    "controller": "DayTemplate",
    "displayName": "Journée type",
    "viewType": "HasOne"
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
    "viewType": "Enum",
    "sortEnumValues": true,
    "readOnly": true
  },
  "DayTemplate": {
    "type": mongoose.Schema.Types.ObjectId,
    "ref": "DayTemplate",
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



exports.schemas.PeriodSchema = new mongoose.Schema({
  "name": {
    "type": String,
    "displayName": "Nom"
  },
  "startDate": {
    "type": Date,
    "displayName": "Date Début"
  },
  "endDate": {
    "type": Date,
    "displayName": "Date Fin"
  },
  "order": {
    "type": Number,
    "default": 0,
    "displayName": "Ordre"
  },
  "Day": [{
    "type": mongoose.Schema.Types.ObjectId,
    "ref": "Day",
    "controller": "Day",
    "displayName": "Date",
    "viewType": "HasMany"
  }]

});


exports.schemas.DayBookSchema = new mongoose.Schema({
  "dayDate": {
    "type": Date,
    "displayName": "Date"
  },
  "DayTemplate": {
    "type": mongoose.Schema.ObjectId,
    "ref": "DayTemplate",
    "controller": "DayTemplate",
    "displayName": "Journée type",
    "viewType": "HasOne"
  },
  "DayStep": {
    "type": mongoose.Schema.ObjectId,
    "ref": "DayStep",
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
  "DayStep": [{
    "type": mongoose.Schema.Types.ObjectId,
    "ref": "DayStep",
    "controller": "DayStep",
    "displayName": "Etapes",
    "viewType": "HasMany"
  }]

});

// exports.schemas.SkillSubDomainSchema = new mongoose.Schema({
//   "name": {
//     "type": String,
//     "displayName": "Nom"
//   },
//   "skills": [{
//     "type": mongoose.Schema.ObjectId,
//     "ref": "Skill",
//     "controller": "Skill",
//     "displayName": "Compétences",
//     "viewType": "HasMany"
//   }],
//   "SkillDomain": {
//     "type": mongoose.Schema.ObjectId,
//     "ref": "SkillDomain",
//     "controller": "SkillDomain",
//     "displayName": "Domaine",
//     "viewType": "HasOne"
//   },
//   "order": {
//     "type": Number,
//     "default": 0,
//     "displayName": "Ordre"
//   }
// });
// exports.schemas.SkillDomainSchema = new mongoose.Schema({
//   "name": {
//     "type": String,
//     "displayName": "Nom"
//   },
//   "SkillSubDomains": {
//     "type": [exports.schemas.SkillSubDomainSchema],
//     "controller": "SkillSubDomain",
//     "displayName": "Sous-Domaines",
//     "viewType": "HasMany"
//   },
//   "order": {
//     "type": Number,
//     "default": 0,
//     "displayName": "Ordre"
//   }
// });
exports.schemas.SkillSchema = new mongoose.Schema({
  "name": {
    "type": String,
    "displayName": "Nom"
  },
  "description": {
    "type": String,
    "displayName": "Description"
  },
  "order": {
    "type": Number,
    "default": 0,
    "displayName": "Ordre"
  },
  "importId": {
    "type": Number,
    "default": 0,
    "displayName": "Import ID"
  },
  "Parent": {
    "type": mongoose.Schema.Types.ObjectId,
    "ref": "Skill",
    "controller": "Skill",
    "displayName": "Parent",
    "viewType": "HasOne",
    'search': false
  },
  "Children": [{
    "type": mongoose.Schema.Types.ObjectId,
    "ref": "Skill",
    "controller": "Skill",
    "displayName": "Enfants",
    "viewType": "HasMany"
  }]
  ,
  "Classes": [{
    "type": mongoose.Schema.Types.ObjectId,
    "ref": "Class",
    "controller": "Class",
    "displayName": "Classes",
    "viewType": "HasMany"
  }]
});


// ,
//   "SkillSubDomain": {
//     "type": mongoose.Schema.ObjectId,
//     "ref": exports.schemas.SkillSubDomainSchema,
//     "controller": "SkillSubDomain",
//     "displayName": "Sous-Domaine",
//     "viewType": "HasOne"
//   },
// exports.schemas.UserSchema = new mongoose.Schema({
//   "email": {
//     "type": mongoose.SchemaTypes.Email,
//     "index": {
//       "unique": true
//     }
//   },
//   "password": {
//     "type": String
//   }
// });
//exports.schemas.modelControllers = ["DayTemplate", "Studient", "Skill", "DayStep", "SkillDomain", "SkillSubDomain"];
exports.modelControllers = [];
for(var schemaName in exports.schemas) {
  if(exports.schemas.hasOwnProperty(schemaName)) {
    var controllerName = schemaName.replace(/Schema/g, "");
    var modelName = controllerName + "Model";
    //console.log(schemaName, controllerName, modelName);
    exports[modelName] = mongoose.model(controllerName, exports.schemas[schemaName]);
    exports.modelControllers.push(controllerName);
    require('./../classes/heritate').implement(exports[modelName], require("./DataBaseItem"));

  }
}

require('./../classes/heritate').implement(exports.DayStepModel, require("./../classes/DayStep").API);