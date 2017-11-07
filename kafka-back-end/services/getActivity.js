var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";


function handle_request(msg, callback){

    var res = {};
    var parentId = msg.parentId;
    var username = msg.username;
    var fileId = msg.fileId;
    var file_name = msg.file_name;
	var User = { username: username}
	var Sort = {activity_id: -1}
    
    
    	MongoClient.connect(url, function(err,db){
                console.log('Connected to mongo at: ' + url);
                var dropbox_userfiles = db.collection("dropbox_userfiles");
                var dropbox_useractivity = db.collection("dropbox_useractivity");
                
                
                dropbox_useractivity.find(User).sort(Sort).limit(10).toArray(function(err, files) {
        		    if (err) {
        		    	throw err;
        		    }
        		    else {
        		    	
        		    	console.log('GET ACTIVITY')
						console.log(files);
            			res.code = "200";
            	        res.value = files;
            	        callback(null, res);
        		    	
        		    }
        		
        		})
                
        });


    
}

exports.handle_request = handle_request;