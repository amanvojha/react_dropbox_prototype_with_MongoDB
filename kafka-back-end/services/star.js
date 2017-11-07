var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";


function handle_request(msg, callback){

    var res = {};
    var parentId = msg.parentId;
    var username = msg.username;
    var fileId = msg.fileId;
    var file_name = msg.file_name;
    var FindFile = {username:username, "fileId":fileId};
    var Set = {$set:{"isStarred":true}};
	var User = { username: username};
	var date = new Date();
	var millisec = date.getTime();
	var Star = {
			username:username,
			"isStarred":true
	}
	
	var Activity = {
			username:username,
			activity_id:millisec,
			activity:"Starred File : " + file_name
	}
    
    
    	MongoClient.connect(url, function(err,db){
                console.log('Connected to mongo at: ' + url);
                var dropbox_userfiles = db.collection("dropbox_userfiles");
                var dropbox_useractivity = db.collection("dropbox_useractivity");
                var User = { username: username,isStarred:true}
                
                dropbox_userfiles.update(FindFile, Set, function(err, files) {
        		    if (err) {
        		    	throw err;
        		    }
        		    else {
        		    		console.log('STAR')
        		    		
        		    	
        			    	dropbox_userfiles.find(Star).toArray(function(err, files) {
        					    if (err) {
        					    	throw err;
        					    }
        					    else {
        					    	
        					    	//Inserty entry in activity collection
        					    	
        					    	dropbox_useractivity.insertOne(Activity, function(err, response) {
        								
        								if(err){
        									console.log('ERROR STAR')
        									throw err;
        								}
        								else {
        									console.log('STAR')
        									console.log(files);
        			            			res.code = "200";
        			            	        res.value = files;
        			            	        callback(null, res);
        								}
        								
        							})
        					    	
        					    	
        					    }
        					
        					})
        		    	
        		    }
        		
        		})
                
        });


    
}

exports.handle_request = handle_request;