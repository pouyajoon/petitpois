$(function(){

	new PetitPoids(function(pp){
		new DayTemplate(pp, function(err, dt){
			dt.getAll();
		});
	});
});



function createModelView(id, name, type, readOnly){
	return {
		'id' : id,
		'name' : name,
		'type' : type,
		'readOnly' : (_.isUndefined(readOnly) ? false : readOnly),
	};
}

var DayTemplate = function(petitPoids, callback){
	this.pp = petitPoids;
	this.name = "DayTemplate";
	this.item = {};
	this.modelView = {};
	this.modelView.name = createModelView('name', 'Nom de la journée', 'String');
	this.modelView.startTime = createModelView('startTime', 'Début de la journée', 'Time');
	//this.model._id = createModelReader('_id', 'Identifiant', 'String', true);

	return this.setup(callback);
}

DayTemplate.prototype.setup = function(callback){

	$("#addDayTemplate").click(function(e){
		this.pp.socket.emit('addDayTemplate', {}, function(err, dayTemplate){
			//console.log("dt", err, dayTemplate);
			this.createDOM(dayTemplate);
		}.bind(this));
	}.bind(this));
	this.pp.socket.emit("getDayTemplateModel", {}, function(err, model){
		//console.log("model", err, model);
		this.model = model;
		return callback(null, this);
	}.bind(this));	
}

DayTemplate.prototype.getAll = function() {
	this.pp.socket.emit("getDayTemplates", {}, function(err, dayTemplates){
		//console.log(err, dayTemplates);
		var o = [];
		listIt(o, "dayTemplate", dayTemplates, this.outputOne);
		$("#dayTemplates").html(o.join(''));
		_.each(dayTemplates, function(item){
			var id = "#list-item-" + this.name + "-" + item._id;
			console.log("id", id, $(id));
			$(id).click(function(e){
				console.log("click ", item);
			});
		}.bind(this));

	}.bind(this));		
}

DayTemplate.prototype.outputOne = function(output, dayTemplate){
	return dayTemplate.name + "," + dayTemplate._id + "," + dayTemplate.startTime;
}

DayTemplate.prototype.update = function() {
	//console.log("focusout", this.item);
	this.updateItemFromDOM();
	//console.log("updated", this.item);

	this.pp.socket.emit("updateDayTemplate", this.item, function(err, dt){
		console.log("updated", dt);
		this.getAll();
	}.bind(this));	
};

DayTemplate.prototype.getClassDOMID = function(){
	return this.name + "-" + this.item._id;
}

DayTemplate.prototype.createDOM = function(data){

	this.item = data.item;
	var o = [];
	//console.log("data", data, this.model);
	o.push("<li class='", this.name, "'>");
		o.push("<button id='delete-", this.getClassDOMID() ,"'>Supprimer</button>");
		o.push("<ul id='", this.getClassDOMID() + "' class='", this.name ,"'>");
		this.browseModelView(this.item, function(attr, attrView, value){
			o.push("<li class='", this.getClassDOMID() ,"-structure edit-attr'>");
			o.push(attrView.name, " : ");
			o.push("<input id='", this.getAttrDOMID(attrView.id) ,"' value='", value,"'/>");
			o.push("</li>");
		}.bind(this));
		o.push("</ul>");
	o.push("</li>");
	// o.push("<li class='daytemplate-structure'>", "Identifiant : <input id='step-daytemplate-id' value='",dt._id,"'/></li>");
	// o.push("<li class='daytemplate-structure'>", "Nom de la journée : <input id='step-daytemplate-name' value='",dt.name,"'/></li>");
	// o.push("<li class='daytemplate-structure'>", "Début de la journée : <input id='step-daytemplate-startdate' value='",dateToString(dt.startTime),"'/></li>");
	// o.push("<li class='daytemplate-structure'>", "<ul id='steps'></ul></li>");
	// o.push("<li class='daytemplate-structure'><button id='addDayStep'>Ajouter une étape</button></li>");
		
	$("#" + this.name + "s").html(o.join(''));

	this.browseModelView(this.item, function(attr, attrView, value){
		switch (attrView.type){
			case "Time" :
				setTimePicker(this.getAttrDOMID(attrView.id));
			break;
		}
	}.bind(this));


	$("#" + this.getClassDOMID()+ " .edit-attr").focusout(function(e){
		this.update();
	}.bind(this));



	//setupDayStep();
}


function timeToDate(time){
	//console.log("9", time.substring(0, 2));
	var hours = time.substring(0, 2);
	var minutes = time.substring(3);
	var timeDate = new Date();//Date(0000, 00, 00, hours, minutes, 00);
	timeDate.setTime((hours * 3600 + minutes * 60) * 1000);
	//console.log(hours, minutes, timeDate);
	return timeDate;
}

DayTemplate.prototype.browseModelView = function(item, callback){
	_.each(this.model, function(attr){
		var attrView = this.modelView[attr.name];
		if (!_.isUndefined(attrView)){
			var value = item[attrView.id];
			callback(attr, attrView, value);
		}
	}.bind(this));
}

DayTemplate.prototype.getAttrDOMID = function(id){
	return this.name + "-" + this.item._id + "-" + id;
}

DayTemplate.prototype.updateItemFromDOM = function() {
	this.browseModelView({}, function(attr, attrView, itemValue){
		var DOMValue = $("#" + this.getAttrDOMID(attrView.id)).val();
		switch (attrView.type){
			case "Time" :
				this.item[attrView.id] = timeToDate(DOMValue).toISOString();
				console.log("item -date", this.item[attrView.id]);
			break;
			default:
				this.item[attrView.id] = DOMValue;
			break;
		}		
	}.bind(this));
};


