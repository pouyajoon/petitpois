$(function(){



	// new PetitPoids(function(pp){
	// this.setupDayTemplate();

	// });

  	
});


function listIt(output, id, data, draw){
	output.push('<ul class="', id, '">');
	_.each(data, function(d){
		output.push('<li id="list-item-', id, "-", d._id, '" class="list-item list-item-', id,'">');
		output.push(draw(output, d));
		output.push('</li>');
	});
	output.push('</ul>');
}


function addSkillsInDOM(skills){
	var output = [];
	output.push('<ul>');
	$.each(skills, function(i, s){
		output.push('<li>', s.name);
			output.push('<ul>');
			$.each(s.children, function(j, s1){
				output.push('<li>', s1.name, "</li>");
			});
			output.push('</ul>');
		output.push('</li>');
	});	
	output.push('</ul>');
	$('#skills').append(output.join(""));
}

var PetitPoids = function(callback){
	this.socket = io.connect("http://localhost:8081");

	this.socket.on('connect', function(data){
		//console.log('connected', data);
	});

	this.socket.on('data', function(data){
		//console.log(data);
		$.each(data.studients, function(i, s){
			$('body').append(s.name + "</br>");
		});	

		//addSkillsInDOM();
	}.bind(this));

	this.socket.on('disconnect', function(data){
		//console.log('disconnected');
	}.bind(this));
	return callback(this)
}



function dateToString(date){
	console.log(date);
	if (date === null) return "00:00";
}


function setupDayStep(){
	$("#addDayStep").click(function(e){
		addDayStep();
	});
}

steps = [];

function addDayStep(){
	var output = [];
	var stepID = steps.length + 1;
	output.push("<li class='dayStep'>");
		output.push("<ul class='structure'>");
			output.push("<li class='daystep-structure'><button id='deleteStep-", stepID, "'>Supprimer</button></li>");
			output.push("<li class='daystep-structure'>Durée de l'étape : <input id='step-", stepID, "'></input></li>");
		output.push("</ul>");
	output.push("</li>");

	$("#steps").append(output.join(''));
	steps.push($("#step-" + stepID));
	setTimePicker(stepID);
}


function setTimePicker(stepID){
	$('#' + stepID).timepickr({
		trigger: 'click',
		convention: 24, 
		rangeMin : ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']
		//updateLive : false
		,val:"00:00"
		//resetOnBlur:false
	});
}
