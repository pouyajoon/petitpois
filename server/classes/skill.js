var moaSchema = require('../db/moaSchema');
var _ = require('underscore');

var SkillModel = moaSchema.SkillModel;

SkillModel.prototype.setup = function(callback){
  this.model = SkillModel;
  return this.saveToDB(callback);
};


exports.create = function(name, callback){
	//console.log("cre");
  var skill = new SkillModel();
  return skill.setup(name, callback);
};

exports.createChildrenAndAddToParent = function(parentName, childrenName, callback){
	exports.create(childrenName, function(err, child){
		//console.log("child ok", err, child);
		child.getOne({"name" : parentName}, function(err, parent){
			//console.log("get parent", parent, err);
			parent.children.push(child);
			parent.saveToDB(function(err, p){
				child.parent = p;
				return child.saveToDB(callback);
			});
		})
	});	
}

exports.getSkills = function(callback){
	SkillModel.find({}, function(err, skills){
		return callback(null, skills);
	});
};

exports.getRootSkills = function(callback){
	SkillModel.find({"parent" : null}, function(err, skills){	
		skills = _.sortBy(skills, function(num){ return num.name; });	
		return callback(null, skills);
	});
};

