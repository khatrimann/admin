var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  var gfs = Grid(mongoose.connection.db);
  var data_db = [];
  var res_id = [];
  mongoose.connection.db.collection("fs.files", function(err, collection){
    collection.find({}).toArray(function(err, data){
        // console.log(data); // it will print your collection data
        for(var i=0;i<data.length;i++) {
          // console.log(data[i]._id);
          // var readstream = gfs.createReadStream({_id: data[i]._id});
          // readstream.pipe(res);
          //readstream.pipe(res);
          var name = data[i].filename.substr(6,data[i].filename.length);
          res_id.push({id: data[i]._id, name: name});
          console.log("added");
          console.log(res_id);
        }
        res.send(res_id);
    });
});
console.log(res_id);
  //res.send(res_id);
});
router.delete('/:id', (req, res, next) => {
  console.log(req.params.id);
  
  var gfs = Grid(mongoose.connection.db);
  gfs.remove({_id: req.params.id}, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });

  mongoose.connection.db.collection("fs.files", function(err, collection){
    collection.findOne({}).then((data) => {
      var thumbnail = 'public/images/thumbnails/';
      var name = data.filename.substr(22, data.filename.length);  
      console.log(data.filename);
        fs.unlink(data.filename, (err) => {
          console.log(err);
        });
        fs.unlink(thumbnail+'75'+name, (err) => {
          console.log(err);
        });
        fs.unlink(thumbnail+'100'+name, (err) => {
          console.log(err);
        });
        fs.unlink(thumbnail+'125'+name, (err) => {
          console.log(err);
        });
    });
});

 
});

module.exports = router;