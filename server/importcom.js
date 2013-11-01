var fs = require('fs');
var _ = require('underscore');


var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/pp');

var ppSchema = require('./db/ppSchema');
var className = "Skill";
var model = ppSchema[className + "Model"];
var cAPI = require("./classes/ControllerAPI");
var skillApi = new cAPI(model);
//var periodApi = new cAPI(ppSchema["PeriodModel"]);

function getSkillByImportID(id, callback) {
  console.log('id?', id);
  var filter = {
    'importId': id
  };
  skillApi.getItems(filter, function(err, dbItems) {
    if(_.isUndefined(dbItems) || dbItems === null || dbItems.length !== 1) {
      console.log('wrong data with filter ', filter, dbItems, err);
      return callback(null);
    }
    console.log('ERR end', err, dbItems[0]);
    return callback(dbItems[0]);
  });
}


function removeQuotes(a) {
  if(_.isUndefined(a)) {
    return null;
  }
  return a.substr(1, a.length - 2);
}


var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'monCahierJournalV1',
  charset: 'utf8_general_ci'
});

connection.connect();


// WHERE id IN (1, 2707, 3359)
connection.query('SELECT * FROM programmes', function(err, rows, fields) {
  if(err) throw err;



  function loadRow(rowNum) {
    console.log('ROW', rowNum, rows.length);
    if(rowNum >= rows.length) {
      connection.end();
      mongoose.disconnect();
      return;
    }
    var r1 = rows[rowNum];

    (function(r) {
      console.log('r parent_id', r.parent_id);

      if (r.id === 2011 || r.id === 3444){
        return loadRow(rowNum + 1);
      }

      if(r.parent_id !== null) {


        getSkillByImportID(r.parent_id, function(parentSkill) {
          console.log('get item is here', parentSkill);
          if(parentSkill === null) {
            //skillApi.remove(function() {
              return loadRow(rowNum + 1);
            //});
          }

          skillApi.create(function(err, item) {
          item.Parent = parentSkill._id;

            item.name = r.title;
            item.importId = r.id;

            //console.log("R", r);
            //item.Children = [];
            console.log('try fetch item');
            var parentController = {
              'parentAttribute': 'Children'
            };
            skillApi.updateItem({
              'item': item,
              'parentController': parentController
            }, function(err, i) {
              //console.log('item created', i.name);
              // next
              return loadRow(rowNum + 1);
            });


          });


        });


      } else {
        //console.log('parent_id is null');
        skillApi.create(function(err, item) {
          //console.log('CREATE', r);
          //console.log('skill created', item);
          item.name = r.title;
          item.importId = r.id;
          item.Parent = null;
          //item.Children = [];
          skillApi.updateItem({
            'item': item
          }, function(err, i) {
            //console.log('UPDATED', i);
            // next
            //console.log('item created', i.name);
            return loadRow(rowNum + 1);
          });
        });
      }
    }(r1));



  }


  loadRow(0);


  //getSkillByName()
  //console.log('The solution is: ', rows[0].solution);
});



// fs.readFile('./import/programmes.csv', 'utf8', function(err, data) {
//   if(err) throw err;
//   data = data.replace(/&quot;/g, '"');
//   data = data.replace(/�\?\?/g, "'");
//   data = data.replace(/�\?�/g, "↦");
//   data = data.replace(/�\?/g, "É");
//   var lines = data.split('\n');
//   //console.log(lines);
//   //console.log(l);
//   _.each(lines, function(l) {
//     var line = l.split(';');
//     //console.log(line);
//     var id = removeQuotes(line[0]);
//     var parent = removeQuotes(line[1]);
//     var name = removeQuotes(line[4]);
//     if (id === null || name === null){
//   //   console.log(id, parent, name);
//   // console.log(line);      
//     }
//     // var i = parseInt(parent);
//     // if(_.isNaN(i)) {
//     //   console.log(parent, i, name);
//     // }
//     //return false;
//     // skillApi.create(function(err, item) {
//     //   item
//     // });
//     //     for(var i = 0; i < line.length; i += 1) {
//     //       var c = line[i];
//     //       console.log(c);
//     //     };
//   });
//   //console.log(line);
//   //console.log(data);
// });