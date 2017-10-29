var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";
var cors = require('cors');


var routes=require('./routes/index');



MongoClient.connect(url, function(err, db) {
	
	if(err){
		throw err;
	}
	else {
		routes(app,db);
	}	
	
});

app.listen(3002);
module.exports = app;
console.log('Listening on PORT 3002')