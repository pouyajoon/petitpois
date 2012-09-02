var moaSchema = require('./db/moaSchema');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/pp');

//mongoose.disconnect();

var Studient = require ('./classes/studient');
var Skill = require ('./classes/skill');
var DayStep = require ('./classes/dayStep');

function err(err, e){
	console.log("ERROR", err, e);
}
function end(){
	mongoose.disconnect();
};


var Step = require('common').step;

var steps = [];

var date = new Date(0000, 00, 00, 09, 30, 00);
var duration = new Date(0000, 00, 00, 00, 15, 00);
//console.log(date, duration);

Step([
	function(next){ DayStep.create(date, duration, steps, end); }
	// function(steps, next, b) {
	// 	console.log(steps, next, b);
	// }
]);
// DayStep.create(Date.now(), 15, steps, function(err, step, steps){
// 		console.log("steps end", steps);
// 		end();
// 	})

// Step([
//     function(next){ Skill.create("s1", next); },
//     function(next){ Skill.create("s2", next); },
//     function(next){ Skill.create("s3", next); },
//     function(next){ Skill.create("s4", next); },
//     function(next){ Skill.createChildrenAndAddToParent("s1", "s1_1", next); },
//     function(next){ Skill.createChildrenAndAddToParent("s1", "s1_2", next); },
//     function(next){ Skill.createChildrenAndAddToParent("s1_1", "s1_1_1", next); },
//     function(next){ Skill.create("s5", end); }
// ]);

//  Step([
//  	function(next){ Studient.create("Jeanne", next); },
//  	function(next){ Studient.create("Pouya", end); }
// ]);






